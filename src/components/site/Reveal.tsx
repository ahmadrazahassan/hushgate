"use client";

import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform, type MotionValue, type Variants } from "motion/react";
import { Fragment, useRef, type ReactNode } from "react";

const ease = [0.2, 0.8, 0.2, 1] as const;

/** Fades and unblurs content once as it scrolls into view. */
export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 28, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

const wordVariants: Variants = {
  hidden: { opacity: 0, y: "0.3em", filter: "blur(12px)" },
  shown: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.85, ease } },
};

/** Words rise out of a blur one after another the first time the text is seen. */
export function BlurText({ text, className = "", delay = 0, stagger = 0.05 }: { text: string; className?: string; delay?: number; stagger?: number }) {
  const reduced = useReducedMotion();
  if (reduced) return <span className={className}>{text}</span>;

  const words = text.split(" ");
  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
    >
      <span className="sr-only">{text}</span>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <motion.span variants={wordVariants} className="inline-block" aria-hidden="true">
            {word}
          </motion.span>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </motion.span>
  );
}

/**
 * Maps a window inside 0..1 onto a full 0..1 input range, holding the start value
 * before the window and the end value after it. Motion needs the full range for
 * scroll-linked values to stay put once their window has passed.
 */
export function fullRange(from: number, to: number) {
  const start = Math.max(0, Math.min(from, 0.999));
  const end = Math.max(start + 0.001, Math.min(to, 1));
  const input = [0, start, end, 1].filter((value, index, all) => index === 0 || value > all[index - 1]);
  const pick = <T,>(before: T, after: T): T[] => input.map((value) => (value <= start && !(start === 0 && value > 0) ? before : value >= end ? after : before));
  return { input, pick };
}

function ScrollWord({ progress, range, children }: { progress: MotionValue<number>; range: [number, number]; children: ReactNode }) {
  const { input, pick } = fullRange(range[0], range[1]);
  const opacity = useTransform(progress, input, pick(0.14, 1));
  const blur = useTransform(progress, input, pick(10, 0));
  const filter = useMotionTemplate`blur(${blur}px)`;
  return (
    <motion.span style={{ opacity, filter }} className="inline-block" aria-hidden="true">
      {children}
    </motion.span>
  );
}

export type ScrollToken = string | { node: ReactNode; label: string };

/**
 * Text that sharpens word by word as you scroll through it. Tokens can be plain
 * words or small inline pieces (an icon, a chip) that sharpen with the sentence.
 */
export function ScrollBlurText({ tokens, className = "" }: { tokens: ScrollToken[]; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.88", "end 0.5"] });
  const label = tokens.map((token) => (typeof token === "string" ? token : token.label)).filter(Boolean).join(" ");

  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{label}</span>
      {tokens.map((token, index) => {
        const content = typeof token === "string" ? token : token.node;
        const spacer = index < tokens.length - 1 ? " " : null;
        if (reduced) {
          return <Fragment key={index}><span aria-hidden="true" className="inline-block">{content}</span>{spacer}</Fragment>;
        }
        const start = index / tokens.length;
        return (
          <Fragment key={index}>
            <ScrollWord progress={scrollYProgress} range={[start, start + 1 / tokens.length]}>{content}</ScrollWord>
            {spacer}
          </Fragment>
        );
      })}
    </p>
  );
}

/** Shared heading pattern: an eyebrow, a bold display line and an Instrument Serif italic line, each unblurring in. */
export function SectionTitle({
  eyebrow,
  line,
  serif,
  className = "",
  id,
  align = "left",
}: {
  eyebrow: ReactNode;
  line: string;
  serif: string;
  className?: string;
  id?: string;
  align?: "left" | "center";
}) {
  const lineWords = line.split(" ").length;
  return (
    <div className={`${align === "center" ? "text-center" : ""} ${className}`}>
      <Reveal>
        <p className="inline-flex items-center gap-2 font-display text-[17px] font-bold tracking-[-0.02em] text-cobalt md:text-[19px]">{eyebrow}</p>
      </Reveal>
      <h2 id={id} className="mt-4 text-[44px] leading-[0.98] font-bold tracking-[-0.05em] md:text-[72px]">
        <BlurText text={line} className="block" delay={0.1} />
        <BlurText text={serif} className="block font-serif font-normal tracking-[-0.03em] italic" delay={0.1 + lineWords * 0.05} />
      </h2>
    </div>
  );
}
