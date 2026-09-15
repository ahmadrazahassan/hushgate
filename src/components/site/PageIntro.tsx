import type { ReactNode } from "react";
import { BlurText, Reveal } from "@/components/site/Reveal";

/**
 * Top of an inner page, in the homepage's voice: a cobalt eyebrow, a bold
 * display line and an Instrument Serif italic line, then a short lead.
 */
export function PageIntro({
  eyebrow,
  line,
  serif,
  lead,
  align = "left",
  className = "",
  children,
}: {
  eyebrow: ReactNode;
  line: string;
  serif?: string;
  lead?: ReactNode;
  align?: "left" | "center";
  className?: string;
  children?: ReactNode;
}) {
  const centered = align === "center";
  return (
    <header className={`${centered ? "mx-auto text-center" : ""} max-w-4xl ${className}`}>
      <Reveal>
        <p className="inline-flex items-center gap-2 font-display text-[17px] font-bold tracking-[-0.02em] text-cobalt md:text-[19px]">{eyebrow}</p>
      </Reveal>
      <h1 className="mt-4 text-[46px] leading-[0.98] font-bold tracking-[-0.05em] md:text-[80px]">
        <BlurText text={line} className="block" delay={0.05} />
        {serif && <BlurText text={serif} className="block font-serif font-normal tracking-[-0.03em] italic" delay={0.05 + line.split(" ").length * 0.05} />}
      </h1>
      {lead && (
        <Reveal delay={0.2}>
          <div className={`mt-7 max-w-2xl text-[18px] leading-relaxed text-slate md:text-[20px] ${centered ? "mx-auto" : ""}`}>{lead}</div>
        </Reveal>
      )}
      {children}
    </header>
  );
}
