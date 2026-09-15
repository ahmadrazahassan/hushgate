import Link from "next/link";
import type { ReactNode } from "react";

const sizes = {
  md: "h-11 px-5 text-[15px]",
  lg: "h-[52px] px-6 text-[16px]",
  xl: "h-[60px] px-7 text-[18px] md:text-[19px]",
} as const;

function Arrow({ kind }: { kind: "right" | "return" }) {
  if (kind === "return") {
    return (
      <svg viewBox="0 0 24 24" className="cta-arrow cta-arrow-return size-[1.15em]" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 4v9a3 3 0 0 0 3 3h10m-4-4 4 4-4 4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="cta-arrow size-[1.1em]" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

/**
 * Calls to action.
 * - `cobalt` and `black`: bevelled glossy keys for the main actions.
 * - `soft`: a pale key on a solid black block, for secondary actions.
 */
export function CtaButton({
  href,
  tone = "cobalt",
  size = "lg",
  arrow,
  className = "",
  children,
}: {
  href: string;
  tone?: "cobalt" | "black" | "soft" | "white";
  size?: keyof typeof sizes;
  arrow?: "right" | "return";
  className?: string;
  children: ReactNode;
}) {
  const external = href.startsWith("http");
  return (
    <Link
      href={href}
      className={`cta cta-${tone} ${sizes[size]} ${className}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
      {arrow && <Arrow kind={arrow} />}
    </Link>
  );
}
