import Link from "next/link";
import { AccessCard } from "@/components/app/AccessCard";
import { Card, Notice, one, PanelTitle, Row } from "@/components/app/ui";
import { ChromeLogo } from "@/components/ui/BrandLogos";
import { Icon } from "@/components/ui/Icon";
import { firstName, formatDay, planLabels, relativeTime } from "@/lib/account";
import { requireViewer } from "@/lib/auth";

export const metadata = { title: "Home" };

const steps = [
  { title: "Add Hushgate to Chrome", body: "Install the extension and pin it next to the address bar." },
  { title: "Sign in with this account", body: "Use the same email and password you use here." },
  { title: "Tap the power button", body: "Pick a country, or let Hushgate choose the fastest." },
];

/** Rendered per request, so "now" is the time of this request. */
function requestTime() {
  return Date.now();
}

export default async function AccountHome({ searchParams }: PageProps<"/account">) {
  const { profile, email } = await requireViewer();
  const params = await searchParams;
  const now = requestTime();

  return (
    <>
      <PanelTitle
        eyebrow={<><Icon name="home" className="size-4" />Account</>}
        title="Good to see you,"
        serif={`${firstName(profile)}.`}
        description="Everything about your Hushgate account in one place: your access, your plan and your sign-in."
      />
      <Notice tone={one(params.tone)} text={one(params.notice)} />

      <AccessCard profile={profile} now={now} />

      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <Card title="Get connected in Chrome" icon="route">
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
          <Link href="/download" className="mt-7 inline-flex items-center gap-2 text-[14px] font-semibold text-ink underline decoration-line underline-offset-4 hover:decoration-ink">
            <ChromeLogo className="size-4" />
            Installation guide
          </Link>
        </Card>

        <Card title="Your account" icon="user" action={<Link href="/account/profile" className="text-[13px] font-semibold text-cobalt hover:text-ink">Edit</Link>}>
          <dl>
            <Row label="Email">{email}</Row>
            <Row label="Plan">{planLabels[profile.plan]}</Row>
            <Row label="Member since">{formatDay(profile.created_at)}</Row>
            <Row label="Last sign-in">{relativeTime(profile.last_sign_in_at)}</Row>
          </dl>
        </Card>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        {[
          { icon: "globe" as const, title: "50+ countries", body: "Every location is included with your account." },
          { icon: "check" as const, title: "Clean, static IPs", body: "Checked against the major spam blocklists." },
          { icon: "noLog" as const, title: "No browsing logs", body: "We never record the sites you open." },
        ].map((item) => (
          <div key={item.title} className="rounded-[24px] bg-mist p-6">
            <Icon name={item.icon} className="size-6 text-cobalt" />
            <p className="mt-5 text-[17px] font-semibold tracking-[-0.015em]">{item.title}</p>
            <p className="mt-1 text-[14px] text-slate">{item.body}</p>
          </div>
        ))}
      </div>
    </>
  );
}
