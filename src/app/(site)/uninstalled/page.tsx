import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/site/PageIntro";
import { Reveal } from "@/components/site/Reveal";
import { ChromeLogo } from "@/components/ui/BrandLogos";
import { CtaButton } from "@/components/ui/CtaButton";
import { Icon, type IconName } from "@/components/ui/Icon";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hushgate was removed",
  description: "Hushgate has been removed from Chrome. Tell us why, or bring it back any time.",
  robots: { index: false },
};

const reasons = [
  "It was too slow",
  "A site I need stopped working",
  "I could not connect",
  "Too expensive",
  "I only needed it once",
  "Something else",
];

const afterwards: { icon: IconName; title: string; body: string }[] = [
  { icon: "refresh", title: "Chrome is back to normal", body: "Removing the extension restores your usual connection right away. No proxy setting is left behind on your computer." },
  { icon: "trash", title: "Your settings are gone", body: "Chrome deletes the extension's local storage when it is removed, so your rules, chosen country and sign-in token go with it." },
  { icon: "user", title: "Your account still exists", body: "Sign in on the website any time to manage or cancel your plan. Deleting the extension does not cancel a subscription." },
];

function reasonHref(reason: string) {
  return `mailto:${site.supportEmail}?subject=${encodeURIComponent("Why I removed Hushgate")}&body=${encodeURIComponent(`Reason: ${reason}\n\nWhat happened:\n`)}`;
}

export default function UninstalledPage() {
  return (
    <>
      <section className="container-page pt-32 pb-12 md:pt-44">
        <PageIntro
          align="center"
          eyebrow={<><Icon name="gate" className="size-5" />Removed</>}
          line="Hushgate is gone."
          serif="The door stays open."
          lead={<p>Your normal connection is back, and nothing of ours is left in Chrome. If something did not work the way you expected, one line from you helps us fix it for everyone.</p>}
        />

        <Reveal delay={0.25} className="mx-auto mt-10 max-w-3xl">
          <p className="text-center text-[14px] font-semibold text-ink">What made you remove it?</p>
          <ul className="mt-5 flex flex-wrap justify-center gap-2.5">
            {reasons.map((reason) => (
              <li key={reason}>
                <a
                  href={reasonHref(reason)}
                  className="inline-flex items-center gap-2 rounded-full bg-mist px-4 py-2.5 text-[14px] font-medium text-slate transition-colors hover:text-ink"
                >
                  {reason}
                  <Icon name="arrowUpRight" className="size-4" />
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-center text-[13px] text-muted">Each one opens an email with the reason filled in. Add a sentence if you can spare it.</p>
        </Reveal>

        <Reveal delay={0.3} className="mt-11 flex flex-wrap items-center justify-center gap-4">
          <CtaButton href={site.chromeStoreUrl || "/download"} tone="cobalt" size="lg" arrow="right">
            <ChromeLogo className="size-5" />
            Reinstall Hushgate
          </CtaButton>
          <Link href="/contact" className="inline-flex h-[52px] items-center gap-2 rounded-[14px] px-5 text-[15px] font-semibold text-slate ring-1 ring-line transition-colors ring-inset hover:text-ink">
            <Icon name="message" className="size-[18px]" />
            Talk to support
          </Link>
        </Reveal>
      </section>

      <section className="container-page py-16 md:py-24" aria-labelledby="after-title">
        <h2 id="after-title" className="sr-only">What happens now</h2>
        <ul className="grid gap-10 border-t border-line pt-12 md:grid-cols-3 md:gap-12">
          {afterwards.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.08}>
              <li>
                <Icon name={item.icon} className="size-7 text-cobalt" />
                <h3 className="mt-5 text-[19px] font-semibold tracking-[-0.02em]">{item.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate">{item.body}</p>
              </li>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="container-page pb-24 md:pb-32">
        <div className="grid gap-8 rounded-[var(--radius-card)] bg-mist px-7 py-12 md:grid-cols-[1fr_auto] md:items-center md:px-12">
          <div>
            <h2 className="text-[28px] leading-tight font-bold tracking-[-0.035em] md:text-[34px]">Paying for a plan?</h2>
            <p className="mt-3 max-w-lg text-[16px] leading-relaxed text-slate">
              Removing the extension does not cancel it. Cancel in your account in one click, and see the <Link className="font-medium text-ink underline decoration-line underline-offset-4 hover:decoration-ink" href="/refunds">refunds policy</Link> if you paid in the last 14 days.
            </p>
          </div>
          <Link href="/account/plan" className="cta cta-black h-[52px] px-6 text-[16px] justify-self-start md:justify-self-end">
            Manage your plan
            <Icon name="arrowRight" className="size-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
