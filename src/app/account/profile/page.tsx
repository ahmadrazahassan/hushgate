import { updateProfile } from "@/app/account/actions";
import { SubmitButton } from "@/components/app/SubmitButton";
import { Card, inputClass, Notice, one, PanelTitle, selectClass } from "@/components/app/ui";
import { CtaButton } from "@/components/ui/CtaButton";
import { Icon } from "@/components/ui/Icon";
import { requireViewer } from "@/lib/auth";

export const metadata = { title: "Profile" };

const locations = [
  { value: "fastest", label: "Fastest available" },
  { value: "CA", label: "Canada" },
  { value: "DE", label: "Germany" },
  { value: "US", label: "United States" },
];

export default async function ProfilePage({ searchParams }: PageProps<"/account/profile">) {
  const { profile, email } = await requireViewer("/account/profile");
  const params = await searchParams;

  return (
    <>
      <PanelTitle eyebrow={<><Icon name="sliders" className="size-4" />Profile</>} title="Make it" serif="yours." description="How we greet you and what we send you. Your email is also your sign-in for the extension." />
      <Notice tone={one(params.tone)} text={one(params.notice)} />

      <form action={updateProfile} className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Card title="About you" icon="user">
          <div className="space-y-5">
            <label className="block">
              <span className="text-[14px] font-medium">Name</span>
              <input name="fullName" defaultValue={profile.full_name ?? ""} maxLength={80} autoComplete="name" placeholder="What should we call you?" className={`mt-2 ${inputClass}`} />
            </label>
            <label className="block">
              <span className="text-[14px] font-medium">Email</span>
              <input value={email} readOnly className={`mt-2 ${inputClass} bg-fog/60 text-slate`} />
              <span className="mt-2 block text-[13px] text-muted">To change your sign-in email, write to support@hushgate.uk from this address.</span>
            </label>
            <label className="block">
              <span className="text-[14px] font-medium">Favourite location</span>
              <span className="relative mt-2 block">
                <select name="preferredLocation" defaultValue={profile.preferred_location ?? "fastest"} className={selectClass}>
                  {locations.map((location) => <option key={location.value} value={location.value}>{location.label}</option>)}
                </select>
                <Icon name="chevronDown" className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-slate" />
              </span>
            </label>
          </div>
        </Card>

        <div className="flex flex-col gap-5">
          <Card title="Emails" icon="mail">
            <label className="flex cursor-pointer items-start gap-4">
              <input type="checkbox" name="productEmails" defaultChecked={profile.product_emails} className="peer sr-only" />
              <span className="relative mt-0.5 h-7 w-12 shrink-0 rounded-full bg-fog transition-colors peer-checked:bg-cobalt peer-focus-visible:ring-2 peer-focus-visible:ring-cobalt peer-focus-visible:ring-offset-2 after:absolute after:top-1 after:left-1 after:size-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5" aria-hidden="true" />
              <span>
                <span className="block text-[15px] font-semibold">Product news</span>
                <span className="mt-0.5 block text-[14px] text-slate">New countries, features and trial reminders. Never more than twice a month.</span>
              </span>
            </label>
          </Card>
          <div className="flex items-center gap-4">
            <SubmitButton pendingText="Saving…" className="cta cta-cobalt h-[52px] px-7 text-[16px]">Save changes</SubmitButton>
            <CtaButton href="/account" tone="soft" size="lg" className="ml-1.5">Cancel</CtaButton>
          </div>
        </div>
      </form>
    </>
  );
}
