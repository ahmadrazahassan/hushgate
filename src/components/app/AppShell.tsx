import Link from "next/link";
import type { ReactNode } from "react";
import { Dock, type DockItem } from "@/components/app/Dock";
import { AppTile } from "@/components/site/SiteHeader";
import { signOut } from "@/app/account/actions";
import type { Viewer } from "@/lib/auth";

/** Panel frame: a black notch header at the top, the page, and the dock at the bottom. */
export function AppShell({ viewer, area, items, children }: { viewer: Viewer; area: "Account" | "Admin"; items: DockItem[]; children: ReactNode }) {
  const initial = (viewer.profile.full_name?.trim()[0] ?? viewer.email[0] ?? "H").toUpperCase();
  return (
    <div className="min-h-dvh bg-paper">
      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center px-3">
        <div className="notch pointer-events-auto relative flex h-[58px] w-full max-w-[720px] items-center gap-3 rounded-b-[22px] bg-[#0b0d12] pr-2.5 pl-3 text-white">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Hushgate home">
            <AppTile size={34} />
            <span className="font-display text-[18px] font-bold tracking-[-0.03em]">Hushgate</span>
          </Link>
          <span className={`rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${area === "Admin" ? "bg-cobalt text-white" : "bg-white/10 text-white/80"}`}>{area}</span>
          <div className="ml-auto flex min-w-0 items-center gap-2.5">
            <span className="hidden max-w-[220px] truncate text-[14px] text-white/65 sm:inline">{viewer.email}</span>
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-[14px] font-bold text-[#0b0d12]" aria-hidden="true">{initial}</span>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1140px] px-5 pt-28 pb-44 md:px-8 md:pt-32">
        <div className="space-y-8 md:space-y-10">{children}</div>
      </main>
      <Dock items={items} signOut={signOut} />
    </div>
  );
}
