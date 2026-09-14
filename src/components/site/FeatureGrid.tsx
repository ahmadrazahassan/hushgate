"use client";

import { motion, useReducedMotion } from "motion/react";
import { Reveal, SectionTitle } from "@/components/site/Reveal";
import { ChromeLogo } from "@/components/ui/BrandLogos";
import { CtaButton } from "@/components/ui/CtaButton";
import { Icon, type IconName } from "@/components/ui/Icon";

const ease = [0.2, 0.8, 0.2, 1] as const;

const features: { icon: IconName; title: string; body: string }[] = [
  { icon: "unplug", title: "Kill switch", body: "If the tunnel drops, Chrome stops loading pages until it is back. Your real IP never slips out." },
  { icon: "leak", title: "WebRTC leak shield", body: "Video calls and web apps cannot reveal your real address through WebRTC while you are connected." },
  { icon: "pin", title: "Location that matches", body: "Sites that ask where you are see your server's city, so the story stays consistent." },
  { icon: "split", title: "Split tunnelling", body: "Send only the sites you choose through Hushgate, or keep a few trusted sites direct." },
  { icon: "autoPower", title: "Auto-connect", body: "Open Chrome and you are already protected, on the country you used last." },
  { icon: "pause", title: "Pause, not quit", body: "Need your real connection for a moment? Pause, and protection comes back by itself." },
  { icon: "lock", title: "TLS 1.3 encryption", body: "The same modern encryption banks use, on every connection between Chrome and our servers." },
  { icon: "noLog", title: "No browsing logs", body: "We never record the sites you open. There is nothing to sell, share or hand over." },
  { icon: "check", title: "Clean, static IPs", body: "Every server keeps its own fixed address, watched against spam blocklists, so sites see a steady, reputable IP." },
];

const platforms = [
  { name: "Chrome", status: "Available" },
  { name: "Edge and Brave", status: "Usually work" },
  { name: "iPhone and iPad", status: "Coming soon" },
  { name: "Android", status: "Coming soon" },
];

export function FeatureGrid({ installHref }: { installHref: string }) {
  const reduced = useReducedMotion();

  return (
    <section id="features" className="container-page scroll-mt-20 py-24 md:py-36" aria-labelledby="features-title">
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <SectionTitle id="features-title" eyebrow={<><ChromeLogo className="size-5" />Features</>} line="Small extension." serif="Serious protection." />
        <Reveal delay={0.2} className="max-w-sm md:pb-3">
          <p className="text-[17px] leading-relaxed text-slate">Everything you expect from a desktop VPN, built into the browser where you actually spend your day.</p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <CtaButton href={installHref} tone="black" size="md">
              <ChromeLogo className="size-5" />
              Add to Chrome
            </CtaButton>
            <CtaButton href="#pricing" tone="soft" size="md" arrow="return" className="ml-1.5">
              See pricing
            </CtaButton>
          </div>
        </Reveal>
      </div>

      <ul className="mt-16 grid gap-px overflow-hidden border-y border-line bg-line sm:grid-cols-2 md:mt-20 lg:grid-cols-3">
        {features.map((feature, index) => (
          <motion.li
            key={feature.title}
            className="group relative overflow-hidden bg-paper px-1 py-9 sm:px-8 sm:py-10"
            onPointerMove={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
              event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
            }}
            initial={reduced ? false : { opacity: 0, y: 24, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "0px 0px -60px 0px" }}
            transition={{ duration: 0.8, delay: (index % 3) * 0.08, ease }}
          >
            <span
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{ background: "radial-gradient(320px circle at var(--mx, 50%) var(--my, 50%), rgba(82, 103, 255, 0.09), transparent 70%)" }}
              aria-hidden="true"
            />
            <div className="relative flex items-center justify-between">
              <Icon name={feature.icon} className="size-7 text-cobalt transition-transform duration-500 group-hover:-translate-y-0.5" />
              <span className="font-display text-[13px] font-semibold text-faint tabular-nums">{String(index + 1).padStart(2, "0")}</span>
            </div>
            <h3 className="relative mt-10 text-[22px] leading-tight font-semibold tracking-[-0.025em]">{feature.title}</h3>
            <p className="relative mt-2.5 max-w-[34ch] text-[15px] leading-relaxed text-slate">{feature.body}</p>
          </motion.li>
        ))}
      </ul>

      <Reveal className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[14px]">
        {platforms.map((platform) => (
          <span key={platform.name} className="inline-flex items-center gap-2">
            <span className={`size-1.5 rounded-full ${platform.status === "Available" ? "bg-mint" : platform.status === "Usually work" ? "bg-cobalt" : "bg-faint"}`} aria-hidden="true" />
            <span className="font-semibold text-ink">{platform.name}</span>
            <span className="text-muted">{platform.status}</span>
          </span>
        ))}
      </Reveal>
    </section>
  );
}
