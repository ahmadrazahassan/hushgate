"use client";

import { motion, useInView, useMotionTemplate, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { CtaButton } from "@/components/ui/CtaButton";
import { Icon } from "@/components/ui/Icon";
import { IP_REPUTATION_DETAIL, reach } from "@/lib/site";

const proof = {
  left: [
    { value: reach.countries, label: "countries", detail: "Americas, Europe, Asia Pacific, the Middle East and Africa" },
    { value: String(reach.regions), label: "regions", detail: "A server close to you, wherever you are" },
  ],
  right: [
    { value: "Static", label: "IP addresses", detail: "Each server keeps its own fixed address" },
    { value: "Clean", label: "IP reputation", detail: IP_REPUTATION_DETAIL },
  ],
};

/**
 * A sticky scroll scene: the headline is read first, then a huge glass globe
 * rises into the middle of the screen while the proof points arrive around it.
 */
export function LocationsSection({ installHref }: { installHref: string }) {
  const sceneRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const live = useInView(sceneRef, { margin: "0px" });
  const { scrollYProgress } = useScroll({ target: sceneRef, offset: ["start start", "end end"] });

  const still = reduced ?? false;
  // Headline: sharp at first, then lifts away into a blur.
  const titleY = useTransform(scrollYProgress, [0, 0.42, 1], still ? [0, 0, 0] : [0, -140, -140]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.18, 0.42, 1], still ? [1, 1, 1, 1] : [1, 1, 0, 0]);
  const titleBlur = useTransform(scrollYProgress, [0, 0.18, 0.42, 1], still ? [0, 0, 0, 0] : [0, 0, 14, 14]);
  const titleFilter = useMotionTemplate`blur(${titleBlur}px)`;

  // Globe: rises from below the fold and grows into the centre.
  const globeY = useTransform(scrollYProgress, [0, 0.55, 1], still ? ["7%", "7%", "7%"] : ["60%", "7%", "7%"]);
  const globeScale = useTransform(scrollYProgress, [0, 0.55, 1], still ? [1, 1, 1] : [0.6, 1, 1]);

  // Proof points and the call to action arrive once the globe has settled.
  const proofOpacity = useTransform(scrollYProgress, [0, 0.5, 0.68, 1], still ? [1, 1, 1, 1] : [0, 0, 1, 1]);
  const proofY = useTransform(scrollYProgress, [0, 0.5, 0.68, 1], still ? [0, 0, 0, 0] : [40, 40, 0, 0]);
  const ctaOpacity = useTransform(scrollYProgress, [0, 0.66, 0.8, 1], still ? [1, 1, 1, 1] : [0, 0, 1, 1]);

  return (
    <section ref={sceneRef} id="locations" className="relative h-[240vh] scroll-mt-0" aria-labelledby="locations-title">
      <div className="sticky top-0 flex h-dvh flex-col items-center overflow-hidden">
        {/* Headline */}
        <motion.div style={{ y: titleY, opacity: titleOpacity, filter: titleFilter }} className="container-page relative z-20 pt-[16vh] text-center">
          <p className="inline-flex items-center gap-2 font-display text-[17px] font-bold tracking-[-0.02em] text-cobalt md:text-[19px]">
            <Icon name="globe" className="size-5" />
            Locations
          </p>
          <h2 id="locations-title" className="mt-4 text-[52px] leading-[0.94] font-bold tracking-[-0.055em] sm:text-[80px] md:text-[112px]">
            {reach.countries} countries.
            <br />
            <span className="font-serif font-normal tracking-[-0.035em] italic">One quiet tap.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[18px] leading-relaxed text-slate md:text-[20px]">
            Appear in London, Tokyo, São Paulo or Dubai in a second, on clean, static IP addresses that websites trust.
          </p>
        </motion.div>

        {/* The globe: original file at full quality, always turning. */}
        <motion.div
          style={{ y: globeY, scale: globeScale }}
          className="pointer-events-none absolute top-1/2 left-1/2 z-10 aspect-square w-[min(92vw,58vh)] -translate-x-1/2 -translate-y-1/2 sm:w-[min(88vw,66vh)] xl:w-[min(62vw,76vh)]"
        >
          <div className="absolute inset-x-[20%] bottom-[2%] h-[10%] rounded-[50%] bg-[#3446d9]/30 blur-3xl" aria-hidden="true" />
          <div className="globe-turn absolute inset-0" data-paused={!live}>
            <Image src="/globe.webp" alt="A glass globe turning slowly" fill unoptimized sizes="120vh" className="object-cover object-center" />
          </div>
        </motion.div>

        {/* Proof points: beside the globe on wide screens, above it on smaller ones. */}
        <motion.dl style={{ opacity: proofOpacity, y: proofY }} className="container-page absolute inset-x-0 top-[11vh] z-20 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4 xl:hidden">
          {[...proof.left, ...proof.right].map((item) => (
            <div key={item.label} className="text-center">
              <dt className="font-display text-[30px] leading-none font-bold tracking-[-0.05em] sm:text-[40px]">{item.value}</dt>
              <dd className="mt-1.5 text-[13px] font-semibold text-slate sm:text-[14px]">{item.label}</dd>
            </div>
          ))}
        </motion.dl>
        {(["left", "right"] as const).map((side) => (
          <motion.dl
            key={side}
            style={{ opacity: proofOpacity, y: proofY }}
            className={`absolute top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-14 xl:flex ${
              side === "left" ? "left-[max(32px,calc(50%-600px))] items-start text-left" : "right-[max(32px,calc(50%-600px))] items-end text-right"
            }`}
          >
            {proof[side].map((item) => (
              <div key={item.label}>
                <dt className="font-display text-[64px] leading-none font-bold tracking-[-0.055em]">{item.value}</dt>
                <dd className="mt-2 text-[16px] font-semibold text-ink">{item.label}</dd>
                <dd className="mt-1 max-w-[22ch] text-[14px] leading-snug text-slate">{item.detail}</dd>
              </div>
            ))}
          </motion.dl>
        ))}

        <motion.div style={{ opacity: ctaOpacity }} className="absolute inset-x-0 bottom-[4vh] z-20 flex flex-wrap items-center justify-center gap-5 px-5">
          <CtaButton href={installHref} tone="cobalt" size="lg" arrow="right">Choose your country</CtaButton>
          <CtaButton href="#what-is-a-vpn" tone="soft" size="lg" arrow="return" className="ml-1.5 hidden sm:inline-flex">How a VPN works</CtaButton>
        </motion.div>
      </div>
    </section>
  );
}
