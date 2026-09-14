-- Hushgate accounts, access and admin tools.
--
-- * One `profiles` row per Supabase auth user, created by trigger (sign-ups from the
--   website and from the extension both land here).
-- * Access = not blocked AND (inside the free trial OR paid access still running OR complimentary).
--   `account_access()` is the single source of truth, used by the website and the VPN gateway.
-- * People can read their own profile and change only harmless fields. Everything else
--   (role, block, plan, trial) changes through `admin_*` functions that check the caller
--   is an admin and write an audit entry. No service key is needed by the website.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null default '',
  full_name text check (char_length(full_name) <= 80),
  role text not null default 'user' check (role in ('user', 'admin')),
  blocked boolean not null default false,
  blocked_reason text check (char_length(blocked_reason) <= 200),
  plan text not null default 'trial' check (plan in ('trial', 'monthly', 'quarterly', 'half_year', 'yearly', 'complimentary')),
  trial_ends_at timestamptz not null default (now() + interval '14 days'),
  access_ends_at timestamptz,
  preferred_location text check (char_length(preferred_location) <= 40),
  product_emails boolean not null default true,
  last_sign_in_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_email_idx on public.profiles (lower(email));
create index if not exists profiles_created_idx on public.profiles (created_at desc);

create table if not exists public.admin_audit (
  id bigint generated always as identity primary key,
  admin_id uuid references auth.users (id) on delete set null,
  admin_email text not null default '',
  action text not null,
  target_id uuid,
  target_email text,
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists admin_audit_created_idx on public.admin_audit (created_at desc);

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin' and not blocked
  );
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

-- New accounts get a profile; email, name and last sign-in stay in sync with auth.
create or replace function public.handle_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, last_sign_in_at)
  values (
    new.id,
    coalesce(new.email, ''),
    nullif(left(trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), 80), ''),
    new.last_sign_in_at
  )
  on conflict (id) do update
    set email = excluded.email,
        last_sign_in_at = excluded.last_sign_in_at;
  return new;
end;
$$;

drop trigger if exists on_auth_user_changed on auth.users;
create trigger on_auth_user_changed
  after insert or update of email, last_sign_in_at on auth.users
  for each row execute function public.handle_auth_user();

insert into public.profiles (id, email, last_sign_in_at)
select id, coalesce(email, ''), last_sign_in_at from auth.users
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Row-level security and column privileges
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.admin_audit enable row level security;

revoke all on public.profiles from anon;
revoke insert, update, delete, truncate on public.profiles from authenticated;
grant select on public.profiles to authenticated;
grant update (full_name, preferred_location, product_emails) on public.profiles to authenticated;

revoke all on public.admin_audit from anon, authenticated;
grant select on public.admin_audit to authenticated;

drop policy if exists "Read own profile or any profile as admin" on public.profiles;
create policy "Read own profile or any profile as admin"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id or (select public.is_admin()));

drop policy if exists "Update own profile" on public.profiles;
create policy "Update own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists "Admins read the audit log" on public.admin_audit;
create policy "Admins read the audit log"
  on public.admin_audit for select
  to authenticated
  using ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- Access
-- ---------------------------------------------------------------------------

create or replace function public.profile_access(p public.profiles)
returns jsonb
language sql
stable
set search_path = ''
as $$
  select jsonb_build_object(
    'allowed', not p.blocked and (p.plan = 'complimentary' or now() < p.trial_ends_at or (p.access_ends_at is not null and now() < p.access_ends_at)),
    'reason', case
      when p.blocked then 'blocked'
      when p.plan = 'complimentary' then 'complimentary'
      when p.access_ends_at is not null and now() < p.access_ends_at then 'paid'
      when now() < p.trial_ends_at then 'trial'
      else 'expired'
    end,
    'plan', p.plan,
    'trial_ends_at', p.trial_ends_at,
    'access_ends_at', p.access_ends_at,
    'blocked', p.blocked
  );
$$;

-- For the signed-in caller. The gateway calls this with the user's own token.
create or replace function public.account_access()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (select public.profile_access(p) from public.profiles p where p.id = (select auth.uid())),
    jsonb_build_object('allowed', false, 'reason', 'no_profile')
  );
$$;

-- People can close their own account from the website.
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  me uuid := (select auth.uid());
begin
  if me is null then
    raise exception 'Not signed in' using errcode = '28000';
  end if;
  delete from auth.users where id = me;
end;
$$;

-- ---------------------------------------------------------------------------
-- Admin tools
-- ---------------------------------------------------------------------------

create or replace function public.admin_guard()
returns public.profiles
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  caller public.profiles;
begin
  select * into caller from public.profiles where id = (select auth.uid());
  if caller.id is null or caller.role <> 'admin' or caller.blocked then
    raise exception 'Admins only' using errcode = '42501';
  end if;
  return caller;
end;
$$;

create or replace function public.admin_log(caller public.profiles, action text, target public.profiles, detail jsonb)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.admin_audit (admin_id, admin_email, action, target_id, target_email, detail)
  values (caller.id, caller.email, action, target.id, target.email, coalesce(detail, '{}'::jsonb));
$$;

create or replace function public.admin_target(target_id uuid)
returns public.profiles
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  target public.profiles;
begin
  select * into target from public.profiles where id = target_id;
  if target.id is null then
    raise exception 'Account not found' using errcode = 'P0002';
  end if;
  return target;
end;
$$;

create or replace function public.admin_set_blocked(target_id uuid, is_blocked boolean, reason text default null)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller public.profiles := public.admin_guard();
  target public.profiles := public.admin_target(target_id);
begin
  if target.id = caller.id then
    raise exception 'You cannot block your own account' using errcode = '42501';
  end if;
  update public.profiles
    set blocked = is_blocked,
        blocked_reason = case when is_blocked then nullif(left(trim(coalesce(reason, '')), 200), '') else null end
    where id = target.id;
  perform public.admin_log(caller, case when is_blocked then 'block' else 'unblock' end, target, jsonb_build_object('reason', reason));
end;
$$;

create or replace function public.admin_set_role(target_id uuid, new_role text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller public.profiles := public.admin_guard();
  target public.profiles := public.admin_target(target_id);
begin
  if new_role not in ('user', 'admin') then
    raise exception 'Unknown role' using errcode = '22023';
  end if;
  if target.id = caller.id then
    raise exception 'You cannot change your own role' using errcode = '42501';
  end if;
  update public.profiles set role = new_role where id = target.id;
  perform public.admin_log(caller, 'set_role', target, jsonb_build_object('from', target.role, 'to', new_role));
end;
$$;

create or replace function public.admin_extend_trial(target_id uuid, days integer)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller public.profiles := public.admin_guard();
  target public.profiles := public.admin_target(target_id);
begin
  if days is null or days < 1 or days > 365 then
    raise exception 'Choose between 1 and 365 days' using errcode = '22023';
  end if;
  update public.profiles
    set trial_ends_at = greatest(now(), trial_ends_at) + make_interval(days => days)
    where id = target.id;
  perform public.admin_log(caller, 'extend_trial', target, jsonb_build_object('days', days));
end;
$$;

-- Records a plan and moves paid access forward by the plan length (or ends it with 'trial').
create or replace function public.admin_set_plan(target_id uuid, new_plan text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller public.profiles := public.admin_guard();
  target public.profiles := public.admin_target(target_id);
  months integer := case new_plan when 'monthly' then 1 when 'quarterly' then 3 when 'half_year' then 6 when 'yearly' then 12 else 0 end;
begin
  if new_plan not in ('trial', 'monthly', 'quarterly', 'half_year', 'yearly', 'complimentary') then
    raise exception 'Unknown plan' using errcode = '22023';
  end if;
  update public.profiles
    set plan = new_plan,
        access_ends_at = case
          when months > 0 then greatest(now(), coalesce(access_ends_at, now())) + make_interval(months => months)
          when new_plan = 'trial' then null
          else access_ends_at
        end
    where id = target.id;
  perform public.admin_log(caller, 'set_plan', target, jsonb_build_object('from', target.plan, 'to', new_plan));
end;
$$;

create or replace function public.admin_delete_user(target_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller public.profiles := public.admin_guard();
  target public.profiles := public.admin_target(target_id);
begin
  if target.id = caller.id then
    raise exception 'You cannot delete your own account here' using errcode = '42501';
  end if;
  perform public.admin_log(caller, 'delete', target, '{}'::jsonb);
  delete from auth.users where id = target.id;
end;
$$;

create or replace function public.admin_record(action text, target_id uuid, detail jsonb default '{}'::jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller public.profiles := public.admin_guard();
  target public.profiles := public.admin_target(target_id);
begin
  if action not in ('sign_out_everywhere') then
    raise exception 'Unknown action' using errcode = '22023';
  end if;
  perform public.admin_log(caller, action, target, detail);
end;
$$;

create or replace function public.admin_stats()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform public.admin_guard();
  return (
    select jsonb_build_object(
      'total', count(*),
      'new_7d', count(*) filter (where created_at > now() - interval '7 days'),
      'active_7d', count(*) filter (where last_sign_in_at > now() - interval '7 days'),
      'on_trial', count(*) filter (where not blocked and plan = 'trial' and now() < trial_ends_at and (access_ends_at is null or now() >= access_ends_at)),
      'paid', count(*) filter (where not blocked and access_ends_at is not null and now() < access_ends_at),
      'complimentary', count(*) filter (where not blocked and plan = 'complimentary'),
      'expired', count(*) filter (where not blocked and plan <> 'complimentary' and now() >= trial_ends_at and (access_ends_at is null or now() >= access_ends_at)),
      'blocked', count(*) filter (where blocked),
      'admins', count(*) filter (where role = 'admin'),
      'signups_14d', (
        select coalesce(jsonb_agg(jsonb_build_object('day', d::date, 'count', (
          select count(*) from public.profiles p2 where p2.created_at::date = d::date
        )) order by d), '[]'::jsonb)
        from generate_series(current_date - 13, current_date, interval '1 day') as d
      )
    )
    from public.profiles
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- Function privileges: nothing is callable anonymously.
-- ---------------------------------------------------------------------------

revoke execute on function public.is_admin() from public, anon;
revoke execute on function public.handle_auth_user() from public, anon, authenticated;
revoke execute on function public.touch_updated_at() from public, anon, authenticated;
revoke execute on function public.profile_access(public.profiles) from public, anon;
revoke execute on function public.account_access() from public, anon;
revoke execute on function public.delete_my_account() from public, anon;
revoke execute on function public.admin_guard() from public, anon, authenticated;
revoke execute on function public.admin_log(public.profiles, text, public.profiles, jsonb) from public, anon, authenticated;
revoke execute on function public.admin_target(uuid) from public, anon, authenticated;
revoke execute on function public.admin_set_blocked(uuid, boolean, text) from public, anon;
revoke execute on function public.admin_set_role(uuid, text) from public, anon;
revoke execute on function public.admin_extend_trial(uuid, integer) from public, anon;
revoke execute on function public.admin_set_plan(uuid, text) from public, anon;
revoke execute on function public.admin_delete_user(uuid) from public, anon;
revoke execute on function public.admin_record(text, uuid, jsonb) from public, anon;
revoke execute on function public.admin_stats() from public, anon;

grant execute on function public.is_admin() to authenticated;
grant execute on function public.profile_access(public.profiles) to authenticated;
grant execute on function public.account_access() to authenticated;
grant execute on function public.delete_my_account() to authenticated;
grant execute on function public.admin_set_blocked(uuid, boolean, text) to authenticated;
grant execute on function public.admin_set_role(uuid, text) to authenticated;
grant execute on function public.admin_extend_trial(uuid, integer) to authenticated;
grant execute on function public.admin_set_plan(uuid, text) to authenticated;
grant execute on function public.admin_delete_user(uuid) to authenticated;
grant execute on function public.admin_record(text, uuid, jsonb) to authenticated;
grant execute on function public.admin_stats() to authenticated;

-- Make yourself an admin after signing up (run once in the SQL editor):
--   update public.profiles set role = 'admin' where email = 'you@example.com';
