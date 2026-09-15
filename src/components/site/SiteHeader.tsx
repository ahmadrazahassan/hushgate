"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChromeLogo } from "@/components/ui/BrandLogos";
import { Icon } from "@/components/ui/Icon";

const links = [
  { href: "/#features", label: "Features" },
  { href: "/#locations", label: "Locations" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
  { href: "/download", label: "Download" },
];

/** Glossy app tile: the Hushgate mark in white on a cobalt squircle. */
export function AppTile({ size = 36 }: { size?: number }) {
  return (
    <span
      className="relative grid shrink-0 place-items-center overflow-hidden rounded-[10px] bg-[#4c62f7] shadow-[inset_0_1px_0_rgba(255,255,255,0.55),inset_0_-2px_4px_rgba(24,34,140,0.35),0_2px_6px_rgba(0,0,0,0.35)]"
      style={{ width: size, height: size, borderRadius: size * 0.28 }}
    >
      <span className="absolute inset-x-[10%] top-[6%] h-[46%] rounded-[40%] bg-white/30 blur-[1px]" aria-hidden="true" />
      <Image src="/brand/mark.png" alt="" width={48} height={38} unoptimized className="relative w-[58%] brightness-0 invert" priority />
    </span>
  );
}

/**
 * A black notch that hangs from the top edge of the window: rounded at the
 * bottom, with inverse curves where it meets the top of the page.
 */
export function SiteHeader({ installHref }: { installHref: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3">
      <div
        className={`notch pointer-events-auto relative w-full max-w-[880px] rounded-b-[22px] bg-[#0b0d12] text-white transition-shadow duration-300 ${
          scrolled ? "shadow-[0_18px_40px_-18px_rgba(8,10,20,0.55)]" : ""
        }`}
      >
        <div className="flex h-[60px] items-center gap-2 pr-2.5 pl-3 md:pl-3.5">
          <Link href="/" className="flex items-center gap-2.5 rounded-xl pr-2" aria-label="Hushgate home">
            <AppTile size={36} />
            <span className="font-display text-[19px] font-bold tracking-[-0.03em]">Hushgate</span>
          </Link>

          <nav className="ml-auto hidden items-center md:flex" aria-label="Main">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-full px-3 py-2 text-[15px] font-medium tracking-[-0.01em] text-white/80 transition-colors hover:text-white">
                {link.label}
              </Link>
            ))}
          </nav>

          <Link href="/login" className="ml-auto hidden rounded-full px-3 py-2 text-[15px] font-medium tracking-[-0.01em] text-white/80 transition-colors hover:text-white md:ml-1 md:inline-flex">
            Sign in
          </Link>
          <Link
            href={installHref}
            className="inline-flex h-10 items-center gap-2 rounded-[12px] bg-white px-4 text-[15px] font-semibold tracking-[-0.01em] text-[#0b0d12] transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] max-md:ml-auto md:ml-1"
          >
            <ChromeLogo className="size-[19px]" />
            <span className="hidden sm:inline">Add to Chrome</span>
            <span className="sm:hidden">Add</span>
          </Link>

          <button
            type="button"
            className="grid size-10 place-items-center rounded-full text-white/80 hover:text-white md:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <Icon name={open ? "close" : "menu"} className="size-6" />
          </button>
        </div>

        {open && (
          <nav className="border-t border-white/10 px-3 pt-2 pb-3 md:hidden" aria-label="Mobile">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-3 text-[16px] text-white/85 hover:bg-white/5 hover:text-white">
                {link.label}
              </Link>
            ))}
            <Link href="/login" onClick={() => setOpen(false)} className="block rounded-xl px-3 py-3 text-[16px] text-white/85 hover:bg-white/5 hover:text-white">
              Sign in
            </Link>
            <Link href="/signup" onClick={() => setOpen(false)} className="cta cta-cobalt mt-2 h-12 w-full text-[15px]">
              Start free trial
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
