"use client";

import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";

export function AuthTitle({ title, serif, children }: { title: string; serif: string; children?: ReactNode }) {
  return (
    <div>
      <h1 className="text-[40px] leading-[0.98] font-bold tracking-[-0.05em] md:text-[48px]">
        {title}
        <br />
        <span className="font-serif font-normal tracking-[-0.03em] italic">{serif}</span>
      </h1>
      {children && <p className="mt-4 text-[16px] leading-relaxed text-slate">{children}</p>}
    </div>
  );
}

export function AuthField({ label, icon, type = "text", hint, trailing, ...props }: { label: string; icon: IconName; hint?: ReactNode; trailing?: ReactNode } & InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  return (
    <label className="block">
      <span className="flex items-center justify-between text-[14px] font-medium text-ink">
        {label}
        {trailing}
      </span>
      <span className="mt-2 flex h-[52px] items-center gap-3 rounded-[16px] bg-mist px-4 text-muted ring-1 ring-transparent transition ring-inset focus-within:bg-white focus-within:text-cobalt focus-within:ring-2 focus-within:ring-cobalt">
        <Icon name={icon} className="size-[18px] shrink-0" />
        <input type={isPassword && visible ? "text" : type} className="h-full min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-faint" {...props} />
        {isPassword && (
          <button type="button" onClick={() => setVisible((value) => !value)} aria-label={visible ? "Hide password" : "Show password"} className="grid size-8 place-items-center rounded-lg text-slate hover:text-ink">
            <Icon name={visible ? "eyeOff" : "eye"} className="size-[18px]" />
          </button>
        )}
      </span>
      {hint}
    </label>
  );
}

export function AuthMessage({ tone, children }: { tone: "error" | "success" | "info"; children: ReactNode }) {
  const tones = { error: "bg-[#fcebea] text-coral", success: "bg-mint-soft text-mint", info: "bg-cobalt-soft text-cobalt-deep" };
  return (
    <p role={tone === "error" ? "alert" : "status"} className={`rounded-[16px] px-4 py-3 text-[14px] leading-relaxed ${tones[tone]}`}>
      {children}
    </p>
  );
}
