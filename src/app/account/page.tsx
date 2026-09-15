import Link from "next/link";
import { AccessCard } from "@/components/app/AccessCard";
import { Card, Notice, one, PanelTitle, Row } from "@/components/app/ui";
import { ChromeLogo } from "@/components/ui/BrandLogos";
import { Icon, type IconName } from "@/components/ui/Icon";
import { firstName, formatDay, planLabels, relativeTime } from "@/lib/account";
import { requireViewer } from "@/lib/auth";
import { site } from "@/lib/site";

export const metadata = { title: "Home" };

/** Rendered per request, so "now" is the time of this request. */
function requestTime() {
  return Date.now();
}

const steps = [
  { title: "Add Hushgate to Chrome", body: "Install the extension and pin it next to the address bar." },
  { title: "Sign in with this account", body: "Same email and password as here." },
  { title: "Tap the power button", body: "Pick a country, or let Hushgate choose the fastest." },
];

export default async function AccountHome({ searchParams }: PageProps<"/account">) {
  const { profile, email } = await requireViewer();
  const params = await searchParams;
  const now = requestTime();

  const actions: { href: string; icon: IconName | "chrome"; title: string; body: string }[] = [
    { href: site.chromeStoreUrl || "/download", icon: "chrome", title: "Get the extension", body: "Install Hushgate in Chrome" },
    { href: "/account/plan", icon: "card", title: "Plan and billing", body: "See your access and prices" },
    { href: "/account/security", icon: "key", title: "Change password", body: "Also used in the extension" },
    { href: `mailto:${site.supportEmail}`, icon: "mail", title: "Get help", body: "We reply within a day" },
  ];

  return (
    <>
      <PanelTitle title={`Hi, ${firstName(profile)}.`} serif="Welcome back." />
      <Notice tone={one(params.tone)} text={one(params.notice)} />

      <AccessCard profile={profile} now={now} />

      <section aria-labelledby="quick-actions">
        <h2 id="quick-actions" className="sr-only">Quick actions</h2>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {actions.map((action) => (
            <li key={action.title}>
              <Link href={action.href} className="group flex h-full flex-col rounded-[24px] bg-mist p-5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_20px_40px_-24px_rgba(21,25,60,0.35)] hover:ring-1 hover:ring-line md:p-6">
                <span className="flex items-center justify-between">
                  {action.icon === "chrome" ? <ChromeLogo className="size-6" /> : <Icon name={action.icon} className="size-6 text-cobalt" />}
                  <Icon name="arrowUpRight" className="size-4 text-faint transition-colors group-hover:text-ink" />
                </span>
                <span className="mt-6 text-[16px] font-semibold tracking-[-0.015em]">{action.title}</span>
                <span className="mt-0.5 text-[13px] text-slate">{action.body}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Card title="Connect in three steps" icon="route">
          <ol className="space-y-5">
            {steps.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white font-display text-[14px] font-bold text-cobalt ring-1 ring-line ring-inset">{index + 1}</span>
                <span>
                  <span className="block text-[16px] font-semibold tracking-[-0.01em]">{step.title}</span>
                  <span className="mt-0.5 block text-[14px] text-slate">{step.body}</span>
                </span>
              </li>
            ))}
          </ol>
        </Card>

        <Card title="Your account" icon="user" action={<Link href="/account/profile" className="text-[13px] font-semibold text-cobalt hover:text-ink">Edit</Link>}>
          <dl>
            <Row label="Email">{email}</Row>
            <Row label="Plan">{planLabels[profile.plan]}</Row>
            <Row label="Member since">{formatDay(profile.created_at)}</Row>
            <Row label="Last sign-in">{relativeTime(profile.last_sign_in_at, now)}</Row>
          </dl>
        </Card>
      </div>
    </>
  );
}
