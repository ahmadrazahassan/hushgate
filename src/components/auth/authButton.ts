/**
 * Primary button class for the auth pages.
 * Kept out of AuthParts ("use client") so server components receive the real string, not a client reference.
 */
export const authButton = "cta cta-cobalt h-[52px] w-full px-6 text-[16px] disabled:pointer-events-none disabled:opacity-60";

/** Quiet outlined button that sits under the primary one. */
export const authButtonQuiet =
  "inline-flex h-[52px] w-full items-center justify-center gap-2.5 rounded-[14px] px-6 text-[15px] font-semibold text-slate ring-1 ring-line ring-inset transition hover:text-ink hover:ring-ink";
