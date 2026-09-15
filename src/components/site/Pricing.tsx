"use client";

import { animate, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { AppTile } from "@/components/site/SiteHeader";
import { ChromeLogo } from "@/components/ui/BrandLogos";
import { CtaButton } from "@/components/ui/CtaButton";
import { BlurText } from "@/components/site/Reveal";
import { TiltIn } from "@/components/site/Motion";
import { convert, currencies, formatPrice, plans, RATES_AS_OF, savings, TRIAL_DAYS, type Currency, type CurrencyCode, type PlanId } from "@/lib/pricing";

const included = [
  `${TRIAL_DAYS}-day free trial`,
  "Every location in 50+ countries",
  "Clean, static IP addresses",
  "Kill switch and WebRTC leak shield",
  "Split tunnelling and auto-connect",
  "No browsing logs, ever",
  "Cancel any time",
];

function CheckCircle() {
  return (
    <svg viewBox="0 0 20 20" className="size-[18px] shrink-0 text-faint" fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden="true">
      <circle cx="10" cy="10" r="8.3" />
      <path d="m6.6 10.2 2.2 2.2 4.6-4.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** A price that counts from its previous value to the new one when the plan or currency changes. */
function CountingPrice({ amount, currency, className = "" }: { amount: number; currency: Currency; className?: string }) {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(amount);
  const from = useRef(amount);

  useEffect(() => {
    if (reduced || from.current === amount) {
      from.current = amount;
      setShown(amount);
      return;
    }
    const controls = animate(from.current, amount, {
      duration: 0.7,
      ease: [0.2, 0.8, 0.2, 1],
      onUpdate: (latest) => {
        from.current = latest;
        setShown(latest);
      },
    });
    return () => controls.stop();
  }, [amount, reduced]);

  return <span className={`tabular-nums ${className}`}>{formatPrice(shown, currency)}</span>;
}

export function Pricing({ installHref }: { installHref: string }) {
  const [planId, setPlanId] = useState<PlanId>("12m");
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>("USD");

  const plan = plans.find((item) => item.id === planId) ?? plans[0];
  const currency = currencies.find((item) => item.code === currencyCode) ?? currencies[0];
  const saving = savings(plan);
  const price = formatPrice(convert(plan.usd, currency), currency);

  return (
    <section id="pricing" className="pricing-sky relative scroll-mt-16 overflow-hidden pt-8 pb-24 md:pt-12 md:pb-28">
      <div className="container-page text-center">
        <h2 className="text-[48px] leading-[0.98] font-bold tracking-[-0.05em] md:text-[76px]">
          <BlurText text={`${TRIAL_DAYS} days free.`} className="block" />
          <BlurText text="Then less than a coffee." className="block font-serif font-normal tracking-[-0.03em] italic" delay={0.15} />
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-[18px] leading-relaxed text-slate md:text-[21px]">
          Try every location and feature free for {TRIAL_DAYS} days. After that, stay private from {formatPrice(convert(plans[0].usd, currency), currency)} a month.
        </p>
        <p className="mt-4 text-[13px] text-muted">You will not be charged during the trial. Cancel before it ends and you pay nothing.</p>

        <TiltIn className="mt-14">
        <div className="relative mx-auto w-full max-w-[440px] rounded-[34px] bg-mist px-6 pt-[70px] pb-7 text-left shadow-[0_40px_80px_-50px_rgba(21,25,60,0.55)] ring-1 ring-white/70 md:px-8">
          {/* Notch tab hanging from the top edge of the card. */}
          <div className="notch absolute top-0 left-1/2 flex h-[50px] -translate-x-1/2 items-center gap-2.5 rounded-b-[20px] bg-[#0b0d12] pr-5 pl-3 whitespace-nowrap text-white">
            <AppTile size={30} />
            <span className="font-display text-[17px] font-bold tracking-[-0.02em]">Hushgate for Chrome</span>
          </div>

          <div role="radiogroup" aria-label="Billing period" className="grid grid-cols-4 gap-1 rounded-[20px] bg-white p-1.5 shadow-[inset_0_1px_2px_rgba(21,25,34,0.06)] ring-1 ring-line ring-inset">
            {plans.map((item) => {
              const active = item.id === plan.id;
              const itemSaving = savings(item);
              return (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  aria-label={`${item.label}${itemSaving ? `, save ${itemSaving.percent}%` : ""}`}
                  onClick={() => setPlanId(item.id)}
                  className={`relative flex h-[62px] flex-col items-center justify-center rounded-[15px] transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-cobalt ${active ? "text-white" : "text-ink/75 hover:bg-mist hover:text-ink"}`}
                >
                  {active && (
                    <motion.span
                      layoutId="plan-pill"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      className="absolute inset-0 rounded-[15px] bg-[linear-gradient(180deg,#33363d_0%,#0b0d12_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_8px_18px_-8px_rgba(11,13,18,0.7)]"
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative font-display text-[21px] leading-none font-bold tracking-[-0.04em] tabular-nums">{item.months}</span>
                  <span className={`relative mt-1 text-[11px] leading-none font-semibold ${active ? "text-white/70" : "text-muted"}`}>{item.months === 1 ? "month" : "months"}</span>
                  {itemSaving && (
                    <span className={`absolute -top-2 right-0.5 rounded-full px-1.5 py-[3px] text-[9.5px] leading-none font-bold tabular-nums shadow-sm transition-colors duration-300 ${active ? "bg-cobalt text-white" : "bg-cobalt-soft text-cobalt"}`}>
                      -{itemSaving.percent}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-7 flex items-center justify-between gap-3">
            <span className="text-[14px] font-medium text-slate">{plan.billed}</span>
            <label className="relative inline-flex items-center">
              <span className="sr-only">Currency</span>
              <select
                value={currency.code}
                onChange={(event) => setCurrencyCode(event.target.value as CurrencyCode)}
                className="h-9 cursor-pointer appearance-none rounded-full bg-white pr-9 pl-3.5 text-[14px] font-semibold text-ink ring-1 ring-line outline-none ring-inset hover:ring-ink focus-visible:ring-2 focus-visible:ring-cobalt"
              >
                {currencies.map((item) => (
                  <option key={item.code} value={item.code}>{item.code} · {item.name}</option>
                ))}
              </select>
              <svg viewBox="0 0 20 20" className="pointer-events-none absolute right-3 size-4 text-slate" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                <path d="m6 8 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </label>
          </div>

          <div className="mt-3 flex items-end justify-center gap-3 text-center" aria-live="polite">
            <CountingPrice amount={convert(plan.usd, currency)} currency={currency} className="font-display text-[64px] leading-none font-bold tracking-[-0.05em] md:text-[76px]" />
            {saving && (
              <span className="mb-2 flex flex-col items-start">
                <CountingPrice amount={convert(saving.fullUsd, currency)} currency={currency} className="text-[26px] leading-none font-bold tracking-[-0.03em] text-faint line-through decoration-2" />
                <span className="mt-1.5 rounded-full bg-cobalt px-2 py-0.5 text-[12px] font-semibold text-white">Save {saving.percent}%</span>
              </span>
            )}
          </div>
          <p className="mt-2 text-center text-[14px] text-slate">
            {plan.months === 1 ? "per month" : <>for {plan.label} · about <CountingPrice amount={convert(plan.usd / plan.months, currency)} currency={currency} /> a month</>}
          </p>

          {/* How the trial turns into a plan, in three honest steps. */}
          <ol className="mt-6 grid grid-cols-3 rounded-[20px] bg-white px-2 pt-4 pb-3.5 ring-1 ring-line ring-inset" aria-label="How the free trial works">
            {[
              { when: "Today", what: "Every feature, free", live: true },
              { when: `Day ${TRIAL_DAYS}`, what: "Trial ends", live: false },
              { when: "Then", what: `${price} if you stay`, live: false },
            ].map((step, index) => (
              <li key={step.when} className="relative flex flex-col items-center px-1 text-center">
                {index > 0 && <span className="absolute top-[5px] right-1/2 left-[-50%] border-t border-dashed border-line" aria-hidden="true" />}
                <span className="relative flex size-[11px] items-center justify-center" aria-hidden="true">
                  {step.live && <span className="absolute inline-flex size-full animate-ping rounded-full bg-cobalt/40" />}
                  <span className={`relative size-[11px] rounded-full ${step.live ? "bg-cobalt" : "bg-white ring-2 ring-line ring-inset"}`} />
                </span>
                <span className={`mt-2.5 text-[13px] font-bold tracking-[-0.01em] ${step.live ? "text-cobalt" : "text-ink"}`}>{step.when}</span>
                <span className="mt-0.5 text-[12px] leading-snug text-slate">{step.what}</span>
              </li>
            ))}
          </ol>

          <ul className="mt-6 space-y-3">
            {included.map((item) => (
              <li key={item} className="flex items-center gap-3 text-[15px] text-ink">
                <CheckCircle />
                {item}
              </li>
            ))}
          </ul>

          <CtaButton href="/signup" tone="cobalt" size="lg" arrow="right" className="mt-7 w-full">
            Start your free trial
          </CtaButton>
          <p className="mt-3 text-center text-[12.5px] text-muted">No card needed to start.</p>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-line pt-5">
            <div>
              <p className="text-[14px] font-semibold text-ink">Already have an account?</p>
              <p className="text-[13px] text-slate">Sign in from the extension.</p>
            </div>
            <a href={installHref} {...(installHref.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="inline-flex h-10 items-center gap-2 rounded-full bg-white pr-4 pl-2.5 text-[14px] font-semibold text-ink shadow-[0_1px_2px_rgba(21,25,34,0.08)] ring-1 ring-line transition duration-200 ring-inset hover:-translate-y-px hover:ring-ink/30">
              <ChromeLogo className="size-5" />
              Add to Chrome
            </a>
          </div>
        </div>
        </TiltIn>

        <p className="mx-auto mt-10 max-w-md text-[13px] leading-relaxed text-slate">
          Prices are in US dollars. PKR, INR and BDT amounts are converted at rates from {RATES_AS_OF} and may differ slightly at checkout. Taxes may apply.
        </p>
      </div>
    </section>
  );
}
