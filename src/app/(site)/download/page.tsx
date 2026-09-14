import type { Metadata } from "next";
import { ExtensionShot } from "@/components/site/ExtensionShot";
import { StoreBadges } from "@/components/site/StoreBadges";
import { ChromeLogo } from "@/components/ui/BrandLogos";
import { Eyebrow } from "@/components/ui/Brand";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { CtaButton } from "@/components/ui/CtaButton";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Download for Chrome",
  description: "Install the Hushgate extension for Google Chrome.",
};

export default function DownloadPage() {
  const live = Boolean(site.chromeStoreUrl);
  return (
    <section className="container-page grid items-center gap-14 pt-32 pb-24 md:pt-40 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <Eyebrow><ChromeLogo className="size-4" />Google Chrome</Eyebrow>
        <h1 className="mt-6 text-5xl leading-[1.04] font-bold md:text-[64px]">Hushgate for Chrome</h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate">
          Works in Chrome on Windows, macOS, Linux and ChromeOS, version 116 or newer. Other Chromium browsers such as Edge and Brave usually work too.
        </p>

        {live ? (
          <div className="mt-9">
            <CtaButton href={site.chromeStoreUrl} tone="black" size="lg" arrow="right"><ChromeLogo className="size-6" />Add to Chrome</CtaButton>
          </div>
        ) : (
          <div className="mt-9 max-w-xl rounded-[24px] bg-mist p-7 ring-1 ring-inset ring-line">
            <p className="font-display text-xl font-bold">Coming to the Chrome Web Store</p>
            <p className="mt-2 text-[16px] text-slate">Hushgate is in review. Leave your email with support and we will tell you the moment it is live.</p>
            <ButtonLink href={`mailto:${site.supportEmail}?subject=Tell%20me%20when%20Hushgate%20is%20live`} variant="ink" className="mt-5">
              <Icon name="mail" className="size-[18px]" />Notify me
            </ButtonLink>
          </div>
        )}

        <ol className="mt-12 space-y-6">
          {[
            ["Install", "Click Add to Chrome, then Add extension."],
            ["Pin it", "Open the puzzle-piece menu in Chrome and pin Hushgate next to the address bar."],
            ["Sign in", "Create an account with your email and a password, or sign in if you already have one."],
            ["Connect", "Tap the power button. Choose a country from Locations whenever you like."],
          ].map(([title, body], index) => (
            <li key={title} className="flex gap-5">
              <span className="grid size-9 shrink-0 place-items-center rounded-full font-display text-[15px] font-bold text-cobalt ring-1 ring-inset ring-line">{index + 1}</span>
              <div>
                <p className="text-lg font-semibold">{title}</p>
                <p className="mt-1 text-[16px] text-slate">{body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-12 border-t border-line pt-8">
          <p className="font-display text-xl font-bold">Hushgate for phones</p>
          <p className="mt-1 text-[15px] text-slate">Apps for iPhone and Android are on the way. Your account will work there too.</p>
          <StoreBadges className="mt-5" />
        </div>
      </div>
      <div className="flex justify-center rounded-[var(--radius-card)] bg-cobalt px-8 pt-12">
        <ExtensionShot name="home-ready" priority className="w-full max-w-[360px] translate-y-6" />
      </div>
    </section>
  );
}
