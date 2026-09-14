import type { Metadata } from "next";
import { connection } from "next/server";
import { AppShell } from "@/components/app/AppShell";
import type { DockItem } from "@/components/app/Dock";
import { SetupNotice } from "@/components/app/SetupNotice";
import { requireViewer } from "@/lib/auth";
import { publicSupabase } from "@/lib/env";

export const metadata: Metadata = {
  title: { default: "Your account", template: "%s · Hushgate account" },
  robots: { index: false, follow: false },
};

export default async function AccountLayout({ children }: LayoutProps<"/account">) {
  await connection();
  if (!publicSupabase()) return <SetupNotice />;
  const viewer = await requireViewer();

  const items: DockItem[] = [
    { href: "/account", label: "Home", icon: "home", exact: true },
    { href: "/account/plan", label: "Plan", icon: "card" },
    { href: "/account/profile", label: "Profile", icon: "sliders" },
    { href: "/account/security", label: "Security", icon: "lock" },
    ...(viewer.profile.role === "admin" ? [{ href: "/admin", label: "Admin panel", icon: "gate" } as DockItem] : []),
  ];

  return (
    <AppShell viewer={viewer} area="Account" items={items}>
      {children}
    </AppShell>
  );
}
