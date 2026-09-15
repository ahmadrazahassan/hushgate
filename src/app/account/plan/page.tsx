import { InviteLink } from "@/components/app/InviteLink";
import { Badge, Card, PanelTitle, Row } from "@/components/app/ui";
import { Icon } from "@/components/ui/Icon";
import { accessLabels, accessState, formatDay, planLabels, REFERRAL_DAYS, REFERRAL_LIMIT, type Referrals } from "@/lib/account";
import { requireViewer } from "@/lib/auth";
import { gateway, gatewayConfigured } from "@/lib/gateway";
import { currencies, formatPrice, plans, savings, TRIAL_DAYS } from "@/lib/pricing";
import { site } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Plan" };

function requestTime() {
  return Date.now();
}

const usd = currencies[0];

async function dedicatedIp(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("dedicated_ips").select("location_id, assigned_at").eq("user_id", userId).maybeSingle<{ location_id: string; assigned_at: string }>();
  if (!data) return null;
  let label = data.location_id;
  let exitIp: string | null = null;
  if (gatewayConfigured()) {
    try {
      const location = (await gateway.overview()).locations.find((item) => item.id === data.location_id);
      if (location) {
        label = `${location.displayName}, ${location.countryName}`;
        exitIp = location.exitIp;
      }
    } catch {
      // The reservation still shows by its id.
    }
  }
  return { label, exitIp, assignedAt: data.assigned_at };
}

export default async function PlanPage() {
  const { profile } = await requireViewer("/account/plan");
  const access = accessState(profile, requestTime());
  const supabase = await createClient();
  const [{ data: referralData }, dedicated] = await Promise.all([supabase.rpc("my_referrals"), dedicatedIp(profile.id)]);
  const referrals = referralData as Referrals | null;
  const inviteUrl = referrals?.code ? `${site.url}/signup?ref=${referrals.code}` : null;
  const rewarded = referrals?.rewarded ?? 0;

  return (
    <>
      <PanelTitle
        eyebrow={<><Icon name="card" className="size-4" />Plan</>}
        title="Less than"
        serif="a coffee."
        description={`Every plan includes every location, the kill switch, leak protection and clean, static IPs. New accounts start with ${TRIAL_DAYS} days free.`}
      />

      <Card title="Your access" icon="calendar" tone="white">
        <dl>
          <Row label="Status"><Badge tone={access.allowed ? "mint" : "amber"} dot>{accessLabels[access.reason]}</Badge></Row>
          <Row label="Plan">{planLabels[profile.plan]}</Row>
          <Row label="Free trial ends">{formatDay(profile.trial_ends_at)}</Row>
          <Row label="Paid access ends">{profile.access_ends_at ? formatDay(profile.access_ends_at) : "No paid plan yet"}</Row>
        </dl>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => {
          const saving = savings(plan);
          const best = plan.id === "12m";
          return (
            <article key={plan.id} className={`relative flex flex-col rounded-[28px] p-6 ${best ? "bg-[#0b0d12] text-white" : "bg-mist"}`}>
              <div className="flex items-center justify-between">
                <p className="text-[15px] font-semibold">{plan.label}</p>
                {saving && <Badge tone={best ? "cobalt" : "gray"}>Save {saving.percent}%</Badge>}
              </div>
              <p className="mt-6 font-display text-[44px] leading-none font-bold tracking-[-0.05em]">{formatPrice(plan.usd, usd)}</p>
              <p className={`mt-2 text-[13px] ${best ? "text-white/60" : "text-slate"}`}>
                {plan.months === 1 ? "per month" : `about ${formatPrice(plan.usd / plan.months, usd)} a month`}
              </p>
              <p className={`mt-1 text-[13px] ${best ? "text-white/60" : "text-slate"}`}>{plan.billed}</p>
              <button
                type="button"
                disabled
                className={`mt-8 h-11 cursor-not-allowed rounded-[13px] text-[14px] font-semibold ${best ? "bg-white/10 text-white/70" : "bg-white text-slate ring-1 ring-line ring-inset"}`}
              >
                Checkout opens soon
              </button>
            </article>
          );
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title={`Give ${REFERRAL_DAYS} days, get ${REFERRAL_DAYS} days`} icon="gift" tone="white">
          <p className="text-[14px] leading-relaxed text-slate">
            Share your link. When a friend creates an account with it and confirms their email, you both get {REFERRAL_DAYS} extra days, added to your trial or paid plan.
          </p>
          {inviteUrl ? (
            <div className="mt-4 space-y-3">
              <InviteLink url={inviteUrl} />
              <div className="flex items-center justify-between gap-3 text-[13px] text-muted">
                <span>{rewarded >= REFERRAL_LIMIT ? "You have earned every invite reward." : `${rewarded} of ${REFERRAL_LIMIT} rewards earned`}{referrals && referrals.pending > 0 ? ` · ${referrals.pending} waiting to confirm` : ""}</span>
                <span className="flex gap-1" aria-hidden="true">
                  {Array.from({ length: REFERRAL_LIMIT }, (_, index) => <i key={index} className={`size-2 rounded-full ${index < rewarded ? "bg-cobalt" : "bg-fog"}`} />)}
                </span>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-[13px] text-muted">Your invite link is being prepared. Refresh in a moment.</p>
          )}
        </Card>

        <section id="dedicated-ip" className="scroll-mt-24">
          <Card title="Dedicated IP" icon="pin" tone={dedicated ? "white" : "ink"}>
            {dedicated ? (
              <div className="space-y-2">
                <p className="text-[18px] font-semibold tracking-[-0.01em]">{dedicated.label}</p>
                {dedicated.exitIp && <p className="font-mono text-[14px] text-slate">{dedicated.exitIp}</p>}
                <p className="text-[14px] leading-relaxed text-slate">Reserved for you since {formatDay(dedicated.assignedAt)}. Nobody else can use this address. Pick it under Saved in the Hushgate extension.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-[14px] leading-relaxed text-white/75">
                  Your own static IP address that nobody else uses. Fewer captchas, and logins, banking and work tools see the same trusted address every time.
                </p>
                <ul className="space-y-2 text-[14px] text-white/85">
                  {["Reserved for your account only", "Clean and checked against spam blocklists", "Works alongside every shared location"].map((item) => (
                    <li key={item} className="flex items-center gap-2"><Icon name="check" className="size-4 text-cobalt" />{item}</li>
                  ))}
                </ul>
                <a
                  href={`mailto:support@hushgate.uk?subject=${encodeURIComponent("Dedicated IP")}`}
                  className="inline-flex h-11 items-center gap-2 rounded-[13px] bg-white px-4 text-[14px] font-semibold text-[#0b0d12] transition-transform hover:-translate-y-px"
                >
                  Request a dedicated IP
                  <Icon name="arrowRight" className="size-4" />
                </a>
              </div>
            )}
          </Card>
        </section>
      </div>

      <p className="rounded-[20px] bg-cobalt-soft px-5 py-4 text-[14px] leading-relaxed text-cobalt-deep">
        Online payments are not open yet. Your free trial keeps working, and we will email you before it ends with a simple way to continue. Questions? Write to support@hushgate.uk.
      </p>
    </>
  );
}
