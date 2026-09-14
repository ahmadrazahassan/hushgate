import { Badge, Card, PanelTitle, Row } from "@/components/app/ui";
import { Icon } from "@/components/ui/Icon";
import { accessLabels, accessState, formatDay, planLabels } from "@/lib/account";
import { requireViewer } from "@/lib/auth";
import { currencies, formatPrice, plans, savings, TRIAL_DAYS } from "@/lib/pricing";

export const metadata = { title: "Plan" };

function requestTime() {
  return Date.now();
}

const usd = currencies[0];

export default async function PlanPage() {
  const { profile } = await requireViewer("/account/plan");
  const access = accessState(profile, requestTime());

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

      <p className="rounded-[20px] bg-cobalt-soft px-5 py-4 text-[14px] leading-relaxed text-cobalt-deep">
        Online payments are not open yet. Your free trial keeps working, and we will email you before it ends with a simple way to continue. Questions? Write to support@hushgate.uk.
      </p>
    </>
  );
}
