import { endSession } from "@/app/admin/actions";
import { SubmitButton } from "@/components/app/SubmitButton";
import { dangerButton, Empty, Notice, one, PanelTitle } from "@/components/app/ui";
import { Icon } from "@/components/ui/Icon";
import { formatDateTime, relativeTime } from "@/lib/account";
import { requireAdmin } from "@/lib/auth";
import { gateway, gatewayConfigured, type GatewaySession } from "@/lib/gateway";

export const metadata = { title: "Live sessions" };

async function load() {
  if (!gatewayConfigured()) return { sessions: [] as GatewaySession[], error: "", configured: false, now: Date.now() };
  try {
    return { sessions: await gateway.sessions(), error: "", configured: true, now: Date.now() };
  } catch (error) {
    return { sessions: [] as GatewaySession[], error: error instanceof Error ? error.message : "Gateway unavailable.", configured: true, now: Date.now() };
  }
}

export default async function SessionsPage({ searchParams }: PageProps<"/admin/sessions">) {
  await requireAdmin("/admin/sessions");
  const params = await searchParams;
  const { sessions, error, configured, now } = await load();

  return (
    <>
      <PanelTitle eyebrow={<><Icon name="pulse" className="size-4" />Live sessions</>} title="Connected" serif="right now." description="Sessions renew every 15 minutes while someone stays connected. Ending one disconnects that browser immediately." />
      <Notice tone={one(params.tone)} text={one(params.notice)} />
      {error && <Notice tone="error" text={error} />}
      <section className="overflow-hidden rounded-[28px] ring-1 ring-line ring-inset">
        {!configured ? (
          <Empty icon="server">Add GATEWAY_API_URL and GATEWAY_ADMIN_KEY to .env.local to see live sessions.</Empty>
        ) : sessions.length === 0 ? (
          <Empty icon="pulse">{error ? "Could not load sessions." : "Nobody is connected right now."}</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-[14px]">
              <thead>
                <tr className="border-b border-line bg-mist/60 text-[13px] text-slate">
                  {["Account", "Location", "Exit IP", "Started", "Renews by", ""].map((head) => <th key={head} scope="col" className="px-6 py-3.5 font-medium">{head}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {sessions.map((session) => (
                  <tr key={session.sessionId}>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-ink">{session.email || "Legacy access code"}</p>
                      <p className="font-mono text-[12px] text-muted">{session.sessionId.slice(0, 14)}…</p>
                    </td>
                    <td className="px-6 py-4">{session.locationId}</td>
                    <td className="px-6 py-4 font-mono text-[13px]">{session.exitIp}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate">{relativeTime(session.createdAt, now)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate">{formatDateTime(session.expiresAt)}</td>
                    <td className="px-6 py-4 text-right">
                      <form action={endSession}>
                        <input type="hidden" name="sessionId" value={session.sessionId} />
                        <SubmitButton pendingText="Ending…" className={dangerButton}>End</SubmitButton>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
