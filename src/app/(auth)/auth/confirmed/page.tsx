import type { Metadata } from "next";
import Link from "next/link";
import { AuthTitle, authButton } from "@/components/auth/AuthParts";
import { ChromeLogo } from "@/components/ui/BrandLogos";

export const metadata: Metadata = { title: "Email confirmed", robots: { index: false } };

const steps = ["Click the puzzle-piece icon in Chrome.", "Open Hushgate and choose Sign in.", "Tap the power button to connect."];

export default function ConfirmedPage() {
  return (
    <>
      <AuthTitle title="You are" serif="all set.">Your email is confirmed and your 14-day free trial has started. Sign in to Hushgate in Chrome with your email and password.</AuthTitle>
      <ol className="mt-8 space-y-3 rounded-[20px] bg-mist p-5">
        {steps.map((step, index) => (
          <li key={step} className="flex items-center gap-3 text-[15px] text-slate">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white font-display text-[13px] font-bold text-cobalt ring-1 ring-line ring-inset">{index + 1}</span>
            {step}
          </li>
        ))}
      </ol>
      <Link href="/account" className={`${authButton} mt-8`}>
        <ChromeLogo className="size-5" />
        Open your account
      </Link>
    </>
  );
}
