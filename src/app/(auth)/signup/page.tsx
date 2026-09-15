"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { StrengthMeter } from "@/components/app/PasswordForm";
import { AuthField, AuthMessage, AuthTitle, authButton } from "@/components/auth/AuthParts";
import { Icon } from "@/components/ui/Icon";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [pending, setPending] = useState(false);
  const [resend, setResend] = useState<{ state: "idle" | "sending" | "sent" | "error"; wait: number }>({ state: "idle", wait: 0 });

  useEffect(() => {
    if (resend.wait <= 0) return;
    const timer = window.setTimeout(() => setResend((value) => ({ ...value, wait: value.wait - 1 })), 1000);
    return () => window.clearTimeout(timer);
  }, [resend.wait]);

  async function resendConfirmation() {
    setResend({ state: "sending", wait: 0 });
    const { error: resendError } = await createClient().auth.resend({
      type: "signup",
      email: sentTo,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/account` },
    });
    setResend({ state: resendError ? "error" : "sent", wait: 60 });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const fullName = String(form.get("fullName") ?? "").trim().slice(0, 80);
    if (password.length < 8) {
      setError("Use at least 8 characters for your password.");
      return;
    }
    setPending(true);
    setError("");
    const { data, error: signUpError } = await createClient().auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/account`,
        data: fullName ? { full_name: fullName } : undefined,
      },
    });
    setPending(false);
    if (signUpError) {
      setError(
        signUpError.code === "weak_password"
          ? "Choose a stronger password."
          : signUpError.status === 429
            ? "Too many sign-ups from here. Wait a few minutes and try again."
            : "Your account could not be created. Check your email and try again.",
      );
      return;
    }
    if (data.user && data.user.identities?.length === 0) {
      setError("An account with this email already exists. Sign in instead.");
      return;
    }
    if (data.session) {
      // Email confirmation is off for this project: go straight to the account.
      router.replace("/account");
      router.refresh();
      return;
    }
    setSentTo(email);
    setResend({ state: "idle", wait: 60 });
  }

  if (sentTo) {
    return (
      <div>
        <span className="grid size-14 place-items-center rounded-[18px] bg-cobalt-soft text-cobalt">
          <Icon name="mail" className="size-7" />
        </span>
        <div className="mt-8">
          <AuthTitle title="Check your" serif="inbox.">
            We sent a confirmation link to <strong className="font-semibold text-ink [overflow-wrap:anywhere]">{sentTo}</strong>. Open it to start your 14-day free trial, then sign in to Hushgate in Chrome.
          </AuthTitle>
        </div>
        <button type="button" onClick={resendConfirmation} disabled={resend.wait > 0 || resend.state === "sending"} className={`${authButton} mt-8`}>
          {resend.state === "sending" ? "Sending…" : resend.wait > 0 ? `${resend.state === "sent" ? "Sent. " : ""}Resend in ${resend.wait}s` : resend.state === "error" ? "Try sending again" : "Resend confirmation email"}
        </button>
        <p className="mt-6 text-[14px] text-slate">
          No email after a few minutes? Check spam, or <button type="button" onClick={() => setSentTo("")} className="font-semibold text-ink underline decoration-line underline-offset-4">try another address</button>.
        </p>
      </div>
    );
  }

  return (
    <>
      <AuthTitle title="Start with" serif="14 days free.">No card needed. One account works in Chrome on every computer you use.</AuthTitle>
      <form onSubmit={onSubmit} className="mt-9 space-y-5">
        <AuthField label="Name" icon="user" name="fullName" autoComplete="name" maxLength={80} placeholder="Optional" />
        <AuthField label="Email" icon="mail" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
        <AuthField
          label="Password"
          icon="lock"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="At least 8 characters"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          hint={<StrengthMeter password={password} />}
        />
        {error && <AuthMessage tone="error">{error}</AuthMessage>}
        <button type="submit" disabled={pending} className={authButton}>
          {pending ? "Creating your account…" : "Create account"}
          {!pending && (
            <svg viewBox="0 0 24 24" className="cta-arrow size-[1.1em]" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
          )}
        </button>
        <p className="text-center text-[13px] leading-relaxed text-slate">
          By creating an account you agree to the <Link href="/terms" className="text-ink underline decoration-line underline-offset-4">Terms</Link> and <Link href="/privacy" className="text-ink underline decoration-line underline-offset-4">Privacy Policy</Link>.
        </p>
      </form>
      <p className="mt-8 text-center text-[15px] text-slate">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-ink underline decoration-line underline-offset-4 hover:decoration-ink">Sign in</Link>
      </p>
    </>
  );
}
