import { deleteMyAccount, signOutEverywhere } from "@/app/account/actions";
import { PasswordForm } from "@/components/app/PasswordForm";
import { SubmitButton } from "@/components/app/SubmitButton";
import { Card, dangerButton, ghostButton, inputClass, Notice, one, PanelTitle } from "@/components/app/ui";
import { Icon } from "@/components/ui/Icon";
import { requireViewer } from "@/lib/auth";

export const metadata = { title: "Security" };

export default async function SecurityPage({ searchParams }: PageProps<"/account/security">) {
  const { email } = await requireViewer("/account/security");
  const params = await searchParams;

  return (
    <>
      <PanelTitle eyebrow={<><Icon name="lock" className="size-4" />Security</>} title="Keep it" serif="quiet." description="Your password, your devices and your data. Changes here apply to the extension too." />
      <Notice tone={one(params.tone)} text={one(params.notice)} />

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Password" icon="key">
          <PasswordForm />
        </Card>

        <div className="flex flex-col gap-5">
          <Card title="Signed-in devices" icon="users">
            <p className="text-[15px] leading-relaxed text-slate">
              Lost a laptop, or signed in on a shared computer? Sign out everywhere except this browser. Hushgate in Chrome on those computers will ask for your password again.
            </p>
            <form action={signOutEverywhere} className="mt-6">
              <SubmitButton pendingText="Signing out…" className={ghostButton}>
                <Icon name="logout" className="size-4" />
                Sign out other devices
              </SubmitButton>
            </form>
          </Card>

          <Card title="Delete account" icon="trash" tone="white">
            <p className="text-[15px] leading-relaxed text-slate">
              This permanently deletes your account and signs you out everywhere. It cannot be undone. Type <strong className="font-semibold text-ink [overflow-wrap:anywhere]">{email}</strong> to confirm.
            </p>
            <form action={deleteMyAccount} className="mt-5 flex flex-col gap-3 sm:flex-row">
              <input name="confirm" autoComplete="off" required aria-label="Type your email to confirm" placeholder={email} className={`${inputClass} flex-1`} />
              <SubmitButton pendingText="Deleting…" className={dangerButton}>Delete account</SubmitButton>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}
