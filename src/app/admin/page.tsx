import Link from "next/link";
import { Badge, Card, Empty, Notice, one, PanelTitle, Stat } from "@/components/app/ui";
import { Icon } from "@/components/ui/Icon";
import { PROFILE_COLUMNS, relativeTime, type Profile } from "@/lib/account";
import { accessBadge, describeAudit, type AdminStats, type AuditEntry } from "@/lib/admin";
import { requireAdmin } from "@/lib/auth";
import { gateway, gatewayConfigured, type GatewayOverview } from "@/lib/gateway";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Overview" };

async function load() {
  const supabase = await createClient();
  const [stats, recent, activity] = await Promise.all([
    supabase.rpc("admin_stats"),
    supabase.from("profiles").select(PROFILE_COLUMNS).order("created_at", { ascending: false }).limit(6),
    supabase.from("admin_audit").select("*").order("created_at", { ascending: false }).limit(6),
  ]);
  let overview: GatewayOverview | null = null;
  let gatewayError = "";
  if (gatewayConfigured()) {
    try {
      overview = await gateway.overview();
    } catch (error) {
      gatewayError = error instanceof Error ? error.message : "Gateway unavailable.";
    }
  }
  return {
    stats: (stats.data as AdminStats | null) ?? null,
    statsError: stats.error?.message ?? "",
    recent: (recent.data as Profile[] | null) ?? [],
    activity: (activity.data as AuditEntry[] | null) ?? [],
    overview,
    gatewayError,
    now: Date.now(),
  };
}

export default async function AdminOverview({ searchParams }: PageProps<"/admin">) {
  const viewer = await requireAdmin();
  const params = await searchParams;
  const { stats, statsError, recent, activity, overview, gatewayError, now } = await load();
  const peak = Math.max(1, ...(stats?.signups_14d ?? []).map((point) => point.count));

  return (
    <>
      <PanelTitle
        eyebrow={<><Icon name="gate" className="size-4" />Control panel</>}
        title="Everything,"
        serif="at a glance."
        description={`Signed in as ${viewer.email}. Accounts and access come from Supabase; servers and live sessions from the gateway.`}
      />
      <Notice tone={one(params.tone)} text={one(params.notice)} />
      {statsError && <Notice tone="error" text={statsError} />}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat accent label="Accounts" value={stats?.total ?? "—"} hint={`${stats?.new_7d ?? 0} new this week`} />
        <Stat label="On free trial" value={stats?.on_trial ?? "—"} hint={`${stats?.active_7d ?? 0} signed in this week`} />
        <Stat label="Paid or complimentary" value={stats ? stats.paid + stats.complimentary : "—"} hint={`${stats?.paid ?? 0} paid · ${stats?.complimentary ?? 0} complimentary`} />
        <Stat label="Need attention" value={stats ? stats.expired + stats.blocked : "—"} hint={`${stats?.expired ?? 0} expired · ${stats?.blocked ?? 0} suspended`} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
        <Card title="Sign-ups, last 14 days" icon="users">
          <div className="flex h-44 items-end gap-1.5 md:gap-2.5" role="img" aria-label="Daily sign-ups over the last 14 days">
            {(stats?.signups_14d ?? []).map((point) => (
              <div key={point.day} className="group flex h-full flex-1 flex-col items-center justify-end gap-2" title={`${point.day}: ${point.count}`}>
                <span className="text-[11px] font-semibold text-slate opacity-0 transition-opacity group-hover:opacity-100">{point.count}</span>
                <span className="w-full rounded-t-[8px] bg-cobalt/85 transition-colors group-hover:bg-cobalt" style={{ height: `${Math.max(4, (point.count / peak) * 100)}%` }} />
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between text-[12px] text-muted">
            <span>{stats?.signups_14d[0]?.day ?? ""}</span>
            <span>Today</span>
          </div>
        </Card>

        <Card title="Servers" icon="server" action={<Link href="/admin/locations" className="text-[13px] font-semibold text-cobalt hover:text-ink">Locations</Link>}>
          {!gatewayConfigured() ? (
            <p className="text-[14px] leading-relaxed text-slate">Add GATEWAY_API_URL and GATEWAY_ADMIN_KEY to .env.local to see server health, live sessions and locations here.</p>
          ) : gatewayError ? (
            <p className="text-[14px] text-coral">{gatewayError}</p>
          ) : (
            <ul className="space-y-3">
              {(overview?.servers ?? []).map((server) => (
                <li key={server.region} className="flex items-center justify-between gap-3">
                  <span>
                    <span className="block text-[15px] font-semibold">{server.region}</span>
                    <span className="text-[13px] text-muted">{server.exitIps.length} IPs · {server.activeTunnels} tunnels</span>
                  </span>
                  <Badge tone={server.healthy ? "mint" : "coral"} dot>{server.healthy ? "Healthy" : "Down"}</Badge>
                </li>
              ))}
              <li className="border-t border-line pt-3 text-[13px] text-slate">{overview?.counts.connectedUsers ?? 0} people connected · {overview?.counts.activeSessions ?? 0} sessions</li>
            </ul>
          )}
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Newest accounts" icon="user" action={<Link href="/admin/users" className="text-[13px] font-semibold text-cobalt hover:text-ink">All users</Link>}>
          {recent.length === 0 ? (
            <Empty icon="users">No accounts yet. Sign-ups from the website and the extension appear here.</Empty>
          ) : (
            <ul className="-my-2 divide-y divide-line">
              {recent.map((profile) => {
                const badge = accessBadge(profile, now);
                return (
                  <li key={profile.id}>
                    <Link href={`/admin/users/${profile.id}`} className="flex items-center justify-between gap-4 py-3 hover:text-cobalt">
                      <span className="min-w-0">
                        <span className="block truncate text-[15px] font-semibold">{profile.full_name || profile.email}</span>
                        <span className="block truncate text-[13px] text-muted">{profile.full_name ? `${profile.email} · ` : ""}joined {relativeTime(profile.created_at, now).toLowerCase()}</span>
                      </span>
                      <Badge tone={badge.tone}>{badge.label}</Badge>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card title="Recent admin activity" icon="clock" action={<Link href="/admin/activity" className="text-[13px] font-semibold text-cobalt hover:text-ink">All activity</Link>}>
          {activity.length === 0 ? (
            <Empty icon="clock">Nothing yet. Every change an admin makes is recorded here.</Empty>
          ) : (
            <ul className="-my-2 divide-y divide-line">
              {activity.map((entry) => (
                <li key={entry.id} className="py-3">
                  <p className="text-[14px]"><span className="font-semibold">{entry.admin_email}</span> <span className="text-slate">{describeAudit(entry).toLowerCase()}</span></p>
                  <p className="text-[13px] text-muted">{entry.target_email ?? "Deleted account"} · {relativeTime(entry.created_at, now)}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
