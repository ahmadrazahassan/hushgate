"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { StrengthMeter } from "@/components/app/PasswordForm";
import { AuthField, AuthMessage, AuthTitle, authButton } from "@/components/auth/AuthParts";
import { createClient } from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }
    setPending(true);
    setError("");
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setPending(false);
    if (updateError) {
      setError(updateError.code === "same_password" ? "Choose a password you have not used before." : "Your reset link has expired. Request a new one.");
      return;
    }
    await supabase.auth.signOut();
    setDone(true);
  }

  if (done) {
    return (
      <>
        <AuthTitle title="Password" serif="updated.">Sign in to your account and to Hushgate in Chrome with your new password.</AuthTitle>
        <Link href="/login" className={`${authButton} mt-9`}>Sign in</Link>
      </>
    );
  }

  return (
    <>
      <AuthTitle title="Choose a new" serif="password.">You will use it here and in the Hushgate extension.</AuthTitle>
      <form onSubmit={onSubmit} className="mt-9 space-y-5">
        <AuthField
          label="New password"
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
        <button type="submit" disabled={pending} className={authButton}>{pending ? "Saving…" : "Save password"}</button>
      </form>
    </>
  );
}
