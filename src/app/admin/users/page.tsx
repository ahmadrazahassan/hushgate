import Link from "next/link";
import { Badge, Empty, Notice, one, PanelTitle } from "@/components/app/ui";
import { Icon } from "@/components/ui/Icon";
import { formatDay, planLabels, PROFILE_COLUMNS, relativeTime, type Profile } from "@/lib/account";
import { accessBadge } from "@/lib/admin";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Users" };

const PAGE_SIZE = 25;

const filters = [
  { value: "", label: "Everyone" },
  { value: "trial", label: "On trial" },
  { value: "paid", label: "Paid" },
  { value: "expired", label: "Expired" },
  { value: "blocked", label: "Suspended" },
  { value: "admins", label: "Admins" },
] as const;

async function loadUsers(query: string, filter: string, page: number) {
  const supabase = await createClient();
  const now = new Date().toISOString();
  let request = supabase
    .from("profiles")
    .select(PROFILE_COLUMNS, { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  // Strip PostgREST pattern and grouping characters so a search is always a plain substring match.
  const safe = query.replace(/[%_\\,()*.:]/g, " ").trim();
  if (safe) request = request.or(`email.ilike.%${safe}%,full_name.ilike.%${safe}%`);
  if (filter === "trial") request = request.eq("blocked", false).eq("plan", "trial").gt("trial_ends_at", now);
  if (filter === "paid") request = request.eq("blocked", false).gt("access_ends_at", now);
  if (filter === "expired") request = request.eq("blocked", false).neq("plan", "complimentary").lte("trial_ends_at", now).or(`access_ends_at.is.null,access_ends_at.lte.${now}`);
  if (filter === "blocked") request = request.eq("blocked", true);
  if (filter === "admins") request = request.eq("role", "admin");

  const { data, count, error } = await request;
  return { users: (data as Profile[] | null) ?? [], count: count ?? 0, error: error?.message ?? "", now: Date.now() };
}

export default async function UsersPage({ searchParams }: PageProps<"/admin/users">) {
  await requireAdmin("/admin/users");
  const params = await searchParams;
  const query = one(params.q).trim().slice(0, 80);
  const filter = filters.some((item) => item.value === one(params.filter)) ? one(params.filter) : "";
  const page = Math.max(1, Number.parseInt(one(params.page) || "1", 10) || 1);
  const { users, count, error, now } = await loadUsers(query, filter, page);
  const pages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const link = (next: Record<string, string>) => `/admin/users?${new URLSearchParams({ ...(query ? { q: query } : {}), ...(filter ? { filter } : {}), ...next })}`;

  return (
    <>
      <PanelTitle eyebrow={<><Icon name="users" className="size-4" />Users</>} title="Every" serif="account." description={`${count} ${count === 1 ? "account" : "accounts"}${query ? ` matching “${query}”` : ""}. Open one to change its plan, trial, role or access.`} />
      <Notice tone={one(params.tone)} text={one(params.notice)} />
      {error && <Notice tone="error" text={error} />}

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <form className="flex h-12 w-full items-center gap-3 rounded-[16px] bg-mist px-4 ring-cobalt focus-within:bg-white focus-within:ring-2 lg:max-w-sm">
          <Icon name="search" className="size-[18px] text-muted" />
          <input name="q" defaultValue={query} placeholder="Search by email or name" className="h-full min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-faint" />
          {filter && <input type="hidden" name="filter" value={filter} />}
        </form>
        <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none]">
          {filters.map((item) => (
            <Link
              key={item.label}
              href={`/admin/users?${new URLSearchParams({ ...(query ? { q: query } : {}), ...(item.value ? { filter: item.value } : {}) })}`}
              className={`inline-flex h-10 shrink-0 items-center rounded-full px-4 text-[14px] font-semibold transition-colors ${filter === item.value ? "bg-[#0b0d12] text-white" : "text-ink/70 ring-1 ring-line ring-inset hover:text-ink"}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <section className="overflow-hidden rounded-[28px] ring-1 ring-line ring-inset">
        {users.length === 0 ? (
          <Empty icon="users">No accounts found.</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-[14px]">
              <thead>
                <tr className="border-b border-line bg-mist/60 text-[13px] text-slate">
                  {["Account", "Access", "Plan", "Joined", "Last sign-in", ""].map((head) => <th key={head} scope="col" className="px-6 py-3.5 font-medium">{head}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {users.map((user) => {
                  const badge = accessBadge(user, now);
                  return (
                    <tr key={user.id} className="group transition-colors hover:bg-mist/50">
                      <td className="px-6 py-4">
                        <Link href={`/admin/users/${user.id}`} className="block">
                          <span className="flex items-center gap-2 font-semibold text-ink group-hover:text-cobalt">
                            {user.full_name || user.email}
                            {user.role === "admin" && <Badge tone="ink">Admin</Badge>}
                          </span>
                          {user.full_name && <span className="block text-[13px] text-muted">{user.email}</span>}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <Badge tone={badge.tone} dot>{badge.label}</Badge>
                        {badge.detail && <span className="mt-1 block max-w-[22ch] truncate text-[12px] text-muted">{badge.detail}</span>}
                      </td>
                      <td className="px-6 py-4 text-slate">{planLabels[user.plan]}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate">{formatDay(user.created_at)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate">{relativeTime(user.last_sign_in_at, now)}</td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/admin/users/${user.id}`} aria-label={`Manage ${user.email}`} className="inline-grid size-9 place-items-center rounded-full text-slate ring-1 ring-line ring-inset group-hover:text-ink group-hover:ring-ink">
                          <Icon name="arrowRight" className="size-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {pages > 1 && (
        <div className="flex items-center justify-between text-[14px] text-slate">
          <span>Page {page} of {pages}</span>
          <div className="flex gap-2">
            {page > 1 && <Link href={link({ page: String(page - 1) })} className="rounded-full px-4 py-2 ring-1 ring-line ring-inset hover:text-ink">Previous</Link>}
            {page < pages && <Link href={link({ page: String(page + 1) })} className="rounded-full px-4 py-2 ring-1 ring-line ring-inset hover:text-ink">Next</Link>}
          </div>
        </div>
      )}
    </>
  );
}
