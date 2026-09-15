"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";
import { AuthField, AuthMessage, AuthTitle } from "@/components/auth/AuthParts";
import { authButton } from "@/components/auth/authButton";
import { createClient } from "@/lib/supabase/client";

function ResetForm() {
  const expired = useSearchParams().get("expired") === "1";
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") ?? "").trim();
    setPending(true);
    setError("");
    const { error: resetError } = await createClient().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
    });
    setPending(false);
    // The same answer for every address, so the form never reveals who has an account.
    if (resetError && resetError.status === 429) {
      setError("Too many requests. Wait a minute and try again.");
      return;
    }
    setSent(true);
  }

  return (
    <>
      <AuthTitle title="Forgot your" serif="password?">Enter your account email and we will send you a link to choose a new one.</AuthTitle>
      {expired && !sent && <div className="mt-6"><AuthMessage tone="info">That link has expired or was already used. Request a new one below.</AuthMessage></div>}
      {sent ? (
        <div className="mt-8"><AuthMessage tone="success">If an account exists for that email, a reset link is on its way. It works once and expires in an hour.</AuthMessage></div>
      ) : (
        <form onSubmit={onSubmit} className="mt-9 space-y-5">
          <AuthField label="Email" icon="mail" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
          {error && <AuthMessage tone="error">{error}</AuthMessage>}
          <button type="submit" disabled={pending} className={authButton}>{pending ? "Sending…" : "Send reset link"}</button>
        </form>
      )}
      <p className="mt-8 text-center text-[15px] text-slate">
        Remembered it? <Link href="/login" className="font-semibold text-ink underline decoration-line underline-offset-4 hover:decoration-ink">Sign in</Link>
      </p>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  );
}
