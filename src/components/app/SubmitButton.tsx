"use client";

import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";

/** A form submit button that shows progress while its Server Action runs. */
export function SubmitButton({ children, pendingText, className }: { children: ReactNode; pendingText?: string; className: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} aria-busy={pending} className={className}>
      {pending ? (pendingText ?? "Saving…") : children}
    </button>
  );
}
