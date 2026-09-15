"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";

export interface DockItem {
  href: string;
  label: string;
  icon: IconName;
  /** Match only this exact path (for section home pages). */
  exact?: boolean;
}

type Tone = "light" | "dark";

/*
 * Two looks from the same parts:
 *   light: frosted pearl track sunk into the page, a raised white key for the current page (account).
 *   dark:  smoked glass track, a raised graphite key (admin).
 * The shell is a thin bevelled rim; the track is inset; the key glides between items.
 */
const looks: Record<Tone, { shell: CSSProperties; track: CSSProperties; key: CSSProperties; idle: string; current: string; divider: string; signOut: string }> = {
  light: {
    shell: {
      background: "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(214,218,227,0.9))",
      boxShadow: "0 30px 60px -24px rgba(21,25,60,0.35), 0 2px 6px rgba(21,25,34,0.06)",
    },
    track: {
      background: "linear-gradient(180deg, rgba(232,235,241,0.86), rgba(242,244,248,0.86))",
      boxShadow: "inset 0 2px 5px rgba(21,25,34,0.12), inset 0 -1px 0 rgba(255,255,255,0.95)",
    },
    key: {
      background: "linear-gradient(180deg, #ffffff 0%, #f1f3f7 100%)",
      boxShadow: "inset 0 1px 0 #ffffff, inset 0 -1.5px 1px rgba(21,25,34,0.07), 0 0 0 1px rgba(21,25,34,0.09), 0 6px 14px -4px rgba(21,25,60,0.22), 0 1px 2px rgba(21,25,34,0.12)",
    },
    idle: "text-slate hover:text-ink",
    current: "text-ink",
    divider: "bg-[#151922]/10",
    signOut: "text-slate hover:text-coral",
  },
  dark: {
    shell: {
      background: "linear-gradient(180deg, rgba(160,178,196,0.55), rgba(40,48,60,0.6) 45%, rgba(210,224,236,0.45))",
      boxShadow: "0 30px 60px -22px rgba(8,10,20,0.75), 0 2px 8px rgba(8,10,20,0.35)",
    },
    track: {
      background: "linear-gradient(180deg, rgba(28,34,44,0.92), rgba(44,54,66,0.9))",
      boxShadow: "inset 0 2px 6px rgba(0,0,0,0.45), inset 0 -1px 0 rgba(255,255,255,0.08)",
    },
    key: {
      background: "linear-gradient(180deg, #3a4656 0%, #232b36 100%)",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1.5px 1px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.35), 0 8px 16px -6px rgba(0,0,0,0.7)",
    },
    idle: "text-white/55 hover:text-white/90",
    current: "text-white",
    divider: "bg-white/10",
    signOut: "text-white/55 hover:text-[#ff8f86]",
  },
};

const itemBase =
  "relative flex shrink-0 items-center justify-center rounded-full font-semibold tracking-[-0.01em] transition-colors duration-200 " +
  "h-[54px] min-w-[56px] flex-col gap-1 px-2 text-[11px] " +
  "sm:h-12 sm:min-w-0 sm:flex-row sm:gap-2 sm:px-5 sm:text-[14px]";

export function Dock({ items, signOut, tone = "light" }: { items: DockItem[]; signOut: () => Promise<void>; tone?: Tone }) {
  const pathname = usePathname();
  const look = looks[tone];
  const isActive = (item: DockItem) => (item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`));

  return (
    <nav aria-label="Panel" className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-2.5 pb-[max(12px,env(safe-area-inset-bottom))] md:pb-7">
      <motion.div
        initial={{ y: 36, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 26, delay: 0.05 }}
        className="pointer-events-auto max-w-full rounded-full p-[3px] backdrop-blur-2xl backdrop-saturate-150"
        style={look.shell}
      >
        <div className="flex max-w-full items-center gap-0.5 overflow-x-auto rounded-full p-[5px] [scrollbar-width:none] sm:gap-1" style={look.track}>
          {items.map((item) => {
            const active = isActive(item);
            return (
              <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={`${itemBase} ${active ? look.current : look.idle}`}>
                {active && <motion.span layoutId={`panel-key-${tone}`} className="absolute inset-0 rounded-full" style={look.key} transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                <Icon name={item.icon} className="relative size-[19px] shrink-0" />
                <span className="relative whitespace-nowrap">{item.label}</span>
              </Link>
            );
          })}
          <span className={`mx-0.5 h-7 w-px shrink-0 sm:mx-1 ${look.divider}`} aria-hidden="true" />
          <form action={signOut} className="shrink-0">
            <button type="submit" className={`${itemBase} ${look.signOut}`}>
              <Icon name="logout" className="size-[19px] shrink-0" />
              <span className="whitespace-nowrap">Sign out</span>
            </button>
          </form>
        </div>
      </motion.div>
    </nav>
  );
}
