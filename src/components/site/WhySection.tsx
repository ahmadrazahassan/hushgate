"use client";

import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ExtensionShot } from "@/components/site/ExtensionShot";
import { Reveal, SectionTitle } from "@/components/site/Reveal";
import { AppTile } from "@/components/site/SiteHeader";
import { Icon } from "@/components/ui/Icon";

const ease = [0.2, 0.8, 0.2, 1] as const;

function CardText({ title, body }: { title: string; body: string }) {
  return (
    <div className="relative z-10 max-w-[420px]">
      <h3 className="text-[26px] leading-[1.08] font-bold tracking-[-0.035em] md:text-[32px]">{title}</h3>
      <p className="mt-3 text-[16px] leading-relaxed text-slate">{body}</p>
    </div>
  );
}

/** Card 1: a live session timer in a notch, and the connected popup rising as you scroll. */
function OneTapCard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const [seconds, setSeconds] = useState(12 * 60 + 36);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 0.6, 1], [90, 0, 0]);

  useEffect(() => {
    if (!inView) return;
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [inView]);

  const clock = [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60].map((part) => String(part).padStart(2, "0")).join(":");

  return (
    <div ref={ref} className="relative flex min-h-[560px] flex-col overflow-hidden rounded-[34px] bg-mist px-7 pt-[88px] md:col-span-7 md:min-h-[600px] md:px-10">
      <div className="notch absolute top-0 left-1/2 flex h-[50px] -translate-x-1/2 items-center gap-2.5 rounded-b-[20px] bg-[#0b0d12] pr-5 pl-3 whitespace-nowrap text-white">
        <AppTile size={30} />
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#3ddc97] opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-[#3ddc97]" />
        </span>
        <span className="font-display text-[15px] font-semibold tabular-nums">Connected · {clock}</span>
      </div>
      <CardText title="One tap, and Chrome goes quiet." body="Hushgate connects, checks the tunnel every minute and reconnects by itself. A timer, your real IP and the IP websites see. That is the whole interface." />
      <motion.div style={{ y }} className="mt-auto flex justify-center pt-10">
        <ExtensionShot name="home-connected" className="w-[78%] max-w-[380px] rounded-b-none" />
      </motion.div>
    </div>
  );
}

const exits = [
  { city: "Frankfurt", country: "Germany", ip: "104.238.167.136" },
  { city: "Toronto", country: "Canada", ip: "155.138.149.113" },
  { city: "Los Angeles", country: "United States", ip: "45.77.121.78" },
  { city: "London", country: "United Kingdom", ip: "51.195.44.201" },
  { city: "Tokyo", country: "Japan", ip: "139.180.203.17" },
];

/** Card 2: what websites see keeps changing; your real address never shows. */
function AddressCard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!inView || reduced) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % exits.length), 2600);
    return () => window.clearInterval(timer);
  }, [inView, reduced]);

  const exit = exits[index];

  return (
    <div ref={ref} className="flex min-h-[460px] flex-col justify-between gap-10 rounded-[34px] bg-mist p-7 md:col-span-5 md:min-h-[600px] md:p-10">
      <CardText title="Your real address stays yours." body="Websites, ad networks and public Wi-Fi see a clean, static Hushgate address in the country you choose, never the one your provider gave you." />
      <div className="space-y-2.5">
        <div className="flex items-center justify-between rounded-[22px] bg-white/70 px-5 py-4 ring-1 ring-line/60 ring-inset">
          <span>
            <span className="block text-[13px] text-muted">Your real IP</span>
            <span className="mt-1 block font-display text-[20px] font-semibold tracking-[-0.02em] text-faint blur-[5px] select-none" aria-hidden="true">163.128.9.11</span>
            <span className="sr-only">Hidden from websites</span>
          </span>
          <Icon name="eyeOff" className="size-5 text-muted" />
        </div>
        <div className="relative overflow-hidden rounded-[22px] bg-white px-5 py-4 shadow-[0_20px_40px_-28px_rgba(30,40,120,0.45)] ring-1 ring-line ring-inset">
          <span className="block text-[13px] text-muted">Websites see</span>
          <div className="relative mt-1 h-[52px]" aria-live="polite">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={exit.ip}
                initial={{ y: 26, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -26, opacity: 0 }}
                transition={{ duration: 0.55, ease }}
                className="absolute inset-0"
              >
                <span className="block font-display text-[22px] leading-tight font-bold tracking-[-0.02em] tabular-nums">{exit.ip}</span>
                <span className="flex items-center gap-1.5 text-[14px] text-slate">
                  <span className="size-1.5 rounded-full bg-cobalt" />
                  {exit.city}, {exit.country}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5 border-t border-line pt-3">
            {["Static IP", "Clean reputation"].map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-[#e3f5ec] px-2.5 py-1 text-[12px] font-semibold text-[#127a4c]">
                <Icon name="check" className="size-3" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const history = ["bank statement", "late-night search", "video call", "shopping basket"];

/** Card 3: a browsing history that erases itself, leaving nothing. */
function NoLogsCard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });

  return (
    <div ref={ref} className="flex min-h-[440px] flex-col justify-between gap-8 rounded-[34px] bg-mist p-7 md:col-span-5 md:p-10">
      <div className="flex items-end gap-4">
        <span className="font-display text-[132px] leading-[0.78] font-bold tracking-[-0.07em] md:text-[168px]">0</span>
        <span className="pb-2 font-serif text-[34px] leading-none tracking-[-0.02em] italic md:text-[40px]">logs, ever.</span>
      </div>
      <ul className="space-y-2" aria-hidden="true">
        {history.map((item, index) => (
          <li key={item} className="flex h-10 items-center justify-between rounded-full bg-white/70 px-4 text-[14px]">
            <span className="relative">
              <motion.span initial={{ color: "#596273" }} animate={inView ? { color: "#adb5c3" } : {}} transition={{ duration: 0.4, delay: 0.5 + index * 0.3 }}>
                {item}
              </motion.span>
              <motion.span
                className="absolute top-1/2 -right-1 -left-1 h-[1.5px] origin-left rounded-full bg-ink"
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.55, delay: 0.4 + index * 0.3, ease }}
              />
            </span>
            <motion.span className="text-[12px] font-semibold text-cobalt" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.3, delay: 0.8 + index * 0.3 }}>
              Not kept
            </motion.span>
          </li>
        ))}
      </ul>
      <CardText title="Nothing written down." body="We never record the sites you open. There is no history to hand over, because we never kept one." />
    </div>
  );
}

/** Card 4: packets travel through the tunnel from laptop to website, encrypted. */
function TunnelCard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const reduced = useReducedMotion();

  const node = (label: string, sub: string, icon: React.ReactNode) => (
    <div className="flex w-[88px] flex-col items-center text-center md:w-[110px]">
      <span className="grid size-14 place-items-center rounded-[18px] bg-white shadow-[0_14px_30px_-20px_rgba(30,40,120,0.5)] ring-1 ring-line ring-inset md:size-16">{icon}</span>
      <span className="mt-3 text-[14px] font-semibold">{label}</span>
      <span className="text-[12px] text-muted">{sub}</span>
    </div>
  );

  return (
    <div ref={ref} className="flex min-h-[440px] flex-col gap-10 rounded-[34px] bg-mist p-7 md:col-span-7 md:p-10">
      <CardText title="Safe when the Wi-Fi is not." body="Airports, cafés and hotels are easy to snoop on. Hushgate wraps everything Chrome sends in TLS 1.3 before it leaves your laptop." />
      <div className="my-auto flex items-start justify-between">
        {node("Your laptop", "Café Wi-Fi", <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="4.5" y="5" width="15" height="10" rx="1.8" /><path d="M2.5 19h19" /></svg>)}
        <div className="relative mt-7 h-px flex-1 md:mt-8">
          <div className="absolute inset-0 border-t border-dashed border-ink/20" />
          <span className="absolute -top-7 left-1/2 -translate-x-1/2 rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold tracking-[0.04em] whitespace-nowrap text-cobalt ring-1 ring-cobalt/20">TLS 1.3</span>
          {!reduced && inView && [0, 1, 2].map((packet) => (
            <motion.div
              key={packet}
              className="absolute inset-0"
              initial={{ x: "0%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 2.4, delay: packet * 0.8, repeat: Infinity, ease: "linear" }}
            >
              <span className="absolute -top-[5px] -left-2 h-[10px] w-4 rounded-full bg-cobalt shadow-[0_0_0_3px_rgba(82,103,255,0.18)]" />
            </motion.div>
          ))}
        </div>
        {node("Hushgate", "Encrypted", <AppTile size={34} />)}
        <div className="relative mt-7 h-px flex-1 border-t border-dashed border-ink/20 md:mt-8" />
        {node("Website", "Sees Hushgate", <Icon name="globe" className="size-6" />)}
      </div>
    </div>
  );
}

export function WhySection() {
  return (
    <section id="why" className="container-page scroll-mt-20 py-24 md:py-36" aria-labelledby="why-title">
      <Reveal className="mx-auto max-w-3xl text-center">
        <SectionTitle id="why-title" eyebrow={<><Icon name="gate" className="size-5" />Why Hushgate</>} line="Privacy that stays" serif="out of your way." />
        <p className="mx-auto mt-6 max-w-xl text-[18px] leading-relaxed text-slate md:text-[20px]">
          No dashboards to learn and no settings to babysit. Hushgate works quietly in the background and tells you plainly what is happening.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-4 md:mt-20 md:grid-cols-12">
        <OneTapCard />
        <AddressCard />
        <NoLogsCard />
        <TunnelCard />
      </div>
    </section>
  );
}
