"use client";

import { BlurText, Reveal, ScrollBlurText, SectionTitle, type ScrollToken } from "@/components/site/Reveal";
import { AppTile } from "@/components/site/SiteHeader";
import { GlobeArt, PinArt, SealArt } from "@/components/site/InlineArt";
import { Offer, OfferFootnotes } from "@/components/site/Offer";
import { ChromeLogo } from "@/components/ui/BrandLogos";
import { TiltIn, VelocityMarquee } from "@/components/site/Motion";
import { CtaButton } from "@/components/ui/CtaButton";
import { Icon } from "@/components/ui/Icon";
import { TRIAL_DAYS } from "@/lib/pricing";

const moments = [
  { title: "While travelling", body: "Use the internet the way you do at home. Pick your home country and your usual sites feel familiar wherever you land." },
  { title: "On public Wi-Fi", body: "Cafés, airports and hotels share one network with strangers. Hushgate encrypts what Chrome sends before it leaves your laptop." },
  { title: "While shopping", body: "Some stores show different prices in different countries. Switch location and compare before you pay." },
  { title: "Working remotely", body: "Keep client work and research private on shared networks, without changing anything else on your computer." },
  { title: "At home", body: "Your internet provider can see every site you open. With Hushgate on, it only sees an encrypted connection." },
];

/** "When to use it": an editorial list where each moment sharpens into view. */
export function UseCases() {
  return (
    <section className="container-page py-24 md:py-32" aria-labelledby="moments-title">
      <SectionTitle id="moments-title" align="center" eyebrow={<><Icon name="clock" className="size-5" />Every day</>} line="When should I use it?" serif="Every time you browse." />
      <ol className="mx-auto mt-14 max-w-[1080px] border-t border-line md:mt-20">
        {moments.map((moment, index) => (
          <li key={moment.title} className="grid gap-3 border-b border-line py-8 md:grid-cols-[72px_1fr_1.15fr] md:items-baseline md:gap-8 md:py-10">
            <Reveal>
              <span className="font-display text-[14px] font-semibold text-cobalt tabular-nums">{String(index + 1).padStart(2, "0")}</span>
            </Reveal>
            <h3 className="text-[30px] leading-[1.05] font-bold tracking-[-0.04em] md:text-[44px]">
              <BlurText text={moment.title} />
            </h3>
            <Reveal delay={0.15}>
              <p className="text-[16px] leading-relaxed text-slate md:text-[17px]">{moment.body}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}

const inline = (node: React.ReactNode, label: string): ScrollToken => ({ node, label });

const statement: ScrollToken[] = [
  "Hushgate",
  inline(<span className="mx-1 inline-flex translate-y-[0.08em] align-middle"><AppTile size={46} /></span>, ""),
  "is", "about", "quiet", "control.",
  "You", "decide", "where", "Chrome",
  inline(<ChromeLogo className="mx-1 inline-block size-[0.82em] translate-y-[0.06em] align-baseline" />, ""),
  "appears", "to", "be,", "which", "sites", "skip", "the", "tunnel", "and", "when", "protection",
  inline(
    <span className="mx-1 inline-flex h-[0.78em] w-[1.45em] translate-y-[0.1em] items-center rounded-full bg-cobalt p-[0.08em] align-baseline" aria-hidden="true">
      <span className="ml-auto block size-[0.62em] rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.25)]" />
    </span>,
    "",
  ),
  "pauses.", "We", "never", "keep", "a", "record", "of", "where", "you", "go.",
];

const ipStatement: ScrollToken[] = [
  "Every", "Hushgate",
  inline(<GlobeArt className="mx-1" />, ""),
  "address", "is",
  inline(<span className="mx-1 text-cobalt tabular-nums">104.238.167.136</span>, "104.238.167.136"),
  "static",
  inline(<PinArt className="mx-1" />, ""),
  "and",
  inline(<SealArt className="mx-1" />, ""),
  "clean.", "We", "check", "every", "one", "against", "the", "major", "spam", "blocklists,", "and", "it", "stays", "yours", "for", "the", "whole", "session.",
];

/** Clean, static IPs, told the same way as the brand statement. */
export function IpStatement() {
  return (
    <section className="container-page py-24 md:py-36" aria-label="Clean, static IP addresses">
      <ScrollBlurText
        tokens={ipStatement}
        className="mx-auto max-w-[1100px] text-center font-display text-[34px] leading-[1.14] font-bold tracking-[-0.045em] text-ink md:text-[68px]"
      />
    </section>
  );
}

const ribbon: { icon: React.ReactNode; text: string; serif?: boolean }[] = [
  { icon: <Icon name="globe" className="size-[0.7em]" />, text: "50+ countries" },
  { icon: <Icon name="check" className="size-[0.7em]" />, text: "Clean IP addresses", serif: true },
  { icon: <Icon name="pin" className="size-[0.7em]" />, text: "Static IPs" },
  { icon: <Icon name="lock" className="size-[0.7em]" />, text: "TLS 1.3 encryption", serif: true },
  { icon: <Icon name="noLog" className="size-[0.7em]" />, text: "No browsing logs" },
  { icon: <Icon name="unplug" className="size-[0.7em]" />, text: "Kill switch", serif: true },
  { icon: <Icon name="leak" className="size-[0.7em]" />, text: "WebRTC leak shield" },
];

/** A slow ribbon of promises that speeds up and reverses with your scrolling. */
export function PromiseRibbon() {
  return (
    <section className="border-y border-line py-7 md:py-9" aria-label="What every plan includes">
      <VelocityMarquee className="font-display text-[34px] leading-none font-bold tracking-[-0.045em] md:text-[56px]">
        {ribbon.map((item) => (
          <span key={item.text} className="flex items-center gap-[0.35em] pr-[0.9em]">
            <span className="text-cobalt">{item.icon}</span>
            <span className={item.serif ? "font-serif font-normal tracking-[-0.02em] text-slate italic" : "text-ink"}>{item.text}</span>
          </span>
        ))}
      </VelocityMarquee>
    </section>
  );
}

/** The brand statement, sharpening word by word as it scrolls past. */
export function Statement() {
  return (
    <section className="container-page py-24 md:py-40">
      <ScrollBlurText
        tokens={statement}
        className="mx-auto max-w-[1100px] text-center font-display text-[34px] leading-[1.12] font-bold tracking-[-0.045em] text-ink md:text-[68px]"
      />
    </section>
  );
}

/** Closing call to action with the special offer and its footnotes. */
export function FinalCta({ installHref }: { installHref: string }) {
  return (
    <section className="container-page pb-16 md:pb-20" aria-labelledby="final-title">
      <TiltIn>
      <div className="relative overflow-hidden rounded-[40px] bg-mist px-6 pt-[92px] pb-14 text-center md:px-12 md:pb-20">
        <div className="notch absolute top-0 left-1/2 flex h-[50px] -translate-x-1/2 items-center gap-2.5 rounded-b-[20px] bg-[#0b0d12] pr-5 pl-3 whitespace-nowrap text-white">
          <AppTile size={30} />
          <span className="font-display text-[16px] font-bold tracking-[-0.02em]">Hushgate for Chrome</span>
        </div>

        <h2 id="final-title" className="text-[44px] leading-[0.98] font-bold tracking-[-0.05em] md:text-[80px]">
          <BlurText text="Browse quietly." className="block" />
          <BlurText text="Starting today." className="block font-serif font-normal tracking-[-0.03em] italic" delay={0.12} />
        </h2>

        <Reveal delay={0.2}>
          <Offer className="mt-8" />
        </Reveal>

        <Reveal delay={0.3} className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <CtaButton href={installHref} tone="cobalt" size="xl" arrow="right">Get started</CtaButton>
          <CtaButton href={installHref} tone="black" size="xl">
            <ChromeLogo className="size-6" />
            Add to Chrome
          </CtaButton>
        </Reveal>

        <Reveal delay={0.35}>
          <p className="mt-7 text-[14px] text-slate">{TRIAL_DAYS}-day free trial · Clean, static IPs · Cancel any time</p>
        </Reveal>
      </div>
      </TiltIn>

      <OfferFootnotes className="mx-auto mt-8 max-w-3xl px-2" />
    </section>
  );
}
