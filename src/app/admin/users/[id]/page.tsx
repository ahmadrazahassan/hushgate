import Link from "next/link";
import { notFound } from "next/navigation";
import { assignDedicatedIp, deleteUser, extendTrial, releaseDedicatedIp, setBlocked, setPlan, setRole, signOutEverywhere } from "@/app/admin/actions";
import { SubmitButton } from "@/components/app/SubmitButton";
import { Badge, Card, dangerButton, Empty, ghostButton, inputClass, Notice, one, PanelTitle, Row, selectClass } from "@/components/app/ui";
import { Icon } from "@/components/ui/Icon";
import { accessState, formatDateTime, formatDay, planLabels, PROFILE_COLUMNS, relativeTime, type PlanId, type Profile } from "@/lib/account";
import { accessBadge, describeAudit, type AuditEntry } from "@/lib/admin";
import { requireAdmin } from "@/lib/auth";
import { gateway, gatewayConfigured, type GatewayLocation } from "@/lib/gateway";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Manage account" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function gatewayLocations(): Promise<GatewayLocation[] | null> {
  if (!gatewayConfigured()) return null;
  try {
    return (await gateway.overview()).locations;
  } catch {
    return null;
  }
}

async function load(id: string) {
  const supabase = await createClient();
  const [profile, audit, dedicated, invited, locations] = await Promise.all([
    supabase.from("profiles").select(PROFILE_COLUMNS).eq("id", id).maybeSingle<Profile>(),
    supabase.from("admin_audit").select("*").eq("target_id", id).order("created_at", { ascending: false }).limit(20),
    supabase.from("dedicated_ips").select("location_id, assigned_at").eq("user_id", id).maybeSingle<{ location_id: string; assigned_at: string }>(),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("referred_by", id),
    gatewayLocations(),
  ]);
  const referrerId = profile.data?.referred_by;
  const referrer = referrerId ? (await supabase.from("profiles").select("email").eq("id", referrerId).maybeSingle<{ email: string }>()).data : null;
  return {
    profile: profile.data,
    audit: (audit.data as AuditEntry[] | null) ?? [],
    dedicated: dedicated.data,
    invitedCount: invited.count ?? 0,
    referrerEmail: referrer?.email ?? null,
    locations,
    now: Date.now(),
  };
}

function Hidden({ id }: { id: string }) {
  return <input type="hidden" name="userId" value={id} />;
}

const chevron = <Icon name="chevronDown" className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-slate" />;

function referrerId(profile: Profile, email: string | null) {
  if (!profile.referred_by) return "—";
  return <Link href={`/admin/users/${profile.referred_by}`} className="font-semibold text-cobalt hover:text-ink [overflow-wrap:anywhere]">{email ?? "Deleted account"}</Link>;
}

export default async function ManageUserPage({ params, searchParams }: PageProps<"/admin/users/[id]">) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();
  const viewer = await requireAdmin(`/admin/users/${id}`);
  const query = await searchParams;
  const { profile, audit, dedicated, invitedCount, referrerEmail, locations, now } = await load(id);
  const freeLocations = (locations ?? []).filter((location) => !location.dedicatedTo || location.dedicatedTo === profile?.id);
  const dedicatedLocation = dedicated ? locations?.find((location) => location.id === dedicated.location_id) : undefined;
  if (!profile) notFound();

  const self = profile.id === viewer.userId;
  const badge = accessBadge(profile, now);
  const access = accessState(profile, now);

  return (
    <>
      <Link href="/admin/users" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-slate hover:text-ink">
        <Icon name="arrowRight" className="size-4 rotate-180" />
        All users
      </Link>
      <PanelTitle
        eyebrow={<><Badge tone={badge.tone} dot>{badge.label}</Badge>{profile.role === "admin" && <Badge tone="ink">Admin</Badge>}</>}
        title={profile.full_name || profile.email.split("@")[0]}
        description={<span className="[overflow-wrap:anywhere]">{profile.email}</span>}
      />
      <Notice tone={one(query.tone)} text={one(query.notice)} />

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card title="Account" icon="user" tone="white">
          <dl>
            <Row label="Access">{access.allowed ? (access.endsAt ? `Until ${formatDay(access.endsAt)}` : "Unlimited") : badge.label}</Row>
            <Row label="Plan">{planLabels[profile.plan]}</Row>
            <Row label="Trial ends">{formatDay(profile.trial_ends_at)}</Row>
            <Row label="Paid access ends">{profile.access_ends_at ? formatDay(profile.access_ends_at) : "—"}</Row>
            <Row label="Joined">{formatDateTime(profile.created_at)}</Row>
            <Row label="Last sign-in">{relativeTime(profile.last_sign_in_at, now)}</Row>
            <Row label="Favourite location">{profile.preferred_location ?? "Fastest"}</Row>
            <Row label="Product emails">{profile.product_emails ? "Yes" : "No"}</Row>
            <Row label="Invite code"><code className="font-mono text-[12px]">{profile.referral_code ?? "—"}</code></Row>
            <Row label="Invited by">{referrerId(profile, referrerEmail)}</Row>
            <Row label="People they invited">{invitedCount}</Row>
            <Row label="User ID"><code className="font-mono text-[12px]">{profile.id}</code></Row>
          </dl>
        </Card>

        <div className="flex flex-col gap-5">
          {self && <p className="rounded-[20px] bg-cobalt-soft px-5 py-4 text-[14px] text-cobalt-deep">This is your own account. Role, suspension and deletion are locked so you cannot lock yourself out.</p>}

          <Card title="Access and plan" icon="card">
            <div className="grid gap-4 sm:grid-cols-2">
              <form action={extendTrial} className="space-y-2.5">
                <Hidden id={profile.id} />
                <span className="text-[14px] font-medium">Extend free trial</span>
                <span className="relative block">
                  <select name="days" defaultValue="7" className={selectClass}>
                    {[3, 7, 14, 30, 60].map((days) => <option key={days} value={days}>{days} days</option>)}
                  </select>
                  {chevron}
                </span>
                <SubmitButton pendingText="Extending…" className={`${ghostButton} w-full`}>Extend trial</SubmitButton>
              </form>
              <form action={setPlan} className="space-y-2.5">
                <Hidden id={profile.id} />
                <span className="text-[14px] font-medium">Set plan</span>
                <span className="relative block">
                  <select name="plan" defaultValue={profile.plan} className={selectClass}>
                    {(Object.keys(planLabels) as PlanId[]).map((plan) => <option key={plan} value={plan}>{planLabels[plan]}</option>)}
                  </select>
                  {chevron}
                </span>
                <SubmitButton pendingText="Saving…" className={`${ghostButton} w-full`}>Apply plan</SubmitButton>
              </form>
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-muted">A paid plan adds its length to the current paid access. “Free trial” removes paid access. “Complimentary” never expires.</p>
          </Card>

          <Card title="Dedicated IP" icon="pin">
            {dedicated ? (
              <div className="space-y-3">
                <p className="text-[14px] leading-relaxed">
                  <strong className="font-semibold">{dedicatedLocation ? `${dedicatedLocation.displayName}, ${dedicatedLocation.countryName}` : dedicated.location_id}</strong>
                  {dedicatedLocation && <span className="font-mono text-[13px] text-slate"> · {dedicatedLocation.exitIp}</span>}
                  <span className="block text-[13px] text-muted">Reserved {formatDateTime(dedicated.assigned_at)}. Nobody else can connect to it.</span>
                </p>
                <form action={releaseDedicatedIp}>
                  <Hidden id={profile.id} />
                  <SubmitButton pendingText="Releasing…" className={ghostButton}>Release dedicated IP</SubmitButton>
                </form>
              </div>
            ) : (
              <form action={assignDedicatedIp} className="space-y-2.5">
                <Hidden id={profile.id} />
                <span className="text-[14px] font-medium">Reserve one location for this account only</span>
                {locations ? (
                  <span className="relative block">
                    <select name="locationId" required defaultValue="" className={selectClass}>
                      <option value="" disabled>Choose a location</option>
                      {freeLocations.map((location) => <option key={location.id} value={location.id}>{location.displayName} · {location.exitIp}</option>)}
                    </select>
                    {chevron}
                  </span>
                ) : (
                  <input name="locationId" required pattern="[a-z0-9-]{1,40}" placeholder="Location id, for example us-lax-07" className={inputClass} />
                )}
                <SubmitButton pendingText="Reserving…" className={`${ghostButton} w-full`}>Reserve IP</SubmitButton>
                <p className="text-[13px] leading-relaxed text-muted">The location disappears for everyone else and their sessions on it end within a minute. Checkout for this add-on is not live yet, so reserve it after a manual payment.</p>
              </form>
            )}
          </Card>

          {!self && (
            <Card title="Access controls" icon="lock">
              <div className="space-y-5">
                <form action={setBlocked} className="flex flex-col gap-2.5 sm:flex-row">
                  <Hidden id={profile.id} />
                  <input type="hidden" name="blocked" value={profile.blocked ? "false" : "true"} />
                  {!profile.blocked && <input name="reason" maxLength={200} placeholder="Reason (shown to them)" className={`${inputClass} flex-1`} />}
                  <SubmitButton pendingText="Saving…" className={profile.blocked ? `${ghostButton} sm:w-auto` : dangerButton}>{profile.blocked ? "Restore account" : "Suspend"}</SubmitButton>
                </form>
                <div className="flex flex-wrap gap-2.5">
                  <form action={setRole}>
                    <Hidden id={profile.id} />
                    <input type="hidden" name="role" value={profile.role === "admin" ? "user" : "admin"} />
                    <SubmitButton pendingText="Saving…" className={ghostButton}>{profile.role === "admin" ? "Remove admin" : "Make admin"}</SubmitButton>
                  </form>
                  <form action={signOutEverywhere}>
                    <Hidden id={profile.id} />
                    <SubmitButton pendingText="Signing out…" className={ghostButton}>
                      <Icon name="logout" className="size-4" />
                      Sign out everywhere
                    </SubmitButton>
                  </form>
                </div>
                {!gatewayConfigured() && <p className="text-[13px] text-muted">Suspending stops new sign-ins right away. Connect the gateway to also end VPN sessions that are already running.</p>}
              </div>
            </Card>
          )}

          {!self && (
            <Card title="Delete account" icon="trash" tone="white">
              <p className="text-[14px] leading-relaxed text-slate">Permanently deletes the account and its profile. Type <strong className="font-semibold text-ink [overflow-wrap:anywhere]">{profile.email}</strong> to confirm.</p>
              <form action={deleteUser} className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                <Hidden id={profile.id} />
                <input type="hidden" name="email" value={profile.email} />
                <input name="confirm" autoComplete="off" required aria-label="Type the email to confirm" className={`${inputClass} flex-1`} />
                <SubmitButton pendingText="Deleting…" className={dangerButton}>Delete</SubmitButton>
              </form>
            </Card>
          )}
        </div>
      </div>

      <Card title="History" icon="clock">
        {audit.length === 0 ? (
          <Empty icon="clock">No admin changes to this account yet.</Empty>
        ) : (
          <ol className="-my-2 divide-y divide-line">
            {audit.map((entry) => (
              <li key={entry.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-[14px]">{describeAudit(entry)} <span className="text-muted">by {entry.admin_email}</span></span>
                <span className="text-[13px] whitespace-nowrap text-muted">{formatDateTime(entry.created_at)}</span>
              </li>
            ))}
          </ol>
        )}
      </Card>
    </>
  );
}
