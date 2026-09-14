import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";
import { PROFILE_COLUMNS, type Profile } from "@/lib/account";
import { createClient } from "@/lib/supabase/server";

export interface Viewer {
  userId: string;
  email: string;
  profile: Profile;
}

/**
 * The signed-in visitor and their profile, verified with Supabase.
 * Cached per request so layouts, pages and Server Actions share one lookup.
 */
export const getViewer = cache(async (): Promise<Viewer | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  const { data: profile } = await supabase.from("profiles").select(PROFILE_COLUMNS).eq("id", data.user.id).maybeSingle<Profile>();
  if (!profile) return null;
  return { userId: data.user.id, email: data.user.email ?? profile.email, profile };
});

/** Use at the top of every account page and Server Action. */
export async function requireViewer(next = "/account"): Promise<Viewer> {
  const viewer = await getViewer();
  if (!viewer) redirect(`/login?next=${encodeURIComponent(next)}`);
  return viewer;
}

/** Use at the top of every admin page and Server Action. The database checks the role again on every admin call. */
export async function requireAdmin(next = "/admin"): Promise<Viewer> {
  const viewer = await requireViewer(next);
  if (viewer.profile.role !== "admin" || viewer.profile.blocked) redirect("/no-access");
  return viewer;
}
