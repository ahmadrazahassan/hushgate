import type { Metadata } from "next";
import { connection } from "next/server";
import { AppShell } from "@/components/app/AppShell";
import type { DockItem } from "@/components/app/Dock";
import { SetupNotice } from "@/components/app/SetupNotice";
import { requireAdmin } from "@/lib/auth";
import { publicSupabase } from "@/lib/env";

export const metadata: Metadata = {
  title: { default: "Control panel", template: "%s · Hushgate admin" },
  robots: { index: false, follow: false },
};

const items: DockItem[] = [
  { href: "/admin", label: "Overview", icon: "home", exact: true },
  { href: "/admin/users", label: "Users", icon: "users" },
  { href: "/admin/sessions", label: "Sessions", icon: "pulse" },
  { href: "/admin/locations", label: "Locations", icon: "globe" },
  { href: "/admin/activity", label: "Activity", icon: "clock" },
];

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  // Always rendered per request: the panel depends on the visitor's session.
  await connection();
  if (!publicSupabase()) return <SetupNotice />;
  const viewer = await requireAdmin();
  return (
    <AppShell viewer={viewer} area="Admin" items={items}>
      {children}
    </AppShell>
  );
}
