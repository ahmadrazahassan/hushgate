import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hushgate was removed",
  robots: { index: false },
};

export default function UninstalledPage() {
  return (
    <section className="container-page flex min-h-[80vh] flex-col items-center justify-center pt-36 pb-24 text-center">
      <Icon name="gate" className="size-12 text-cobalt" />
      <h1 className="mt-8 max-w-2xl text-4xl leading-[1.08] font-bold md:text-[52px]">Hushgate has been removed from Chrome</h1>
      <p className="mt-5 max-w-xl text-lg text-slate">
        Your normal connection is back. If something did not work the way you expected, a one-line email helps us fix it for everyone.
      </p>
      <div className="mt-9 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href={`mailto:${site.supportEmail}?subject=Why%20I%20removed%20Hushgate`} variant="ink" size="lg"><Icon name="mail" className="size-5" />Tell us why</ButtonLink>
        <ButtonLink href={site.chromeStoreUrl || "/download"} variant="outline" size="lg">Reinstall</ButtonLink>
      </div>
    </section>
  );
}
