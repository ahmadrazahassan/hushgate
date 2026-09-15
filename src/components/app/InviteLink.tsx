"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";

/** The invite link with a copy button. */
export function InviteLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex items-center gap-2 rounded-[16px] bg-white p-1.5 pl-4 ring-1 ring-line ring-inset">
      <span className="min-w-0 flex-1 truncate font-mono text-[13px] text-slate" title={url}>{url.replace("https://", "")}</span>
      <button
        type="button"
        onClick={copy}
        aria-live="polite"
        className={`inline-flex h-10 shrink-0 items-center gap-1.5 rounded-[12px] px-4 text-[14px] font-semibold transition-colors ${copied ? "bg-mint-soft text-mint" : "bg-[#0b0d12] text-white hover:bg-ink"}`}
      >
        <Icon name={copied ? "check" : "copy"} className="size-4" />
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
