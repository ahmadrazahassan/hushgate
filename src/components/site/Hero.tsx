import Image from "next/image";
import { AppTile } from "@/components/site/SiteHeader";
import { AppleLogo, ChromeLogo, GooglePlayLogo } from "@/components/ui/BrandLogos";
import { Flag } from "@/components/ui/Brand";
import { Icon } from "@/components/ui/Icon";
import { TRIAL_DAYS } from "@/lib/pricing";
import { CtaButton } from "@/components/ui/CtaButton";
import { HeroLayer } from "@/components/site/Motion";
import { Offer } from "@/components/site/Offer";

const chips = [
  { label: "Fastest", count: null, flag: null },
  { label: "Germany", count: 6, flag: "DE" },
  { label: "Canada", count: 6, flag: "CA" },
  { label: "United States", count: 7, flag: "US" },
] as const;

function Popup({ name, alt, className }: { name: string; alt: string; className: string }) {
  return (
    <Image
      src={`/extension/${name}.png`}
      alt={alt}
      width={960}
      height={1200}
      unoptimized
      priority
      className={`h-auto rounded-[26px] shadow-[0_50px_90px_-40px_rgba(10,20,70,0.65),0_0_0_1px_rgba(21,25,34,0.08)] ${className}`}
    />
  );
}

export function Hero({ installHref }: { installHref: string }) {
  return (
    <section className="relative isolate overflow-hidden text-white">
      <div className="hero-sky absolute inset-0 -z-20" aria-hidden="true" />
      {/* Original resolution on purpose: no resizing or recompression. */}
      <HeroLayer y={160} className="absolute inset-0 -z-10">
      <Image
        src="/hero/hills.png"
        alt=""
        width={1672}
        height={941}
        unoptimized
        priority
        className="hero-hills absolute bottom-0 left-1/2 h-[56%] min-h-[560px] w-full max-w-none -translate-x-1/2 object-cover object-[center_82%]"
      />
      </HeroLayer>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-44 bg-gradient-to-b from-transparent to-white" aria-hidden="true" />

      <HeroLayer y={120} fade scale={0.94} className="container-page relative z-10 flex flex-col items-center pt-[132px] text-center md:pt-[150px]">
        <p className="animate-rise inline-flex items-center gap-2.5 font-display text-[19px] font-bold tracking-[-0.02em] md:text-[22px]">
          <ChromeLogo className="size-[24px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)] md:size-[26px]" />
          Private VPN for Chrome
        </p>

        <h1 className="animate-rise mt-5 [animation-delay:80ms]">
          <span className="block font-display text-[56px] leading-[0.95] font-bold tracking-[-0.055em] sm:text-[80px] md:text-[104px]">Browse quietly.</span>
          <span className="-mt-1 block pr-2 font-serif text-[64px] leading-[1] font-normal tracking-[-0.035em] italic sm:text-[92px] md:text-[120px]">Be nowhere.</span>
        </h1>

        <p className="animate-rise mt-6 max-w-[720px] text-[18px] leading-[1.45] font-medium tracking-[-0.012em] text-white/92 [animation-delay:160ms] md:text-[23px]">
          Hushgate sends Chrome through encrypted servers in more than 50 countries, with a kill switch and leak protection built in, so websites stop seeing where you really are.
        </p>

        <Offer tone="white" className="animate-rise mt-8 [animation-delay:200ms]" />

        <div className="animate-rise mt-7 [animation-delay:240ms]">
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <CtaButton href="/signup" tone="cobalt" size="xl" arrow="right">Start free trial</CtaButton>
            <CtaButton href={installHref} tone="black" size="xl">
              <ChromeLogo className="size-[26px]" />
              Add to Chrome
            </CtaButton>
          </div>
        </div>

        <ul className="animate-rise mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-[14px] font-medium text-[#34508a] [animation-delay:300ms] md:text-[15px]">
          <li>{TRIAL_DAYS}-day free trial</li>
          <li>No browsing logs</li>
          <li>Clean, static IPs</li>
          <li>Chrome 116 or later<a href="#footnotes" className="align-super text-[0.7em]" aria-label="See footnote 2">2</a></li>
        </ul>

        <div className="animate-rise mt-4 flex flex-wrap items-center justify-center gap-2.5 [animation-delay:340ms]">
          {[
            { logo: <AppleLogo className="size-[17px] text-[#0b0d12]" />, store: "App Store" },
            { logo: <GooglePlayLogo className="size-[17px]" />, store: "Google Play" },
          ].map((item) => (
            <span
              key={item.store}
              className="inline-flex h-9 items-center gap-2 rounded-full bg-white/45 pr-1.5 pl-3 text-[13px] font-semibold text-[#0b0d12] ring-1 ring-white/70 backdrop-blur-md ring-inset"
            >
              {item.logo}
              {item.store}
              <span className="rounded-full bg-[#0b0d12] px-2 py-0.5 text-[11px] font-semibold tracking-[0.02em] text-white">Coming soon</span>
            </span>
          ))}
        </div>
      </HeroLayer>

      {/* Device: a glass desktop with a dark Chrome window and the extension open. */}
      <div className="container-page relative z-10 mt-14 pb-16 md:mt-16">
        <div className="relative mx-auto h-[420px] w-full max-w-[1120px] sm:h-[640px] md:h-[680px]">
          {/* Frosted glass that fades into the hills; the content above it stays crisp. */}
          <div className="device-fade absolute inset-0 rounded-t-[36px] border border-white/60 bg-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-xl md:rounded-t-[48px]" aria-hidden="true" />
          <div className="absolute inset-x-0 top-0 hidden h-12 items-center justify-between px-7 text-[15px] font-semibold text-white md:flex">
            <span className="inline-flex items-center gap-2 drop-shadow-[0_1px_2px_rgba(20,40,110,0.25)]">
              <Image src="/brand/mark.png" alt="" width={48} height={38} unoptimized className="h-[15px] w-auto brightness-0 invert" />
              Hushgate
            </span>
            <span className="inline-flex items-center gap-3 drop-shadow-[0_1px_2px_rgba(20,40,110,0.25)]">
              <Icon name="search" className="size-[17px]" />
              <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
                <path d="M2.5 9.2a14 14 0 0 1 19 0M5.8 12.6a9.3 9.3 0 0 1 12.4 0M9.2 16a4.6 4.6 0 0 1 5.6 0" />
                <circle cx="12" cy="19.3" r="0.9" fill="currentColor" />
              </svg>
              09:41
            </span>
          </div>

          {/* Dark browser window hanging from the top edge. */}
          <div className="window-notch absolute top-0 left-1/2 w-full max-w-[780px] -translate-x-1/2 rounded-t-[36px] rounded-b-[30px] md:rounded-t-none bg-[#0b0d12] px-3.5 pt-3.5 pb-4 md:w-[72%] md:px-4 md:pt-4">
            <div className="flex items-center gap-2.5">
              <div className="hidden items-center gap-1 text-white/45 sm:flex">
                <Icon name="arrowRight" className="size-[18px] rotate-180" />
                <Icon name="arrowRight" className="size-[18px]" />
              </div>
              <div className="flex h-10 min-w-0 flex-1 items-center gap-2.5 rounded-full bg-white/[0.08] px-4 text-[14px] text-white/75">
                <Icon name="lock" className="size-[15px] shrink-0 text-white/55" />
                <span className="truncate">hushgate.uk</span>
              </div>
              <span className="grid size-10 place-items-center rounded-full bg-white/[0.08] text-white/60" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinejoin="round">
                  <path d="M9 4.5a2 2 0 1 1 4 0V6h3.5a1 1 0 0 1 1 1v3.5H19a2 2 0 1 1 0 4h-1.5V18a1 1 0 0 1-1 1H13v-1.5a2 2 0 1 0-4 0V19H5.5a1 1 0 0 1-1-1v-3.5H6a2 2 0 1 0 0-4H4.5V7a1 1 0 0 1 1-1H9Z" />
                </svg>
              </span>
              <span className="relative grid size-10 place-items-center rounded-full bg-white/[0.08] ring-2 ring-[#5267ff]" aria-label="Hushgate extension, open">
                <AppTile size={24} />
              </span>
              <span className="hidden size-10 place-items-center rounded-full bg-[#e9ecff] text-[14px] font-bold text-[#4055d6] sm:grid" aria-hidden="true">A</span>
            </div>

            <div className="mt-3.5 flex gap-2 overflow-hidden">
              {chips.map((chip, index) => (
                <span
                  key={chip.label}
                  className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-full px-3.5 text-[14px] font-medium ${index === 1 ? "bg-white text-[#0b0d12]" : "bg-white/[0.08] text-white/85"}`}
                >
                  {chip.flag ? <Flag code={chip.flag} className="h-3 w-auto" /> : <Icon name="signal" className="size-[14px]" />}
                  {chip.label}
                  {chip.count !== null && <span className={index === 1 ? "text-[#0b0d12]/45" : "text-white/40"}>{chip.count}</span>}
                </span>
              ))}
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/[0.08] text-white/70" aria-hidden="true">
                <Icon name="plus" className="size-[16px]" />
              </span>
            </div>
          </div>

          {/* Two screens of the popup, side by side, sitting under the browser window. */}
          <div className="absolute inset-x-0 top-[146px] flex items-start justify-center gap-3 px-3 sm:top-[164px] sm:gap-7 md:gap-9">
            <Popup name="home-connected" alt="Hushgate connected to Frankfurt 02, showing the real and VPN IP addresses" className="w-[calc(50%-6px)] max-w-[336px]" />
            <Popup name="locations" alt="Hushgate locations screen listing seven Los Angeles servers" className="w-[calc(50%-6px)] max-w-[336px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
