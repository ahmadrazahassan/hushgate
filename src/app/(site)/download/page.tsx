import type { Metadata } from "next";
import Link from "next/link";
import { ExtensionShot } from "@/components/site/ExtensionShot";
import { PageIntro } from "@/components/site/PageIntro";
import { Reveal } from "@/components/site/Reveal";
import { StoreBadges } from "@/components/site/StoreBadges";
import { ChromeLogo } from "@/components/ui/BrandLogos";
import { ButtonLink } from "@/components/ui/Button";
import { CtaButton } from "@/components/ui/CtaButton";
import { Icon, type IconName } from "@/components/ui/Icon";
import { TRIAL_DAYS } from "@/lib/pricing";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Download for Chrome",
  description: "Install the Hushgate extension for Google Chrome in under a minute, then connect from more than 50 countries.",
};

const steps: { icon: IconName; title: string; body: string; shot: "welcome" | "sign-in" | "home-connected" | "locations" }[] = [
  { icon: "download", title: "Add it to Chrome", body: "Click Add to Chrome, then Add extension. Nothing to download by hand, and no restart.", shot: "welcome" },
  { icon: "puzzle", title: "Pin it to the toolbar", body: "Open Chrome's puzzle-piece menu and pin Hushgate so it sits next to the address bar.", shot: "sign-in" },
  { icon: "user", title: "Create your account", body: `An email and a password, and your ${TRIAL_DAYS}-day trial starts. No card needed.`, shot: "home-connected" },
  { icon: "power", title: "Press the power button", body: "Connect to the fastest server, or pick a country from Locations whenever you like.", shot: "locations" },
];

const requirements: { icon: IconName; title: string; body: string }[] = [
  { icon: "chrome", title: "Chrome 116 or newer", body: "On Windows, macOS, Linux and ChromeOS. Edge, Brave and other Chromium browsers usually work too." },
  { icon: "signal", title: "Around 2 MB", body: "The extension is small, updates itself through the Web Store and adds no background app to your computer." },
  { icon: "phone", title: "iPhone and Android soon", body: "Apps are on the way. Your account will work on them with no extra charge." },
];

export default function DownloadPage() {
  const live = Boolean(site.chromeStoreUrl);
  const install = site.chromeStoreUrl || "/signup";

  return (
    <>
      <section className="container-page grid items-center gap-14 pt-32 pb-16 md:pt-44 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        <PageIntro
          eyebrow={<><ChromeLogo className="size-5" />Google Chrome</>}
          line="Hushgate for Chrome."
          serif="One click away."
          lead={<p>A browser VPN that installs in seconds: encrypted traffic, a kill switch and more than 50 countries, without touching the rest of your computer.</p>}
          className="max-w-none"
        >
          {live ? (
            <Reveal delay={0.25} className="mt-10 flex flex-wrap items-center gap-4">
              <CtaButton href={site.chromeStoreUrl} tone="cobalt" size="xl" arrow="right">
                <ChromeLogo className="size-6" />
                Add to Chrome
              </CtaButton>
              <CtaButton href="/signup" tone="black" size="xl">Start free trial</CtaButton>
            </Reveal>
          ) : (
            <Reveal delay={0.25} className="mt-10 max-w-xl rounded-[var(--radius-card)] bg-mist p-7 md:p-8">
              <Icon name="clock" className="size-6 text-cobalt" />
              <p className="mt-4 font-display text-[22px] leading-tight font-bold tracking-[-0.03em]">Coming to the Chrome Web Store</p>
              <p className="mt-2 text-[16px] leading-relaxed text-slate">Hushgate is in review. Leave your email and we will tell you the moment it goes live, with your trial ready to start.</p>
              <ButtonLink href={`mailto:${site.supportEmail}?subject=Tell%20me%20when%20Hushgate%20is%20live`} variant="ink" className="mt-6">
                <Icon name="mail" className="size-[18px]" />
                Notify me
              </ButtonLink>
            </Reveal>
          )}
          <Reveal delay={0.35}>
            <p className="mt-6 text-[14px] text-slate">{TRIAL_DAYS}-day free trial · No card to start · Cancel any time</p>
          </Reveal>
        </PageIntro>

        <Reveal delay={0.2} className="flex justify-center rounded-[var(--radius-card)] bg-cobalt px-8 pt-12">
          <ExtensionShot name="home-ready" priority className="w-full max-w-[360px] translate-y-6" />
        </Reveal>
      </section>

      <section className="container-page py-16 md:py-24" aria-labelledby="setup-title">
        <div className="flex flex-col justify-between gap-6 border-t border-line pt-12 md:flex-row md:items-end">
          <h2 id="setup-title" className="text-[38px] leading-[1.02] font-bold tracking-[-0.045em] md:text-[56px]">
            Set up in a minute.
            <span className="block font-serif font-normal tracking-[-0.03em] italic">Four small steps.</span>
          </h2>
          <p className="max-w-sm text-[16px] leading-relaxed text-slate">Everything happens inside Chrome. There is no installer, no driver and no system-wide setting to undo later.</p>
        </div>

        <ol className="mt-14 grid gap-px overflow-hidden border-y border-line bg-line md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className="bg-paper px-1 py-9 sm:px-8">
              <Reveal delay={index * 0.08}>
                <div className="flex items-center justify-between">
                  <Icon name={step.icon} className="size-7 text-cobalt" />
                  <span className="font-display text-[13px] font-semibold text-faint tabular-nums">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-8 text-[21px] leading-tight font-semibold tracking-[-0.025em]">{step.title}</h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-slate">{step.body}</p>
                <div className="mt-7 flex h-[220px] justify-center overflow-hidden rounded-[22px] bg-mist px-5 pt-7">
                  <ExtensionShot name={step.shot} className="h-auto w-full max-w-[210px] self-start rounded-b-none shadow-[0_0_0_1px_rgba(21,25,34,0.06)]" />
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-page pb-16 md:pb-24" aria-labelledby="needs-title">
        <h2 id="needs-title" className="sr-only">What you need</h2>
        <ul className="grid gap-10 border-t border-line pt-12 md:grid-cols-3 md:gap-12">
          {requirements.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.08}>
              <li>
                <Icon name={item.icon} className="size-7 text-cobalt" />
                <h3 className="mt-5 text-[19px] font-semibold tracking-[-0.02em]">{item.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate">{item.body}</p>
              </li>
            </Reveal>
          ))}
        </ul>
        <div className="mt-12 border-t border-line pt-10">
          <p className="font-display text-[22px] leading-tight font-bold tracking-[-0.03em]">Hushgate for phones</p>
          <p className="mt-2 max-w-md text-[15px] leading-relaxed text-slate">Apps for iPhone and Android are on the way. Sign up now and the same account will work there.</p>
          <StoreBadges className="mt-6" />
        </div>
      </section>

      <section className="container-page pb-24 md:pb-32">
        <div className="rounded-[var(--radius-card)] bg-mist px-7 py-12 text-center md:px-12 md:py-16">
          <h2 className="text-[34px] leading-[1.02] font-bold tracking-[-0.045em] md:text-[52px]">
            Ready when you are.
            <span className="block font-serif font-normal tracking-[-0.03em] italic">Quiet from the first tab.</span>
          </h2>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <CtaButton href={install} tone="cobalt" size="lg" arrow="right">
              <ChromeLogo className="size-5" />
              {live ? "Add to Chrome" : "Start free trial"}
            </CtaButton>
            <Link href="/contact" className="inline-flex h-[52px] items-center gap-2 rounded-[14px] px-5 text-[15px] font-semibold text-slate ring-1 ring-line transition-colors ring-inset hover:text-ink">
              <Icon name="message" className="size-[18px]" />
              Ask a question first
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
