import Link from "next/link";
import { AppTile } from "@/components/site/SiteHeader";
import { ChromeLogo } from "@/components/ui/BrandLogos";
import { RisingWordmark } from "@/components/site/Motion";
import { CtaButton } from "@/components/ui/CtaButton";
import { site } from "@/lib/site";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/", label: "Home" },
      { href: "/#features", label: "Features" },
      { href: "/#locations", label: "Locations" },
      { href: "/#pricing", label: "Pricing" },
      { href: "/#faq", label: "FAQ" },
    ],
  },
  {
    title: "Get Hushgate",
    links: [
      { href: "/download", label: "Chrome extension" },
      { href: "/signup", label: "Start free trial" },
      { href: "/download", label: "iPhone and iPad", soon: true },
      { href: "/download", label: "Android", soon: true },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/contact", label: "Contact support" },
      { href: `mailto:${site.supportEmail}`, label: site.supportEmail },
      { href: "/permissions", label: "Extension permissions" },
      { href: "/reset-password", label: "Reset password" },
      { href: "/account", label: "Your account" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy policy" },
      { href: "/terms", label: "Terms of service" },
      { href: "/refunds", label: "Refunds and cancellation" },
      { href: "/acceptable-use", label: "Acceptable use" },
      { href: "/cookies", label: "Cookie policy" },
      { href: "/licenses", label: "Open-source licences" },
    ],
  },
];
export function SiteFooter({ installHref }: { installHref: string }) {
  return (
    <footer className="relative mt-12 overflow-hidden bg-[#0b0d12] text-white">
      {/* The white page reaches into the footer as an inverted notch. */}
      <div className="notch-white absolute top-0 left-1/2 h-[30px] w-[calc(100%-72px)] -translate-x-1/2 rounded-b-[14px] md:h-9 md:w-[51%] bg-white" aria-hidden="true" />

      <div className="container-page relative z-10 grid grid-cols-2 gap-x-6 gap-y-12 pt-24 pb-10 md:grid-cols-3 md:gap-8 lg:grid-cols-[1.4fr_repeat(4,1fr)] md:pt-28">
        <div className="col-span-2 max-w-sm md:col-span-3 lg:col-span-1">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <AppTile size={30} />
            <span className="font-display text-[18px] font-bold tracking-[-0.02em]">Hushgate</span>
            <span className="text-[16px] text-white/45">Chrome extension</span>
          </Link>
          <p className="mt-6 leading-none">
            <span className="block font-display text-[30px] font-bold tracking-[-0.05em]">Browse quietly.</span>
            <span className="block font-serif text-[31px] tracking-[-0.03em] italic">Be nowhere.</span>
          </p>
          <p className="mt-5 text-[14px] leading-relaxed text-white/60">
            Hushgate routes Chrome through encrypted servers in more than 50 countries, with a kill switch and leak protection built in.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <CtaButton href={installHref} tone="white" size="md" arrow="right">
              <ChromeLogo className="size-5" />
              Add to Chrome
            </CtaButton>
            <Link href="/signup" className="inline-flex h-11 items-center rounded-[14px] px-4 text-[14px] font-semibold text-white/80 ring-1 ring-white/15 transition-colors ring-inset hover:bg-white/5 hover:text-white">
              Start free trial
            </Link>
          </div>
          <p className="mt-7 text-[13px] text-white/45">© {new Date().getFullYear()} {site.domain} · All rights reserved</p>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <h2 className="font-sans text-[15px] font-semibold tracking-normal text-white/45">{column.title}</h2>
            <ul className="mt-5 space-y-3.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="inline-flex items-center gap-2 text-[15px] text-white transition-opacity hover:opacity-70">
                    {link.label}
                    {"soon" in link && link.soon && <span className="rounded-full px-1.5 py-px text-[11px] font-medium text-white/55 ring-1 ring-white/20 ring-inset">Soon</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <RisingWordmark
        text="Hushgate"
        className="pointer-events-none relative -mb-[0.24em] overflow-hidden px-2 text-center font-display text-[21vw] leading-[0.8] font-bold tracking-[-0.06em] whitespace-nowrap text-[#16181f] select-none xl:text-[300px]"
      />
    </footer>
  );
}
