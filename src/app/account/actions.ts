"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireViewer } from "@/lib/auth";
import { gateway, gatewayConfigured } from "@/lib/gateway";
import { createClient } from "@/lib/supabase/server";

type Tone = "ok" | "error";

function back(path: string, tone: Tone, text: string): never {
  const url = new URL(path, "http://local");
  url.searchParams.set("notice", text);
  url.searchParams.set("tone", tone);
  redirect(`${url.pathname}${url.search}`);
}

function field(form: FormData, name: string): string {
  const value = form.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login?signedOut=1");
}

const LOCATIONS = new Set(["", "fastest", "CA", "DE", "US"]);

export async function updateProfile(form: FormData) {
  const viewer = await requireViewer("/account/profile");
  const fullName = field(form, "fullName").slice(0, 80);
  const preferred = field(form, "preferredLocation");
  if (!LOCATIONS.has(preferred)) back("/account/profile", "error", "Choose a location from the list.");

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName || null, preferred_location: preferred || null, product_emails: form.get("productEmails") === "on" })
    .eq("id", viewer.userId);
  if (error) back("/account/profile", "error", "Your profile could not be saved. Try again.");
  // Keep the auth record's display name in step, so emails greet people by name.
  await supabase.auth.updateUser({ data: { full_name: fullName || null } });
  revalidatePath("/account", "layout");
  back("/account/profile", "ok", "Profile saved.");
}

export async function signOutEverywhere() {
  const viewer = await requireViewer("/account/security");
  const supabase = await createClient();
  let note = "";
  if (gatewayConfigured()) {
    try {
      const result = await gateway.signOutUser(viewer.userId);
      note = ` Ended ${result.endedSessions} VPN ${result.endedSessions === 1 ? "session" : "sessions"}.`;
    } catch {
      note = " The VPN servers could not be reached; Chrome sessions end on their own within an hour.";
    }
  }
  // Signs out every other browser and the extension's Supabase sign-in; this browser stays signed in.
  await supabase.auth.signOut({ scope: "others" });
  back("/account/security", "ok", `Signed out on every other device.${note}`);
}

export async function deleteMyAccount(form: FormData) {
  const viewer = await requireViewer("/account/security");
  if (field(form, "confirm").toLowerCase() !== viewer.email.toLowerCase()) {
    back("/account/security", "error", "Type your email exactly to confirm.");
  }
  if (gatewayConfigured()) {
    try {
      await gateway.signOutUser(viewer.userId);
    } catch {
      // The account is deleted either way; VPN sessions expire on their own.
    }
  }
  const supabase = await createClient();
  const { error } = await supabase.rpc("delete_my_account");
  if (error) back("/account/security", "error", "Your account could not be deleted. Contact support@hushgate.uk.");
  await supabase.auth.signOut();
  redirect("/login?deleted=1");
}
