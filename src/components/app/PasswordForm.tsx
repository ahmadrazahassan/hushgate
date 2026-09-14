"use client";

import { useState, type FormEvent } from "react";
import { inputClass } from "@/components/app/ui";
import { Icon } from "@/components/ui/Icon";
import { createClient } from "@/lib/supabase/client";

export function passwordStrength(password: string): { score: 0 | 1 | 2 | 3 | 4; label: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;
  const labels = ["Too short", "Weak", "Okay", "Strong", "Very strong"];
  return { score: Math.min(4, password.length < 8 ? 0 : score) as 0 | 1 | 2 | 3 | 4, label: labels[password.length < 8 ? 0 : Math.min(4, score)] };
}

export function StrengthMeter({ password }: { password: string }) {
  const { score, label } = passwordStrength(password);
  if (!password) return null;
  return (
    <div className="mt-2.5 flex items-center gap-3" aria-live="polite">
      <div className="flex flex-1 gap-1">
        {[1, 2, 3, 4].map((step) => (
          <span key={step} className={`h-1 flex-1 rounded-full transition-colors ${score >= step ? (score >= 3 ? "bg-mint" : score === 2 ? "bg-amber" : "bg-coral") : "bg-fog"}`} />
        ))}
      </div>
      <span className="w-20 text-right text-[12px] font-medium text-slate">{label}</span>
    </div>
  );
}

/** Changes the password for the signed-in account. The extension uses the new one next time you sign in. */
export function PasswordForm() {
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [state, setState] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const confirm = String(new FormData(formElement).get("confirm") ?? "");
    if (password.length < 8) return setState({ tone: "error", text: "Use at least 8 characters." });
    if (password !== confirm) return setState({ tone: "error", text: "The two passwords do not match." });
    setPending(true);
    setState(null);
    const { error } = await createClient().auth.updateUser({ password });
    setPending(false);
    if (error) {
      const text = error.code === "same_password" ? "Choose a password you have not used before." : error.code === "weak_password" ? "Choose a stronger password." : error.code === "reauthentication_needed" ? "For your safety, sign out and sign in again, then change your password." : "Your password could not be changed. Try again.";
      return setState({ tone: "error", text });
    }
    setPassword("");
    formElement.reset();
    setState({ tone: "ok", text: "Password changed. Use it next time you sign in to the extension." });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block">
        <span className="text-[14px] font-medium">New password</span>
        <span className="relative mt-2 block">
          <input type={visible ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" minLength={8} required placeholder="At least 8 characters" className={`${inputClass} pr-12`} />
          <button type="button" onClick={() => setVisible((value) => !value)} aria-label={visible ? "Hide password" : "Show password"} className="absolute top-1/2 right-3 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-slate hover:text-ink">
            <Icon name={visible ? "eyeOff" : "eye"} className="size-[18px]" />
          </button>
        </span>
        <StrengthMeter password={password} />
      </label>
      <label className="block">
        <span className="text-[14px] font-medium">Repeat new password</span>
        <input name="confirm" type={visible ? "text" : "password"} autoComplete="new-password" required className={`mt-2 ${inputClass}`} />
      </label>
      {state && (
        <p role={state.tone === "error" ? "alert" : "status"} className={`rounded-[14px] px-4 py-3 text-[14px] ${state.tone === "error" ? "bg-[#fcebea] text-coral" : "bg-mint-soft text-mint"}`}>{state.text}</p>
      )}
      <button type="submit" disabled={pending} className="cta cta-black h-12 px-6 text-[15px] disabled:opacity-60">{pending ? "Changing…" : "Change password"}</button>
    </form>
  );
}
