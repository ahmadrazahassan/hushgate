import { plans, savings, TRIAL_DAYS } from "@/lib/pricing";

const yearly = plans.find((plan) => plan.id === "12m") ?? plans[plans.length - 1];
export const offerPercent = savings(yearly)?.percent ?? 0;

/** "Special offer: 41%¹ off + 14 days free" as a glass ticket, with footnote 1 explaining the saving. */
export function Offer({ tone = "ink", className = "" }: { tone?: "ink" | "white"; className?: string }) {
  return (
    <div className={className}>
      <p className={`offer offer-${tone} inline-flex max-w-full items-stretch rounded-full p-[5px]`}>
        <span className="offer-tag relative z-[1] inline-flex shrink-0 items-center gap-2 rounded-full px-3 text-[10px] font-bold tracking-[0.14em] uppercase sm:px-3.5 sm:text-[11px]">
          <span className="relative flex size-1.5" aria-hidden="true">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#7dffb2] opacity-70" />
            <span className="relative inline-flex size-1.5 rounded-full bg-[#7dffb2]" />
          </span>
          <span className="sm:hidden">Offer</span>
          <span className="hidden sm:inline">Special offer</span>
        </span>
        <span className="relative z-[1] flex items-center gap-2.5 py-1 pr-3.5 pl-3 sm:gap-3.5 sm:pr-5 sm:pl-4">
          <span className="font-display text-[19px] leading-none font-bold tracking-[-0.04em] whitespace-nowrap sm:text-[24px]">
            {offerPercent}%
            <a href="#footnotes" className="align-super text-[0.48em] font-semibold no-underline opacity-80" aria-label="See footnote 1">1</a>
            {" "}off
          </span>
          <span className={`h-6 border-l border-dashed sm:h-7 ${tone === "white" ? "border-white/55" : "border-[#151922]/20"}`} aria-hidden="true" />
          <span className="font-serif text-[19px] leading-none tracking-[-0.01em] whitespace-nowrap italic sm:text-[24px]">+ {TRIAL_DAYS} days free</span>
        </span>
      </p>
    </div>
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
