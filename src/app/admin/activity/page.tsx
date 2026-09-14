import Link from "next/link";
import { Empty, Notice, PanelTitle } from "@/components/app/ui";
import { Icon } from "@/components/ui/Icon";
import { formatDateTime } from "@/lib/account";
import { describeAudit, type AuditEntry } from "@/lib/admin";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Activity" };

export default async function ActivityPage() {
  await requireAdmin("/admin/activity");
  const supabase = await createClient();
  const { data, error } = await supabase.from("admin_audit").select("*").order("created_at", { ascending: false }).limit(200);
  const entries = (data as AuditEntry[] | null) ?? [];

  return (
    <>
      <PanelTitle eyebrow={<><Icon name="clock" className="size-4" />Activity</>} title="Who changed" serif="what." description="Every change made in this panel, newest first. Entries cannot be edited or removed from here." />
      {error && <Notice tone="error" text={error.message} />}
      <section className="overflow-hidden rounded-[28px] ring-1 ring-line ring-inset">
        {entries.length === 0 ? (
          <Empty icon="clock">No admin activity yet.</Empty>
        ) : (
          <ol className="divide-y divide-line">
            {entries.map((entry) => (
              <li key={entry.id} className="flex flex-col gap-1.5 px-6 py-4 md:flex-row md:items-center md:gap-6">
                <span className="text-[13px] whitespace-nowrap text-muted md:w-44">{formatDateTime(entry.created_at)}</span>
                <span className="min-w-0 flex-1 text-[15px]">
                  <span className="font-semibold">{entry.admin_email || "Removed admin"}</span> <span className="text-slate">{describeAudit(entry).toLowerCase()}</span>
                </span>
                {entry.target_id && entry.action !== "delete" ? (
                  <Link href={`/admin/users/${entry.target_id}`} className="truncate text-[14px] font-medium text-cobalt hover:text-ink md:max-w-[260px]">{entry.target_email}</Link>
                ) : (
                  <span className="truncate text-[14px] text-muted md:max-w-[260px]">{entry.target_email}</span>
                )}
              </li>
            ))}
          </ol>
        )}
      </section>
    </>
  );
}
