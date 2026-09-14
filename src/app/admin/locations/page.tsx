import { setLocationEnabled } from "@/app/admin/actions";
import { SubmitButton } from "@/components/app/SubmitButton";
import { Badge, Empty, ghostButton, Notice, one, PanelTitle } from "@/components/app/ui";
import { Flag } from "@/components/ui/Brand";
import { Icon } from "@/components/ui/Icon";
import { requireAdmin } from "@/lib/auth";
import { gateway, gatewayConfigured, type GatewayLocation } from "@/lib/gateway";

export const metadata = { title: "Locations" };

async function load() {
  if (!gatewayConfigured()) return { locations: [] as GatewayLocation[], error: "", configured: false };
  try {
    return { locations: (await gateway.overview()).locations, error: "", configured: true };
  } catch (error) {
    return { locations: [] as GatewayLocation[], error: error instanceof Error ? error.message : "Gateway unavailable.", configured: true };
  }
}

export default async function LocationsPage({ searchParams }: PageProps<"/admin/locations">) {
  await requireAdmin("/admin/locations");
  const params = await searchParams;
  const { locations, error, configured } = await load();
  const countries = [...new Set(locations.map((location) => location.countryName))];

  return (
    <>
      <PanelTitle eyebrow={<><Icon name="globe" className="size-4" />Locations</>} title="Servers" serif="on and off." description="Turn a server off to stop new connections, for maintenance or abuse. People already connected stay connected until their session ends." />
      <Notice tone={one(params.tone)} text={one(params.notice)} />
      {error && <Notice tone="error" text={error} />}
      {!configured && <section className="rounded-[28px] ring-1 ring-line ring-inset"><Empty icon="server">Add GATEWAY_API_URL and GATEWAY_ADMIN_KEY to .env.local to manage locations.</Empty></section>}
      {configured && locations.length === 0 && !error && <section className="rounded-[28px] ring-1 ring-line ring-inset"><Empty icon="globe">No locations reported.</Empty></section>}

      <div className="grid gap-5 lg:grid-cols-2">
        {countries.map((country) => {
          const group = locations.filter((location) => location.countryName === country);
          return (
            <section key={country} className="rounded-[28px] bg-mist p-6">
              <header className="flex items-center gap-3">
                <Flag code={group[0]?.country ?? ""} className="h-5 w-auto" />
                <h2 className="font-sans text-[17px] font-semibold tracking-normal">{country}</h2>
                <span className="ml-auto text-[13px] text-slate">{group.filter((location) => location.available).length} of {group.length} live</span>
              </header>
              <ul className="mt-5 space-y-2">
                {group.map((location) => (
                  <li key={location.id} className="flex items-center gap-4 rounded-[18px] bg-white px-4 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-ink">{location.displayName}</p>
                      <p className="font-mono text-[12px] text-muted">{location.exitIp} · load {Math.round(location.load * 100)}%</p>
                    </div>
                    {!location.enabled ? <Badge tone="gray">Off</Badge> : location.available ? <Badge tone="mint" dot>Live</Badge> : <Badge tone="coral" dot>Down</Badge>}
                    <form action={setLocationEnabled}>
                      <input type="hidden" name="locationId" value={location.id} />
                      <input type="hidden" name="enabled" value={location.enabled ? "false" : "true"} />
                      <SubmitButton pendingText="…" className={`${ghostButton} h-9 w-24 px-3`}>{location.enabled ? "Turn off" : "Turn on"}</SubmitButton>
                    </form>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
