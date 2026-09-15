import type { Metadata } from "next";
import Link from "next/link";
import { ExtensionShot } from "@/components/site/ExtensionShot";
import { PageIntro } from "@/components/site/PageIntro";
import { Reveal } from "@/components/site/Reveal";
import { CtaButton } from "@/components/ui/CtaButton";
import { Icon, type IconName } from "@/components/ui/Icon";
import { TRIAL_DAYS } from "@/lib/pricing";
import { reach } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hushgate is installed",
  description: "Hushgate is now in Chrome. Pin it, create your account and connect.",
  robots: { index: false },
};

const next: { icon: IconName; title: string; body: string }[] = [
  { icon: "puzzle", title: "Pin Hushgate", body: "Click the puzzle piece at the top right of Chrome, find Hushgate and press the pin. The gate icon then stays beside your address bar." },
  { icon: "user", title: "Create your account", body: `Open Hushgate and sign up with an email and a password. Your ${TRIAL_DAYS}-day trial starts straight away, with every country unlocked.` },
  { icon: "power", title: "Connect", body: "Press the power button. Hushgate picks the fastest server, or choose a country yourself from Locations." },
];

const worthKnowing: { icon: IconName; title: string; body: string }[] = [
  { icon: "unplug", title: "Turn on the kill switch", body: "If the tunnel ever drops, Chrome stops loading pages until it is back. It lives in Settings and takes one tap." },
  { icon: "split", title: "Let some sites go direct", body: "Split tunnelling keeps your bank or work tools on your normal connection while everything else stays in the tunnel." },
  { icon: "autoPower", title: "Connect automatically", body: "Auto-connect protects you the moment Chrome opens, on the country you used last." },
  { icon: "eye", title: "Check it is working", body: "The popup shows your real address and your Hushgate address side by side, so you can see the change." },
];

export default function InstalledPage() {
  return (
    <>
      <section className="container-page grid items-center gap-14 pt-32 pb-12 md:pt-44 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        <PageIntro
          eyebrow={<><Icon name="check" className="size-5" />Installed</>}
          line="Hushgate is in Chrome."
          serif="Three things left."
          lead={<p>Nice work. Pin the extension, create your account and press the power button; from there you can appear from any of {reach.countries} countries whenever you like.</p>}
          className="max-w-none"
        >
          <Reveal delay={0.25} className="mt-10 flex flex-wrap items-center gap-4">
            <CtaButton href="/signup" tone="cobalt" size="xl" arrow="right">Create your account</CtaButton>
            <Link href="/contact" className="inline-flex h-[60px] items-center gap-2 rounded-[14px] px-5 text-[16px] font-semibold text-slate ring-1 ring-line transition-colors ring-inset hover:text-ink">
              <Icon name="message" className="size-5" />
              Need a hand?
            </Link>
          </Reveal>
          <Reveal delay={0.35}>
            <p className="mt-6 text-[14px] text-slate">{TRIAL_DAYS}-day free trial · No card to start · Cancel any time</p>
          </Reveal>
        </PageIntro>

        <Reveal delay={0.2} className="flex justify-center rounded-[var(--radius-card)] bg-cobalt px-8 pt-12">
          <ExtensionShot name="welcome" priority className="w-full max-w-[350px] translate-y-6" />
        </Reveal>
      </section>

      <section className="container-page py-14 md:py-20" aria-labelledby="next-title">
        <h2 id="next-title" className="sr-only">What to do next</h2>
        <ol className="grid gap-px overflow-hidden border-y border-line bg-line md:grid-cols-3">
          {next.map((step, index) => (
            <li key={step.title} className="bg-paper px-1 py-9 sm:px-8 sm:py-10">
              <Reveal delay={index * 0.08}>
                <div className="flex items-center justify-between">
                  <Icon name={step.icon} className="size-7 text-cobalt" />
                  <span className="font-display text-[13px] font-semibold text-faint tabular-nums">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-9 text-[22px] leading-tight font-semibold tracking-[-0.025em]">{step.title}</h3>
                <p className="mt-2.5 max-w-[36ch] text-[15px] leading-relaxed text-slate">{step.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-page py-14 md:py-20" aria-labelledby="know-title">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 id="know-title" className="text-[36px] leading-[1.02] font-bold tracking-[-0.045em] md:text-[52px]">
            Worth knowing.
            <span className="block font-serif font-normal tracking-[-0.03em] italic">Four settings, once.</span>
          </h2>
          <Link href="/#features" className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-ink transition-opacity hover:opacity-70">
            See every feature
            <Icon name="arrowRight" className="size-[17px]" />
          </Link>
        </div>
        <ul className="mt-12 grid gap-10 border-t border-line pt-12 sm:grid-cols-2 md:gap-x-16 md:gap-y-12">
          {worthKnowing.map((item, index) => (
            <Reveal key={item.title} delay={(index % 2) * 0.08}>
              <li>
                <Icon name={item.icon} className="size-7 text-cobalt" />
                <h3 className="mt-5 text-[19px] font-semibold tracking-[-0.02em]">{item.title}</h3>
                <p className="mt-2 max-w-[46ch] text-[15px] leading-relaxed text-slate">{item.body}</p>
              </li>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="container-page pb-24 md:pb-32">
        <div className="grid gap-8 rounded-[var(--radius-card)] bg-mist px-7 py-12 md:grid-cols-[1fr_auto] md:items-center md:px-12">
          <div>
            <h2 className="text-[28px] leading-tight font-bold tracking-[-0.035em] md:text-[34px]">Something not right?</h2>
            <p className="mt-3 max-w-lg text-[16px] leading-relaxed text-slate">
              If the extension will not connect, or a site behaves strangely, tell us what you saw. The people who build Hushgate answer the email, usually within one working day.
            </p>
          </div>
          <Link href="/contact" className="cta cta-black h-[52px] px-6 text-[16px] justify-self-start md:justify-self-end">
            Contact support
            <Icon name="arrowRight" className="size-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
