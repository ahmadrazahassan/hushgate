import Image from "next/image";
import Link from "next/link";

export function Wordmark({ tone = "ink", className = "" }: { tone?: "ink" | "white"; className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2 ${className}`} aria-label="Hushgate home">
      <Image src="/brand/mark.png" alt="" width={28} height={22} className={`h-[18px] w-auto ${tone === "white" ? "brightness-0 invert" : ""}`} priority />
      <span className={`font-display text-[19px] font-bold tracking-[-0.03em] ${tone === "white" ? "text-white" : "text-ink"}`}>Hushgate</span>
    </Link>
  );
}

export function Flag({ code, className = "h-4 w-auto" }: { code: "CA" | "DE" | "US" | string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- tiny local SVG flags
    <img src={`/flags/${code.toLowerCase()}.svg`} alt="" className={`rounded-[3px] ring-1 ring-black/10 ${className}`} />
  );
}

/** Small outlined label above a section heading. */
export function Eyebrow({ children, tone = "light" }: { children: React.ReactNode; tone?: "light" | "dark" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.08em] ring-1 ring-inset ${
        tone === "dark" ? "text-white/80 ring-white/25" : "text-slate ring-line"
      }`}
    >
      {children}
    </span>
  );
}
