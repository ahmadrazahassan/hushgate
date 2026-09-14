import { plans, savings, TRIAL_DAYS } from "@/lib/pricing";

const yearly = plans.find((plan) => plan.id === "12m") ?? plans[plans.length - 1];
export const offerPercent = savings(yearly)?.percent ?? 0;

/** "Special offer: Get 41%¹ off + 14 days free", with footnote 1 explaining the saving. */
export function Offer({ tone = "ink", className = "" }: { tone?: "ink" | "white"; className?: string }) {
  const accent = tone === "white" ? "text-white" : "text-cobalt";
  return (
    <p className={`font-display text-[22px] leading-[1.2] font-bold tracking-[-0.025em] md:text-[26px] ${tone === "white" ? "text-white" : "text-ink"} ${className}`}>
      Special offer: Get <span className={accent}>{offerPercent}%</span>
      <a href="#footnotes" className="align-super text-[0.5em] font-semibold no-underline" aria-label="See footnote 1">1</a> off
      <br />
      <span className={tone === "white" ? "text-white/85" : "text-slate"}>+ {TRIAL_DAYS} days free</span>
    </p>
  );
}

export function OfferFootnotes({ className = "" }: { className?: string }) {
  return (
    <ol id="footnotes" className={`scroll-mt-24 space-y-1.5 text-[12px] leading-relaxed text-muted ${className}`}>
      <li>
        1 Savings compare the 12-month plan (${yearly.usd.toFixed(2)}) with paying for the monthly plan for 12 months (${(plans[0].usd * 12).toFixed(2)}). The {TRIAL_DAYS}-day free trial is for new accounts. Local currency prices are approximate.
      </li>
      <li>2 Hushgate works in Chrome 116 or later on Windows, macOS, Linux and ChromeOS. Other Chromium browsers such as Edge and Brave usually work too.</li>
    </ol>
  );
}
