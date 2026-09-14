import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";

/** Page heading for panel screens: a small eyebrow, a bold line and an optional serif line. */
export function PanelTitle({ eyebrow, title, serif, description, actions }: { eyebrow?: ReactNode; title: string; serif?: string; description?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div className="min-w-0">
        {eyebrow && <p className="inline-flex items-center gap-2 font-display text-[15px] font-bold tracking-[-0.02em] text-cobalt">{eyebrow}</p>}
        <h1 className="mt-2 text-[38px] leading-[0.98] font-bold tracking-[-0.05em] md:text-[56px]">
          {title}
          {serif && (
            <>
              {" "}
              <span className="font-serif font-normal tracking-[-0.03em] italic">{serif}</span>
            </>
          )}
        </h1>
        {description && <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-slate">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>}
    </div>
  );
}

export function Card({ title, icon, action, children, className = "", tone = "mist" }: { title?: ReactNode; icon?: IconName; action?: ReactNode; children: ReactNode; className?: string; tone?: "mist" | "white" | "ink" }) {
  const tones = { mist: "bg-mist", white: "bg-white ring-1 ring-line ring-inset", ink: "bg-[#0b0d12] text-white" };
  return (
    <section className={`rounded-[28px] ${tones[tone]} ${className}`}>
      {(title || action) && (
        <header className="flex items-center justify-between gap-4 px-6 pt-5 md:px-7 md:pt-6">
          <h2 className="flex items-center gap-2 font-sans text-[15px] font-semibold tracking-normal">
            {icon && <Icon name={icon} className={`size-[18px] ${tone === "ink" ? "text-[#9aa8ff]" : "text-cobalt"}`} />}
            {title}
          </h2>
          {action}
        </header>
      )}
      <div className="p-6 md:p-7">{children}</div>
    </section>
  );
}

export function Stat({ label, value, hint, accent = false }: { label: string; value: ReactNode; hint?: ReactNode; accent?: boolean }) {
  return (
    <div className={`rounded-[24px] p-5 md:p-6 ${accent ? "bg-[#0b0d12] text-white" : "bg-mist"}`}>
      <p className={`text-[13px] font-medium ${accent ? "text-white/60" : "text-slate"}`}>{label}</p>
      <p className="mt-3 font-display text-[36px] leading-none font-bold tracking-[-0.045em] tabular-nums md:text-[44px]">{value}</p>
      {hint && <p className={`mt-2.5 text-[13px] ${accent ? "text-white/55" : "text-muted"}`}>{hint}</p>}
    </div>
  );
}

const badgeTones = {
  cobalt: "bg-cobalt-soft text-cobalt-deep",
  mint: "bg-mint-soft text-mint",
  coral: "bg-[#fcebea] text-coral",
  amber: "bg-[#fdf3dc] text-amber",
  ink: "bg-[#0b0d12] text-white",
  gray: "bg-fog text-slate",
} as const;

export type BadgeTone = keyof typeof badgeTones;

export function Badge({ tone = "gray", children, dot = false }: { tone?: BadgeTone; children: ReactNode; dot?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold whitespace-nowrap ${badgeTones[tone]}`}>
      {dot && <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />}
      {children}
    </span>
  );
}

export function Notice({ tone, text }: { tone?: string; text?: string }) {
  if (!text) return null;
  const ok = tone !== "error";
  return (
    <p role={ok ? "status" : "alert"} className={`flex items-start gap-3 rounded-[20px] px-5 py-4 text-[14px] leading-relaxed ${ok ? "bg-mint-soft text-mint" : "bg-[#fcebea] text-coral"}`}>
      <Icon name={ok ? "check" : "close"} className="mt-0.5 size-4 shrink-0" />
      {text}
    </p>
  );
}

export function Empty({ icon = "search", children }: { icon?: IconName; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-14 text-center text-[15px] text-slate">
      <Icon name={icon} className="size-7 text-faint" />
      {children}
    </div>
  );
}

export function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-b border-line py-3.5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <dt className="text-[14px] text-slate">{label}</dt>
      <dd className="min-w-0 text-[15px] font-medium [overflow-wrap:anywhere] text-ink sm:text-right">{children}</dd>
    </div>
  );
}

export const inputClass =
  "h-12 w-full rounded-[14px] bg-white px-4 text-[15px] text-ink outline-none ring-1 ring-line ring-inset transition placeholder:text-faint focus:ring-2 focus:ring-cobalt";

export const selectClass =
  "h-12 w-full cursor-pointer appearance-none rounded-[14px] bg-white pr-10 pl-4 text-[15px] text-ink outline-none ring-1 ring-line ring-inset transition focus:ring-2 focus:ring-cobalt";

export const ghostButton =
  "inline-flex h-11 items-center justify-center gap-2 rounded-[13px] bg-white px-4 text-[14px] font-semibold text-ink ring-1 ring-line ring-inset transition hover:ring-ink disabled:opacity-50";

export const dangerButton =
  "inline-flex h-11 items-center justify-center gap-2 rounded-[13px] bg-[#fcebea] px-4 text-[14px] font-semibold text-coral transition hover:bg-coral hover:text-white disabled:opacity-50";

export function one(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}
