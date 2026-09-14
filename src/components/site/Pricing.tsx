"use client";

import { useState } from "react";
import { AppTile } from "@/components/site/SiteHeader";
import { CtaButton } from "@/components/ui/CtaButton";
import { BlurText } from "@/components/site/Reveal";
import { TiltIn } from "@/components/site/Motion";
import { convert, currencies, formatPrice, plans, RATES_AS_OF, savings, TRIAL_DAYS, type CurrencyCode, type PlanId } from "@/lib/pricing";

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

export function Pricing({ installHref }: { installHref: string }) {
  const [planId, setPlanId] = useState<PlanId>("12m");
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>("USD");

  const plan = plans.find((item) => item.id === planId) ?? plans[0];
  const currency = currencies.find((item) => item.code === currencyCode) ?? currencies[0];
  const saving = savings(plan);
  const price = formatPrice(convert(plan.usd, currency), currency);
  const perMonth = formatPrice(convert(plan.usd / plan.months, currency), currency);

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

          <div role="radiogroup" aria-label="Billing period" className="grid grid-cols-4 gap-1 rounded-[16px] bg-white p-1 ring-1 ring-line ring-inset">
            {plans.map((item) => {
              const active = item.id === plan.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setPlanId(item.id)}
                  className={`h-10 rounded-[12px] text-[13px] font-semibold tracking-[-0.01em] transition-colors duration-200 ${active ? "bg-[#0b0d12] text-white" : "text-ink/70 hover:text-ink"}`}
                >
                  {item.label}
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
            <span className="font-display text-[64px] leading-none font-bold tracking-[-0.05em] tabular-nums md:text-[76px]">{price}</span>
            {saving && (
              <span className="mb-2 flex flex-col items-start">
                <span className="text-[26px] leading-none font-bold tracking-[-0.03em] text-faint line-through decoration-2">{formatPrice(convert(saving.fullUsd, currency), currency)}</span>
                <span className="mt-1.5 rounded-full bg-cobalt px-2 py-0.5 text-[12px] font-semibold text-white">Save {saving.percent}%</span>
              </span>
            )}
          </div>
          <p className="mt-2 text-center text-[14px] text-slate">
            {plan.months === 1 ? "per month" : `for ${plan.label} · about ${perMonth} a month`}
          </p>

          <div className="mt-6 rounded-[18px] bg-white p-4 ring-1 ring-line ring-inset">
            <p className="text-[15px] font-semibold">Free for the first {TRIAL_DAYS} days</p>
            <div className="mt-3 flex items-center gap-3">
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-fog">
                <span className="block h-full w-[7%] rounded-full bg-cobalt" />
              </span>
              <span className="text-[12px] text-muted">Then {price}</span>
            </div>
          </div>

          <ul className="mt-6 space-y-3">
            {included.map((item) => (
              <li key={item} className="flex items-center gap-3 text-[15px] text-ink">
                <CheckCircle />
                {item}
              </li>
            ))}
          </ul>

          <CtaButton href={installHref} tone="cobalt" size="lg" arrow="right" className="mt-7 w-full">
            Start your free trial
          </CtaButton>
        </div>
        </TiltIn>

        <p className="mx-auto mt-10 max-w-md text-[13px] leading-relaxed text-slate">
          Prices are in US dollars. PKR, INR and BDT amounts are converted at rates from {RATES_AS_OF} and may differ slightly at checkout. Taxes may apply.
        </p>
      </div>
    </section>
  );
}
