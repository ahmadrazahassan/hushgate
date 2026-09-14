/** Account shapes and access rules shared by the user panel and the admin panel. */

export type PlanId = "trial" | "monthly" | "quarterly" | "half_year" | "yearly" | "complimentary";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: "user" | "admin";
  blocked: boolean;
  blocked_reason: string | null;
  plan: PlanId;
  trial_ends_at: string;
  access_ends_at: string | null;
  preferred_location: string | null;
  product_emails: boolean;
  last_sign_in_at: string | null;
  created_at: string;
  updated_at: string;
}

export const PROFILE_COLUMNS =
  "id, email, full_name, role, blocked, blocked_reason, plan, trial_ends_at, access_ends_at, preferred_location, product_emails, last_sign_in_at, created_at, updated_at";

export const planLabels: Record<PlanId, string> = {
  trial: "Free trial",
  monthly: "1 month",
  quarterly: "3 months",
  half_year: "6 months",
  yearly: "12 months",
  complimentary: "Complimentary",
};

export type AccessReason = "trial" | "paid" | "complimentary" | "expired" | "blocked";

export interface AccessState {
  allowed: boolean;
  reason: AccessReason;
  /** When the current access ends, if it ends. */
  endsAt: Date | null;
  daysLeft: number | null;
  /** 0..1 progress through the free trial, for the trial meter. */
  trialProgress: number;
}

const DAY = 86_400_000;

/** Mirror of public.profile_access() in the database, for display. The database stays the authority. */
export function accessState(profile: Pick<Profile, "blocked" | "plan" | "trial_ends_at" | "access_ends_at" | "created_at">, now = Date.now()): AccessState {
  const trialEnds = new Date(profile.trial_ends_at).getTime();
  const trialStart = new Date(profile.created_at).getTime();
  const paidEnds = profile.access_ends_at ? new Date(profile.access_ends_at).getTime() : null;
  const trialProgress = Math.min(1, Math.max(0, (now - trialStart) / Math.max(DAY, trialEnds - trialStart)));
  const days = (end: number) => Math.max(0, Math.ceil((end - now) / DAY));

  if (profile.blocked) return { allowed: false, reason: "blocked", endsAt: null, daysLeft: null, trialProgress };
  if (profile.plan === "complimentary") return { allowed: true, reason: "complimentary", endsAt: null, daysLeft: null, trialProgress };
  if (paidEnds !== null && now < paidEnds) return { allowed: true, reason: "paid", endsAt: new Date(paidEnds), daysLeft: days(paidEnds), trialProgress };
  if (now < trialEnds) return { allowed: true, reason: "trial", endsAt: new Date(trialEnds), daysLeft: days(trialEnds), trialProgress };
  return { allowed: false, reason: "expired", endsAt: new Date(Math.max(trialEnds, paidEnds ?? 0)), daysLeft: 0, trialProgress: 1 };
}

export const accessLabels: Record<AccessReason, string> = {
  trial: "Free trial",
  paid: "Active plan",
  complimentary: "Complimentary",
  expired: "Access ended",
  blocked: "Suspended",
};

export function firstName(profile: Pick<Profile, "full_name" | "email">): string {
  const name = profile.full_name?.trim();
  if (name) return name.split(/\s+/)[0];
  return profile.email.split("@")[0] || "there";
}

export function formatDay(value: string | Date | null | undefined): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

export function relativeTime(value: string | null | undefined, now = Date.now()): string {
  if (!value) return "Never";
  const seconds = Math.round((now - new Date(value).getTime()) / 1000);
  const units: [Intl.RelativeTimeFormatUnit, number][] = [["year", 31_536_000], ["month", 2_592_000], ["day", 86_400], ["hour", 3_600], ["minute", 60]];
  const format = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return format.format(-Math.round(seconds / size), unit);
  }
  return "Just now";
}

/** Only same-site paths, never protocol-relative or absolute URLs. */
export function safeNext(value: string | string[] | null | undefined, fallback = "/account"): string {
  const next = Array.isArray(value) ? value[0] : value;
  return next && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : fallback;
}
