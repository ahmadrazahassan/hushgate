-- Growth: invite-a-friend rewards, dedicated IPs, and the VPN gateway's own lookups.
--
-- * Every profile gets a referral code. A new account created from an invite link
--   stores who invited it; once its email is confirmed both people get 7 extra days
--   (the inviter at most 10 times).
-- * A dedicated IP is one location (one exit IP) reserved for one account by an admin.
--   The gateway hides it from everyone else and ends their sessions on it.
-- * The gateway re-checks access mid-session through gateway_* functions guarded by a
--   secret that only lives on the control server. The database keeps just its SHA-256,
--   so no Supabase service key has to leave Supabase.

-- ---------------------------------------------------------------------------
-- Gateway secret
-- ---------------------------------------------------------------------------

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists private.gateway_secrets (
  id smallint primary key default 1 check (id = 1),
  secret_hash text not null check (secret_hash ~ '^[0-9a-f]{64}$'),
  rotated_at timestamptz not null default now()
);

create or replace function private.gateway_allowed(p_secret text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select char_length(coalesce(p_secret, '')) >= 32
    and exists (
      select 1 from private.gateway_secrets s
      where s.secret_hash = encode(sha256(convert_to(p_secret, 'UTF8')), 'hex')
    );
$$;

revoke execute on function private.gateway_allowed(text) from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Referrals
-- ---------------------------------------------------------------------------

alter table public.profiles add column if not exists referral_code text unique check (referral_code ~ '^[a-z0-9]{8}$');
alter table public.profiles add column if not exists referred_by uuid references public.profiles (id) on delete set null;
create index if not exists profiles_referred_by_idx on public.profiles (referred_by);

create table if not exists public.referral_rewards (
  referee_id uuid primary key references public.profiles (id) on delete cascade,
  referrer_id uuid references public.profiles (id) on delete set null,
  referrer_rewarded boolean not null,
  created_at timestamptz not null default now()
);

create index if not exists referral_rewards_referrer_idx on public.referral_rewards (referrer_id);
alter table public.referral_rewards enable row level security;
revoke all on public.referral_rewards from anon, authenticated;

-- Eight characters without look-alikes (no 0/o, 1/l/i).
create or replace function public.new_referral_code()
returns text
language plpgsql
volatile
set search_path = ''
as $$
declare
  alphabet constant text := 'abcdefghjkmnpqrstuvwxyz23456789';
  code text;
begin
  loop
    code := '';
    for i in 1..8 loop
      code := code || substr(alphabet, 1 + floor(random() * char_length(alphabet))::integer, 1);
    end loop;
    exit when not exists (select 1 from public.profiles where referral_code = code);
  end loop;
  return code;
end;
$$;

update public.profiles set referral_code = public.new_referral_code() where referral_code is null;

-- Adds days to whatever access is running: paid time if any, otherwise the trial.
create or replace function public.grant_bonus_days(p_profile uuid, p_days integer)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.profiles
    set access_ends_at = case when access_ends_at > now() then access_ends_at + make_interval(days => p_days) else access_ends_at end,
        trial_ends_at = case when access_ends_at > now() then trial_ends_at else greatest(now(), trial_ends_at) + make_interval(days => p_days) end
    where id = p_profile and plan <> 'complimentary';
$$;

create or replace function public.reward_referral(p_referee uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  referee public.profiles;
  referrer public.profiles;
  pays_referrer boolean;
begin
  select * into referee from public.profiles where id = p_referee;
  if referee.id is null or referee.referred_by is null or referee.referred_by = referee.id then
    return;
  end if;
  select * into referrer from public.profiles where id = referee.referred_by;
  if referrer.id is null then
    return;
  end if;
  -- One reward decision per inviter at a time, so the cap cannot be raced.
  perform pg_advisory_xact_lock(hashtext('referral:' || referrer.id::text));
  pays_referrer := not referrer.blocked and (
    select count(*) from public.referral_rewards r where r.referrer_id = referrer.id and r.referrer_rewarded
  ) < 10;
  insert into public.referral_rewards (referee_id, referrer_id, referrer_rewarded)
    values (referee.id, referrer.id, pays_referrer)
    on conflict (referee_id) do nothing;
  if not found then
    return;
  end if;
  perform public.grant_bonus_days(referee.id, 7);
  if pays_referrer then
    perform public.grant_bonus_days(referrer.id, 7);
  end if;
end;
$$;

-- New accounts get a profile and a referral code, remember who invited them, and are
-- rewarded once their email is confirmed. Email, name and last sign-in stay in sync.
create or replace function public.handle_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, last_sign_in_at, referral_code, referred_by)
  values (
    new.id,
    coalesce(new.email, ''),
    nullif(left(trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), 80), ''),
    new.last_sign_in_at,
    public.new_referral_code(),
    (select p.id from public.profiles p where p.referral_code = lower(trim(coalesce(new.raw_user_meta_data ->> 'referral_code', ''))))
  )
  on conflict (id) do update
    set email = excluded.email,
        last_sign_in_at = excluded.last_sign_in_at;
  if new.email_confirmed_at is not null then
    perform public.reward_referral(new.id);
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_changed on auth.users;
create trigger on_auth_user_changed
  after insert or update of email, last_sign_in_at, email_confirmed_at on auth.users
  for each row execute function public.handle_auth_user();

create or replace function public.my_referrals()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'code', p.referral_code,
    'rewarded', (select count(*) from public.referral_rewards r where r.referrer_id = p.id and r.referrer_rewarded),
    'joined', (select count(*) from public.referral_rewards r where r.referrer_id = p.id),
    'pending', (select count(*) from public.profiles q where q.referred_by = p.id and not exists (select 1 from public.referral_rewards r where r.referee_id = q.id)),
    'limit', 10,
    'days', 7
  )
  from public.profiles p
  where p.id = (select auth.uid());
$$;

-- ---------------------------------------------------------------------------
-- Dedicated IPs
-- ---------------------------------------------------------------------------

create table if not exists public.dedicated_ips (
  location_id text primary key check (location_id ~ '^[a-z0-9-]{1,40}$'),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  assigned_by uuid references auth.users (id) on delete set null,
  assigned_at timestamptz not null default now()
);

create index if not exists dedicated_ips_assigned_by_idx on public.dedicated_ips (assigned_by);
alter table public.dedicated_ips enable row level security;
revoke all on public.dedicated_ips from anon;
revoke insert, update, delete, truncate on public.dedicated_ips from authenticated;
grant select on public.dedicated_ips to authenticated;

drop policy if exists "Read own dedicated IP or all as admin" on public.dedicated_ips;
create policy "Read own dedicated IP or all as admin"
  on public.dedicated_ips for select
  to authenticated
  using ((select auth.uid()) = user_id or (select public.is_admin()));

create or replace function public.admin_assign_dedicated_ip(target_id uuid, p_location_id text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller public.profiles := public.admin_guard();
  target public.profiles := public.admin_target(target_id);
  location text := lower(trim(coalesce(p_location_id, '')));
begin
  if location !~ '^[a-z0-9-]{1,40}$' then
    raise exception 'Choose a location' using errcode = '22023';
  end if;
  if exists (select 1 from public.dedicated_ips where location_id = location and user_id <> target.id) then
    raise exception 'That IP is already reserved for another account' using errcode = '23505';
  end if;
  delete from public.dedicated_ips where user_id = target.id;
  insert into public.dedicated_ips (location_id, user_id, assigned_by) values (location, target.id, caller.id);
  perform public.admin_log(caller, 'assign_dedicated_ip', target, jsonb_build_object('location_id', location));
end;
$$;

create or replace function public.admin_release_dedicated_ip(target_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller public.profiles := public.admin_guard();
  target public.profiles := public.admin_target(target_id);
  released text;
begin
  delete from public.dedicated_ips where user_id = target.id returning location_id into released;
  if released is not null then
    perform public.admin_log(caller, 'release_dedicated_ip', target, jsonb_build_object('location_id', released));
  end if;
end;
$$;

-- ---------------------------------------------------------------------------
-- Gateway lookups (secret-guarded, callable with the public key)
-- ---------------------------------------------------------------------------

create or replace function public.gateway_account(p_secret text, p_user_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not private.gateway_allowed(p_secret) then
    raise exception 'Not allowed' using errcode = '42501';
  end if;
  return coalesce(
    (
      select public.profile_access(p) || jsonb_build_object(
        'referral_code', p.referral_code,
        'referrals_rewarded', (select count(*) from public.referral_rewards r where r.referrer_id = p.id and r.referrer_rewarded)
      )
      from public.profiles p where p.id = p_user_id
    ),
    jsonb_build_object('allowed', false, 'reason', 'no_profile')
  );
end;
$$;

create or replace function public.gateway_dedicated_ips(p_secret text)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not private.gateway_allowed(p_secret) then
    raise exception 'Not allowed' using errcode = '42501';
  end if;
  return coalesce((select jsonb_agg(jsonb_build_object('location_id', d.location_id, 'user_id', d.user_id)) from public.dedicated_ips d), '[]'::jsonb);
end;
$$;

-- ---------------------------------------------------------------------------
-- Function privileges
-- ---------------------------------------------------------------------------

revoke execute on function public.new_referral_code() from public, anon, authenticated;
revoke execute on function public.grant_bonus_days(uuid, integer) from public, anon, authenticated;
revoke execute on function public.reward_referral(uuid) from public, anon, authenticated;
revoke execute on function public.handle_auth_user() from public, anon, authenticated;
revoke execute on function public.my_referrals() from public, anon;
revoke execute on function public.admin_assign_dedicated_ip(uuid, text) from public, anon;
revoke execute on function public.admin_release_dedicated_ip(uuid) from public, anon;
revoke execute on function public.gateway_account(text, uuid) from public;
revoke execute on function public.gateway_dedicated_ips(text) from public;

grant execute on function public.my_referrals() to authenticated;
grant execute on function public.admin_assign_dedicated_ip(uuid, text) to authenticated;
grant execute on function public.admin_release_dedicated_ip(uuid) to authenticated;
-- Only the gateway calls these, with the public key and its secret. They are useless without the secret,
-- which is 256 bits and never leaves the control server.
grant execute on function public.gateway_account(text, uuid) to anon;
grant execute on function public.gateway_dedicated_ips(text) to anon;
revoke execute on function public.gateway_account(text, uuid) from authenticated;
revoke execute on function public.gateway_dedicated_ips(text) from authenticated;
