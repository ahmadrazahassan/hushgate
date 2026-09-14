"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { gateway, gatewayConfigured, GatewayError } from "@/lib/gateway";
import { createClient } from "@/lib/supabase/server";

function back(path: string, tone: "ok" | "error", text: string): never {
  const url = new URL(path, "http://local");
  url.searchParams.set("notice", text);
  url.searchParams.set("tone", tone);
  redirect(`${url.pathname}${url.search}`);
}

function field(form: FormData, name: string): string {
  const value = form.get(name);
  return typeof value === "string" ? value.trim() : "";
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function userPath(userId: string) {
  return UUID.test(userId) ? `/admin/users/${userId}` : "/admin/users";
}

/** Database errors raised by the admin functions are written for people; anything else gets a plain fallback. */
function explain(error: { code?: string; message?: string } | null): string {
  if (!error) return "";
  if (error.code && ["42501", "22023", "P0002"].includes(error.code) && error.message) return error.message.endsWith(".") ? error.message : `${error.message}.`;
  return "That did not work. Try again.";
}

async function endVpnAccess(userId: string): Promise<string> {
  if (!gatewayConfigured()) return "";
  try {
    const { endedSessions } = await gateway.signOutUser(userId);
    return ` Ended ${endedSessions} VPN ${endedSessions === 1 ? "session" : "sessions"}.`;
  } catch (error) {
    return ` The VPN servers could not be told (${error instanceof GatewayError ? error.message : "unreachable"}).`;
  }
}

export async function setBlocked(form: FormData) {
  await requireAdmin();
  const userId = field(form, "userId");
  const blocked = field(form, "blocked") === "true";
  const path = userPath(userId);
  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_set_blocked", { target_id: userId, is_blocked: blocked, reason: field(form, "reason") || null });
  if (error) back(path, "error", explain(error));
  const note = blocked ? await endVpnAccess(userId) : "";
  revalidatePath("/admin", "layout");
  back(path, "ok", blocked ? `Account suspended.${note}` : "Account restored.");
}

export async function extendTrial(form: FormData) {
  await requireAdmin();
  const userId = field(form, "userId");
  const days = Number.parseInt(field(form, "days"), 10);
  const path = userPath(userId);
  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_extend_trial", { target_id: userId, days });
  if (error) back(path, "error", explain(error));
  revalidatePath("/admin", "layout");
  back(path, "ok", `Trial extended by ${days} ${days === 1 ? "day" : "days"}.`);
}

export async function setPlan(form: FormData) {
  await requireAdmin();
  const userId = field(form, "userId");
  const plan = field(form, "plan");
  const path = userPath(userId);
  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_set_plan", { target_id: userId, new_plan: plan });
  if (error) back(path, "error", explain(error));
  revalidatePath("/admin", "layout");
  back(path, "ok", "Plan updated.");
}

export async function setRole(form: FormData) {
  await requireAdmin();
  const userId = field(form, "userId");
  const role = field(form, "role");
  const path = userPath(userId);
  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_set_role", { target_id: userId, new_role: role });
  if (error) back(path, "error", explain(error));
  revalidatePath("/admin", "layout");
  back(path, "ok", role === "admin" ? "Now an admin." : "Admin access removed.");
}

export async function signOutEverywhere(form: FormData) {
  await requireAdmin();
  const userId = field(form, "userId");
  const path = userPath(userId);
  if (!gatewayConfigured()) back(path, "error", "Connect the gateway (GATEWAY_API_URL and GATEWAY_ADMIN_KEY) to end VPN sessions.");
  let ended = 0;
  try {
    ended = (await gateway.signOutUser(userId)).endedSessions;
  } catch (error) {
    back(path, "error", error instanceof GatewayError ? error.message : "The gateway could not be reached.");
  }
  const supabase = await createClient();
  await supabase.rpc("admin_record", { action: "sign_out_everywhere", target_id: userId, detail: { ended } });
  revalidatePath("/admin", "layout");
  back(path, "ok", `Signed out of Hushgate everywhere. Ended ${ended} VPN ${ended === 1 ? "session" : "sessions"}.`);
}

export async function deleteUser(form: FormData) {
  await requireAdmin();
  const userId = field(form, "userId");
  const email = field(form, "email").toLowerCase();
  const path = userPath(userId);
  if (!email || field(form, "confirm").toLowerCase() !== email) back(path, "error", "Type the account email exactly to confirm.");
  await endVpnAccess(userId);
  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_delete_user", { target_id: userId });
  if (error) back(path, "error", explain(error));
  revalidatePath("/admin", "layout");
  back("/admin/users", "ok", `Deleted ${email}.`);
}

export async function endSession(form: FormData) {
  await requireAdmin();
  try {
    await gateway.endSession(field(form, "sessionId"));
  } catch (error) {
    back("/admin/sessions", "error", error instanceof GatewayError ? error.message : "The gateway could not be reached.");
  }
  revalidatePath("/admin/sessions");
  back("/admin/sessions", "ok", "Session ended.");
}

export async function setLocationEnabled(form: FormData) {
  await requireAdmin();
  const locationId = field(form, "locationId");
  const enabled = field(form, "enabled") === "true";
  try {
    await gateway.setLocationEnabled(locationId, enabled);
  } catch (error) {
    back("/admin/locations", "error", error instanceof GatewayError ? error.message : "The gateway could not be reached.");
  }
  revalidatePath("/admin/locations");
  back("/admin/locations", "ok", `${locationId} is now ${enabled ? "available" : "turned off for new connections"}.`);
}
