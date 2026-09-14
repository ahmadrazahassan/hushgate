/**
 * Hushgate plans. Prices are set in USD; local amounts are reference
 * conversions, rounded to clean numbers. Update RATES_AS_OF with the rates.
 */

export const TRIAL_DAYS = 14;

export type PlanId = "1m" | "3m" | "6m" | "12m";
export type CurrencyCode = "USD" | "PKR" | "INR" | "BDT";

export interface Plan {
  id: PlanId;
  label: string;
  months: number;
  usd: number;
  billed: string;
}

export const plans: Plan[] = [
  { id: "1m", label: "1 month", months: 1, usd: 0.99, billed: "Billed monthly" },
  { id: "3m", label: "3 months", months: 3, usd: 2.5, billed: "Billed every 3 months" },
  { id: "6m", label: "6 months", months: 6, usd: 4, billed: "Billed every 6 months" },
  { id: "12m", label: "12 months", months: 12, usd: 6.99, billed: "Billed yearly" },
];

export interface Currency {
  code: CurrencyCode;
  name: string;
  /** Units of this currency per 1 USD. */
  rate: number;
  /** Round converted prices to this step, so local prices look intentional. */
  step: number;
  locale: string;
}

/** Mid-market rates on 14 September 2026 (PKR 277, INR 95.7, BDT 123 per USD). */
export const RATES_AS_OF = "14 September 2026";

export const currencies: Currency[] = [
  { code: "USD", name: "US dollar", rate: 1, step: 0.01, locale: "en-US" },
  { code: "PKR", name: "Pakistani rupee", rate: 277, step: 5, locale: "en-PK" },
  { code: "INR", name: "Indian rupee", rate: 95.7, step: 1, locale: "en-IN" },
  { code: "BDT", name: "Bangladeshi taka", rate: 123, step: 1, locale: "en-BD" },
];

export function convert(usd: number, currency: Currency): number {
  if (currency.code === "USD") return usd;
  return Math.max(currency.step, Math.round((usd * currency.rate) / currency.step) * currency.step);
}

export function formatPrice(amount: number, currency: Currency): string {
  const whole = currency.code !== "USD";
  return new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currency.code,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  }).format(amount);
}

const monthly = plans[0];

/** What the same period would cost on the monthly plan, and the saving against it. */
export function savings(plan: Plan): { fullUsd: number; percent: number } | null {
  if (plan.months === 1) return null;
  const fullUsd = Math.round(monthly.usd * plan.months * 100) / 100;
  return { fullUsd, percent: Math.round((1 - plan.usd / fullUsd) * 100) };
}
