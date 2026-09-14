"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Reveal, SectionTitle } from "@/components/site/Reveal";
import { AppTile } from "@/components/site/SiteHeader";
import { Icon, type IconName } from "@/components/ui/Icon";

const ease = [0.2, 0.8, 0.2, 1] as const;

type Mode = "without" | "with";

const modes: { id: Mode; label: string; index: string }[] = [
  { id: "without", label: "Without", index: "01" },
  { id: "with", label: "With", index: "02" },
];

const story = {
  without: {
    middle: { title: "Your internet provider", sub: "Sees every site", icon: <Icon name="eye" className="size-6" /> },
    rows: [
      { label: "Websites see", value: "163.128.9.11", note: "Your real address and city" },
      { label: "Your provider sees", value: "Every site you open", note: "And when you open it" },
    ],
  },
  with: {
    middle: { title: "Hushgate", sub: "Frankfurt, Germany", icon: <AppTile size={34} /> },
    rows: [
      { label: "Websites see", value: "104.238.167.136", note: "A Hushgate address in Frankfurt" },
      { label: "Your provider sees", value: "An encrypted connection", note: "Not the sites inside it" },
    ],
  },
} as const;

const benefits: { icon: IconName; title: string; body: string }[] = [
  { icon: "pin", title: "Change your location", body: "A new IP address makes it harder to tell who you are and where you really are." },
  { icon: "eyeOff", title: "Protect your privacy", body: "Websites, trackers and your internet provider stop seeing your activity tied to you." },
  { icon: "lock", title: "Increase your security", body: "Rogue Wi-Fi and snoopers on shared networks cannot read what Chrome sends." },
];

function Node({ title, sub, icon }: { title: string; sub: string; icon: React.ReactNode }) {
  return (
    <div className="flex w-[92px] flex-col items-center text-center sm:w-[120px]">
      <span className="grid size-14 place-items-center rounded-[18px] bg-white text-ink shadow-[0_14px_30px_-20px_rgba(30,40,120,0.5)] ring-1 ring-line ring-inset sm:size-16">{icon}</span>
      <span className="mt-3 text-[13px] leading-tight font-semibold sm:text-[14px]">{title}</span>
      <span className="mt-0.5 text-[12px] text-muted">{sub}</span>
    </div>
  );
}

function Wire({ secure }: { secure: boolean }) {
  return (
    <div className="relative mt-7 h-px flex-1 sm:mt-8">
      <div className={`absolute inset-0 border-t ${secure ? "border-cobalt" : "border-dashed border-ink/25"}`} />
      {secure && (
        <span className="absolute -top-7 left-1/2 -translate-x-1/2 rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold tracking-[0.04em] whitespace-nowrap text-cobalt ring-1 ring-cobalt/25">
          TLS 1.3
        </span>
      )}
    </div>
  );
}

export function VpnExplainer() {
  const [mode, setMode] = useState<Mode>("with");
  const current = story[mode];

  return (
    <section id="what-is-a-vpn" className="container-page scroll-mt-20 py-24 md:py-36" aria-labelledby="vpn-title">
      <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <SectionTitle id="vpn-title" eyebrow={<><Icon name="route" className="size-5" />The basics</>} line="What is a VPN?" serif="A private tunnel." />
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-lg text-[18px] leading-relaxed text-slate md:text-[19px]">
              A VPN is a secure tunnel between you and the internet. Your traffic travels encrypted to a server we run, so websites see that server instead of you, and nobody on the way can read where you go, including your internet provider.
            </p>
          </Reveal>

          <ul className="mt-10 divide-y divide-line border-y border-line">
            {benefits.map((benefit, index) => (
              <li key={benefit.title}>
                <Reveal delay={0.1 + index * 0.08} className="flex gap-4 py-5">
                  <Icon name={benefit.icon} className="mt-0.5 size-6 shrink-0 text-cobalt" />
                  <span>
                    <span className="block text-[17px] font-semibold tracking-[-0.015em]">{benefit.title}</span>
                    <span className="mt-1 block text-[15px] leading-relaxed text-slate">{benefit.body}</span>
                  </span>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>

        <Reveal delay={0.1}>
          <div className="rounded-[34px] bg-mist p-5 sm:p-8 md:p-10">
            <div className="flex justify-center">
              <div role="tablist" aria-label="Compare browsing without and with Hushgate" className="switch-track">
                {modes.map((item) => {
                  const active = item.id === mode;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setMode(item.id)}
                      className={`relative z-10 flex h-[52px] items-center justify-center rounded-full px-6 font-display text-[22px] font-medium tracking-[-0.03em] transition-colors duration-300 sm:h-[60px] sm:px-9 sm:text-[26px] ${active ? "text-ink" : "text-white hover:text-white/80"}`}
                    >
                      {active && (
                        <motion.span
                          layoutId="vpn-switch"
                          className="absolute inset-0 -z-10 rounded-full bg-white shadow-[inset_0_0_0_1.5px_#0b0d12]"
                          transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        />
                      )}
                      {item.label}
                      <sup className="ml-0.5 -translate-y-2 text-[11px] font-semibold tracking-normal">{item.index}</sup>
                    </button>
                  );
                })}
              </div>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
                transition={{ duration: 0.45, ease }}
              >
                <div className="mt-10 flex items-start justify-between">
                  <Node title="You" sub="Chrome" icon={<svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="4.5" y="5" width="15" height="10" rx="1.8" /><path d="M2.5 19h19" /></svg>} />
                  <Wire secure={mode === "with"} />
                  <Node {...current.middle} />
                  <Wire secure={mode === "with"} />
                  <Node title="Website" sub="Any site" icon={<Icon name="globe" className="size-6" />} />
                </div>

                <dl className="mt-10 space-y-2.5">
                  {current.rows.map((row) => (
                    <div key={row.label} className="flex items-center justify-between gap-4 rounded-[20px] bg-white px-5 py-4 ring-1 ring-line/70 ring-inset">
                      <dt className="text-[14px] text-muted">{row.label}</dt>
                      <dd className="text-right">
                        <span className={`block font-display text-[17px] font-bold tracking-[-0.02em] sm:text-[19px] ${mode === "with" ? "text-ink" : "text-coral"}`}>{row.value}</span>
                        <span className="block text-[12px] text-muted">{row.note}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
