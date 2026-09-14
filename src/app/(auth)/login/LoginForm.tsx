"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AuthField, AuthMessage, authButton } from "@/components/auth/AuthParts";
import { createClient } from "@/lib/supabase/client";

export function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError("");
    const { error: signInError } = await createClient().auth.signInWithPassword({
      email: String(form.get("email") ?? "").trim(),
      password: String(form.get("password") ?? ""),
    });
    if (signInError) {
      setPending(false);
      setError(
        signInError.code === "email_not_confirmed"
          ? "Confirm your email first, using the link we sent you."
          : signInError.status === 429
            ? "Too many attempts. Wait a minute and try again."
            : "Email or password is incorrect.",
      );
      return;
    }
    router.replace(next);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-9 space-y-5">
      <AuthField label="Email" icon="mail" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
      <AuthField
        label="Password"
        icon="lock"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        placeholder="Your password"
        trailing={<Link href="/reset-password" className="text-[13px] font-semibold text-cobalt hover:text-ink">Forgot?</Link>}
      />
      {error && <AuthMessage tone="error">{error}</AuthMessage>}
      <button type="submit" disabled={pending} className={authButton}>
        {pending ? "Signing in…" : "Sign in"}
        {!pending && (
          <svg viewBox="0 0 24 24" className="cta-arrow size-[1.1em]" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
        )}
      </button>
    </form>
  );
}
