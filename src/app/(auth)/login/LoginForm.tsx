"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AuthField, AuthMessage } from "@/components/auth/AuthParts";
import { authButton } from "@/components/auth/authButton";
import { createClient } from "@/lib/supabase/client";

export function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [unconfirmed, setUnconfirmed] = useState("");
  const [resent, setResent] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function resendConfirmation() {
    setResent("sending");
    const { error: resendError } = await createClient().auth.resend({
      type: "signup",
      email: unconfirmed,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/account` },
    });
    setResent(resendError ? "error" : "sent");
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    setPending(true);
    setError("");
    setUnconfirmed("");
    setResent("idle");
    const { error: signInError } = await createClient().auth.signInWithPassword({
      email,
      password: String(form.get("password") ?? ""),
    });
    if (signInError) {
      setPending(false);
      if (signInError.code === "email_not_confirmed") setUnconfirmed(email);
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
      {unconfirmed && (
        <button type="button" onClick={resendConfirmation} disabled={resent === "sending" || resent === "sent"} className="w-full text-center text-[14px] font-semibold text-cobalt hover:text-ink disabled:text-slate">
          {resent === "sent" ? "Confirmation email sent. Check your inbox." : resent === "sending" ? "Sending…" : resent === "error" ? "Could not send. Wait a minute and try again." : "Resend confirmation email"}
        </button>
      )}
      <button type="submit" disabled={pending} className={authButton}>
        {pending ? "Signing in…" : "Sign in"}
        {!pending && (
          <svg viewBox="0 0 24 24" className="cta-arrow size-[1.1em]" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
        )}
      </button>
    </form>
  );
}
