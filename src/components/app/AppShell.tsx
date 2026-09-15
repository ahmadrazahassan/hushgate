import Link from "next/link";
import type { ReactNode } from "react";
import { Dock, type DockItem } from "@/components/app/Dock";
import { AppTile } from "@/components/site/SiteHeader";
import { Icon } from "@/components/ui/Icon";
import { signOut } from "@/app/account/actions";
import type { Viewer } from "@/lib/auth";

/** Panel frame: a black notch header, the page, and the glass bottom navigation. */
export function AppShell({ viewer, area, items, children }: { viewer: Viewer; area: "Account" | "Admin"; items: DockItem[]; children: ReactNode }) {
  const initial = (viewer.profile.full_name?.trim()[0] ?? viewer.email[0] ?? "H").toUpperCase();
  // The switch between areas only exists for admins; everyone else never sees the admin panel.
  const isAdmin = viewer.profile.role === "admin" && !viewer.profile.blocked;
  const switchLink = !isAdmin ? null : area === "Account" ? { href: "/admin", label: "Admin panel", icon: "gate" as const } : { href: "/account", label: "My account", icon: "user" as const };

  return (
    <div className="min-h-dvh bg-paper">
      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center px-3">
        <div className="notch pointer-events-auto relative flex h-[58px] w-full max-w-[760px] items-center gap-3 rounded-b-[22px] bg-[#0b0d12] pr-2.5 pl-3 text-white">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Hushgate home">
            <AppTile size={34} />
            <span className="font-display text-[18px] font-bold tracking-[-0.03em]">Hushgate</span>
          </Link>
          {area === "Admin" && <span className="rounded-full bg-cobalt px-2.5 py-0.5 text-[12px] font-semibold text-white">Admin</span>}
          <div className="ml-auto flex min-w-0 items-center gap-2">
            {switchLink && (
              <Link href={switchLink.href} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-white/10 px-3 text-[13px] font-semibold text-white/85 transition-colors hover:bg-white/20 hover:text-white">
                <Icon name={switchLink.icon} className="size-4" />
                <span className="hidden sm:inline">{switchLink.label}</span>
              </Link>
            )}
            <span className="hidden max-w-[200px] truncate text-[14px] text-white/60 md:inline">{viewer.email}</span>
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-[14px] font-bold text-[#0b0d12]" aria-hidden="true">{initial}</span>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1140px] px-5 pt-28 pb-40 md:px-8 md:pt-32">
        <div className="space-y-8 md:space-y-10">{children}</div>
      </main>
      <Dock items={items} signOut={signOut} tone={area === "Admin" ? "dark" : "light"} />
    </div>
  );
}
