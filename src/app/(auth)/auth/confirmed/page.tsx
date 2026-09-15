import type { Metadata } from "next";
import Link from "next/link";
import { AuthTitle } from "@/components/auth/AuthParts";
import { authButton, authButtonQuiet } from "@/components/auth/authButton";
import { ChromeLogo } from "@/components/ui/BrandLogos";
import { Icon } from "@/components/ui/Icon";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Email confirmed", robots: { index: false } };

const steps = [
  { title: "Open the extensions menu", detail: "Click the puzzle-piece icon in Chrome's toolbar." },
  { title: "Sign in to Hushgate", detail: "Use the email and password you just confirmed." },
  { title: "Connect", detail: "Tap the power button and pick a location." },
];

export default function ConfirmedPage() {
  return (
    <>
      <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-mint-soft py-1.5 pr-3.5 pl-1.5 text-[13px] font-semibold text-mint">
        <span className="grid size-6 place-items-center rounded-full bg-mint text-white">
          <Icon name="check" className="size-3.5" />
        </span>
        Email confirmed
      </span>

      <AuthTitle title="You are" serif="all set.">
        Your 14-day free trial has started. Here is how to get connected in under a minute.
      </AuthTitle>

      <ol className="mt-8 overflow-hidden rounded-[20px] ring-1 ring-line ring-inset">
        {steps.map((step, index) => (
          <li key={step.title} className="flex gap-4 border-line bg-white px-5 py-4 not-last:border-b">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-cobalt-soft font-display text-[14px] font-bold text-cobalt">
              {index + 1}
            </span>
            <span className="min-w-0">
              <span className="block text-[15px] font-semibold text-ink">{step.title}</span>
              <span className="mt-0.5 block text-[14px] leading-snug text-slate">{step.detail}</span>
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-8 flex flex-col gap-3">
        <Link href="/account" className={authButton}>
          Open your account
          <Icon name="arrowRight" className="cta-arrow size-[1.1em]" />
        </Link>
        {site.chromeStoreUrl && (
          <a href={site.chromeStoreUrl} target="_blank" rel="noopener noreferrer" className={authButtonQuiet}>
            <ChromeLogo className="size-5" />
            Get Hushgate for Chrome
          </a>
        )}
      </div>
    </>
  );
}
