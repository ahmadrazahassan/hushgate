"use client";

import {
  animate,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { fullRange } from "@/components/site/Reveal";

/**
 * Moves its children against the page scroll. Positive `speed` drifts down
 * (slower than the page), negative drifts up (faster than the page).
 */
export function Parallax({ children, speed = 0.15, className = "" }: { children: ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [speed * -220, speed * 220]);
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

/** Hero layers that react to the first screen of scrolling: drift, fade and scale. */
export function HeroLayer({
  children,
  className = "",
  y = 0,
  fade = false,
  scale = 1,
  blur = false,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  fade?: boolean;
  scale?: number;
  blur?: boolean;
}) {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const travel = useTransform(scrollY, [0, 900], [0, reduced ? 0 : y]);
  const opacity = useTransform(scrollY, [0, 700], [1, fade && !reduced ? 0 : 1]);
  const size = useTransform(scrollY, [0, 900], [1, reduced ? 1 : scale]);
  const blurAmount = useTransform(scrollY, [120, 700], [0, blur && !reduced ? 10 : 0]);
  const filter = useTransform(blurAmount, (value) => (value > 0.05 ? `blur(${value}px)` : "none"));
  return (
    <motion.div style={{ y: travel, opacity, scale: size, filter }} className={className}>
      {children}
    </motion.div>
  );
}

/** A number that counts up once it scrolls into view. */
export function CountUp({ to, suffix = "", className = "" }: { to: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = useReducedMotion();
  const [value, setValue] = useState(reduced ? to : 0);

  useEffect(() => {
    if (!inView || reduced) return;
    const controls = animate(0, to, { duration: 1.6, ease: [0.2, 0.8, 0.2, 1], onUpdate: (latest) => setValue(Math.round(latest)) });
    return () => controls.stop();
  }, [inView, reduced, to]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {value}
      {suffix}
    </span>
  );
}

/**
 * An endless line of words that drifts sideways, speeds up with your scrolling
 * and turns around when you scroll back up.
 */
export function VelocityMarquee({ children, baseSpeed = 2.2, className = "" }: { children: ReactNode; baseSpeed?: number; className?: string }) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const boost = useTransform(smooth, [0, 1000], [0, 4], { clamp: false });
  const direction = useRef(1);
  const translate = useTransform(x, (value) => `${wrap(-50, 0, value)}%`);

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    let move = direction.current * baseSpeed * (delta / 1000);
    const kick = boost.get();
    if (kick < 0) direction.current = -1;
    else if (kick > 0) direction.current = 1;
    move += direction.current * move * Math.abs(kick);
    x.set(x.get() + move);
  });

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div style={{ x: translate }} className="flex w-max">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">{children}</div>
      </motion.div>
    </div>
  );
}

/** Tilts a block back in 3D and stands it up as it scrolls into place. */
export function TiltIn({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.35"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : 18, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [reduced ? 1 : 0.92, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [reduced ? 1 : 0.4, 1, 1]);
  return (
    <div style={{ perspective: 1400 }} className={className}>
      <motion.div ref={ref} style={{ rotateX, scale, opacity, transformOrigin: "50% 100%" }}>
        {children}
      </motion.div>
    </div>
  );
}

function RisingLetter({ letter, index, total, progress }: { letter: string; index: number; total: number; progress: MotionValue<number> }) {
  const start = (index / total) * 0.4;
  const lift = fullRange(start, start + 0.55);
  const fade = fullRange(start, start + 0.4);
  const y = useTransform(progress, lift.input, lift.pick("55%", "0%"));
  const opacity = useTransform(progress, fade.input, fade.pick(0, 1));
  return (
    <motion.span style={{ y, opacity }} className="inline-block">
      {letter}
    </motion.span>
  );
}

/** The giant footer wordmark: letters rise one after another as the footer scrolls into view. */
export function RisingWordmark({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const letters = text.split("");
  return (
    <p ref={ref} className={className} aria-hidden="true">
      {reduced ? text : letters.map((letter, index) => <RisingLetter key={index} letter={letter} index={index} total={letters.length} progress={scrollYProgress} />)}
    </p>
  );
}
