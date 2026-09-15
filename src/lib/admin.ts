import type { BadgeTone } from "@/components/app/ui";
import { accessLabels, accessState, type Profile } from "@/lib/account";

export interface AdminStats {
  total: number;
  new_7d: number;
  active_7d: number;
  on_trial: number;
  paid: number;
  complimentary: number;
  expired: number;
  blocked: number;
  admins: number;
  signups_14d: { day: string; count: number }[];
}

export interface AuditEntry {
  id: number;
  admin_email: string;
  action: string;
  target_id: string | null;
  target_email: string | null;
  detail: Record<string, unknown>;
  created_at: string;
}

const accessTones = { trial: "cobalt", paid: "mint", complimentary: "mint", expired: "amber", blocked: "coral" } as const satisfies Record<string, BadgeTone>;

export function accessBadge(profile: Profile, now: number): { tone: BadgeTone; label: string; detail: string } {
  const access = accessState(profile, now);
  const detail = access.reason === "trial" || access.reason === "paid" ? `${access.daysLeft} ${access.daysLeft === 1 ? "day" : "days"} left` : access.reason === "blocked" ? (profile.blocked_reason ?? "") : "";
  return { tone: accessTones[access.reason], label: accessLabels[access.reason], detail };
}

export function describeAudit(entry: AuditEntry): string {
  const detail = entry.detail ?? {};
  switch (entry.action) {
    case "block":
      return detail.reason ? `Suspended the account (${String(detail.reason)})` : "Suspended the account";
    case "unblock":
      return "Restored the account";
    case "extend_trial":
      return `Extended the trial by ${String(detail.days)} days`;
    case "set_plan":
      return `Changed the plan from ${String(detail.from)} to ${String(detail.to)}`;
    case "set_role":
      return detail.to === "admin" ? "Made them an admin" : "Removed admin access";
    case "delete":
      return "Deleted the account";
    case "assign_dedicated_ip":
      return `Gave them the dedicated IP ${String(detail.location_id)}`;
    case "release_dedicated_ip":
      return `Released the dedicated IP ${String(detail.location_id)}`;
    case "sign_out_everywhere":
      return `Signed them out everywhere (${String(detail.ended ?? 0)} VPN sessions ended)`;
    default:
      return entry.action;
  }
}
