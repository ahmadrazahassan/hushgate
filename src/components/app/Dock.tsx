"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";

export interface DockItem {
  href: string;
  label: string;
  icon: IconName;
  /** Match only this exact path (for section home pages). */
  exact?: boolean;
}

const BASE = 50;

function DockButton({ mouseX, label, children, active }: { mouseX: MotionValue<number>; label: string; children: React.ReactNode; active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const distance = useTransform(mouseX, (x) => {
    const rect = ref.current?.getBoundingClientRect();
    return rect ? x - rect.left - rect.width / 2 : Infinity;
  });
  const target = useTransform(distance, [-140, 0, 140], reduced ? [BASE, BASE, BASE] : [BASE, BASE * 1.32, BASE]);
  const size = useSpring(target, { stiffness: 420, damping: 28, mass: 0.4 });
  const lift = useTransform(size, [BASE, BASE * 1.32], [0, -8]);

  return (
    <motion.div ref={ref} style={{ width: size, height: size, y: lift }} className="group relative flex shrink-0 items-end justify-center">
      <span className="pointer-events-none absolute -top-10 left-1/2 hidden -translate-x-1/2 rounded-full bg-[#0b0d12] px-2.5 py-1 text-[12px] font-semibold whitespace-nowrap text-white opacity-0 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.6)] transition-opacity duration-200 group-hover:opacity-100 md:block">
        {label}
      </span>
      {children}
      {active && <motion.span layoutId="dock-dot" className="absolute -bottom-1.5 size-1 rounded-full bg-white" transition={{ type: "spring", stiffness: 500, damping: 35 }} />}
    </motion.div>
  );
}

/**
 * A floating dock at the bottom of the screen: icons swell under the pointer,
 * the current page is lit, and sign-out sits at the end after a divider.
 */
export function Dock({ items, signOut }: { items: DockItem[]; signOut: () => Promise<void> }) {
  const pathname = usePathname();
  const mouseX = useMotionValue(Infinity);

  const isActive = (item: DockItem) => (item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`));

  return (
    <nav aria-label="Panel" className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-3 md:bottom-6">
      <motion.div
        onMouseMove={(event) => mouseX.set(event.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 24, delay: 0.1 }}
        className="pointer-events-auto flex max-w-full items-end gap-1.5 overflow-x-auto rounded-[26px] bg-[#0b0d12]/92 p-2 shadow-[0_24px_60px_-20px_rgba(8,10,20,0.7),inset_0_1px_0_rgba(255,255,255,0.12)] ring-1 ring-white/10 backdrop-blur-xl [scrollbar-width:none] sm:gap-2"
      >
        {items.map((item) => {
          const active = isActive(item);
          return (
            <DockButton key={item.href} mouseX={mouseX} label={item.label} active={active}>
              <Link
                href={item.href}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
                className={`grid size-full place-items-center rounded-[17px] transition-colors duration-200 ${
                  active ? "bg-white text-[#0b0d12] shadow-[inset_0_-2px_0_rgba(0,0,0,0.08)]" : "bg-white/[0.06] text-white/75 hover:bg-white/[0.12] hover:text-white"
                }`}
              >
                <Icon name={item.icon} className="size-[46%]" />
              </Link>
            </DockButton>
          );
        })}
        <span className="mx-1 mb-3 h-7 w-px shrink-0 self-center bg-white/15" aria-hidden="true" />
        <DockButton mouseX={mouseX} label="Sign out" active={false}>
          <form action={signOut} className="size-full">
            <button type="submit" aria-label="Sign out" className="grid size-full place-items-center rounded-[17px] bg-white/[0.06] text-white/75 transition-colors duration-200 hover:bg-[#d2453a] hover:text-white">
              <Icon name="logout" className="size-[46%]" />
            </button>
          </form>
        </DockButton>
      </motion.div>
    </nav>
  );
}
