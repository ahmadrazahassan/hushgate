import Image from "next/image";
import { CtaButton } from "@/components/ui/CtaButton";
import { ChromeLogo } from "@/components/ui/BrandLogos";
import { Badge, type BadgeTone } from "@/components/app/ui";
import { accessLabels, accessState, formatDay, type Profile } from "@/lib/account";
import { site } from "@/lib/site";

const tones: Record<string, BadgeTone> = { trial: "cobalt", paid: "mint", complimentary: "mint", expired: "amber", blocked: "coral" };

/** The big status card on the account home: how much access is left and what to do next. */
export function AccessCard({ profile, now }: { profile: Profile; now: number }) {
  const access = accessState(profile, now);
  const install = site.chromeStoreUrl || "/download";

  const headline = {
    trial: <>{access.daysLeft} {access.daysLeft === 1 ? "day" : "days"} <span className="font-serif font-normal tracking-[-0.03em] italic">of free trial left.</span></>,
    paid: <>Protected <span className="font-serif font-normal tracking-[-0.03em] italic">until {formatDay(access.endsAt)}.</span></>,
    complimentary: <>Unlimited <span className="font-serif font-normal tracking-[-0.03em] italic">access, on us.</span></>,
    expired: <>Your trial <span className="font-serif font-normal tracking-[-0.03em] italic">has ended.</span></>,
    blocked: <>Account <span className="font-serif font-normal tracking-[-0.03em] italic">suspended.</span></>,
  }[access.reason];

  const detail = {
    trial: `Every location and feature is unlocked until ${formatDay(access.endsAt)}. You will not be charged during the trial.`,
    paid: "Every location and feature is included. Thank you for supporting a private internet.",
    complimentary: "Your account has complimentary access to every location and feature.",
    expired: "Choose a plan to switch Hushgate back on. Your settings in Chrome are kept.",
    blocked: profile.blocked_reason ? `Reason: ${profile.blocked_reason}. Contact support@hushgate.uk if you think this is a mistake.` : "Contact support@hushgate.uk if you think this is a mistake.",
  }[access.reason];

  return (
    <section className="relative overflow-hidden rounded-[34px] bg-[#0b0d12] px-6 py-8 text-white md:px-10 md:py-11">
      <div className="pointer-events-none absolute -top-16 -right-20 size-[340px] opacity-90 md:-top-24 md:-right-10 md:size-[440px]" aria-hidden="true">
        <div className="globe-turn absolute inset-0">
          <Image src="/globe.webp" alt="" fill unoptimized sizes="440px" className="object-cover" />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0b0d12] via-[#0b0d12]/85 to-[#0b0d12]/10" aria-hidden="true" />

      <div className="relative max-w-xl">
        <Badge tone={tones[access.reason]} dot>{accessLabels[access.reason]}</Badge>
        <p className="mt-5 font-display text-[40px] leading-[0.98] font-bold tracking-[-0.05em] md:text-[60px]">{headline}</p>
        <p className="mt-4 max-w-md text-[16px] leading-relaxed text-white/70">{detail}</p>

        {access.reason === "trial" && (
          <div className="mt-6 max-w-sm">
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-cobalt" style={{ width: `${Math.round(access.trialProgress * 100)}%` }} />
            </div>
            <p className="mt-2 text-[12px] text-white/50">Trial ends {formatDay(access.endsAt)}</p>
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {(access.reason === "trial" || access.reason === "expired") && (
            <CtaButton href="/account/plan" tone="cobalt" size="lg" arrow="right">Choose a plan</CtaButton>
          )}
          {access.reason !== "blocked" && (
            <CtaButton href={install} tone="black" size="lg" className="!border-white/15">
              <ChromeLogo className="size-5" />
              Add to Chrome
            </CtaButton>
          )}
        </div>
      </div>
    </section>
  );
}
