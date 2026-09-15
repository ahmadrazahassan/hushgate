import Link from "next/link";
import type { ReactNode } from "react";
import { PageIntro } from "@/components/site/PageIntro";
import { Icon, type IconName } from "@/components/ui/Icon";
import { legalPages, site } from "@/lib/site";

export interface LegalSection {
  title: string;
  body: ReactNode;
}

/**
 * Long-form policy and reference page: the shared page intro, a strip of every
 * legal page, numbered sections with a sticky contents list, and a contact close.
 */
export function LegalPage({
  path,
  icon,
  title,
  serif,
  intro,
  updated,
  sections,
}: {
  path: (typeof legalPages)[number]["href"];
  icon: IconName;
  title: string;
  serif?: string;
  intro: ReactNode;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <article className="container-page pt-32 pb-20 md:pt-44">
      <PageIntro eyebrow={<><Icon name={icon} className="size-5" />Legal</>} line={title} serif={serif} lead={intro}>
        <p className="mt-6 inline-flex items-center gap-2 text-[14px] text-muted">
          <Icon name="calendar" className="size-4" />
          Last updated {updated}
        </p>
      </PageIntro>

      <nav aria-label="Legal pages" className="-mx-5 mt-12 overflow-x-auto border-y border-line px-5 md:mx-0 md:px-0">
        <ul className="flex min-w-max gap-7">
          {legalPages.map((page) => {
            const current = page.href === path;
            return (
              <li key={page.href}>
                <Link
                  href={page.href}
                  aria-current={current ? "page" : undefined}
                  className={`relative block py-4 text-[14px] font-medium whitespace-nowrap transition-colors ${
                    current ? "text-ink after:absolute after:inset-x-0 after:-bottom-px after:h-[2px] after:bg-cobalt" : "text-slate hover:text-ink"
                  }`}
                >
                  {page.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-[240px_1fr] lg:gap-20">
        <nav className="hidden lg:block" aria-label="On this page">
          <div className="sticky top-28">
            <p className="text-[13px] font-semibold tracking-[0.08em] text-muted uppercase">On this page</p>
            <ol className="mt-5 space-y-3 border-l border-line text-[14px]">
              {sections.map((section, index) => (
                <li key={section.title}>
                  <a href={`#s${index + 1}`} className="-ml-px flex gap-3 border-l border-transparent pl-4 leading-snug text-slate transition-colors hover:border-ink hover:text-ink">
                    <span className="font-display text-[12px] font-semibold text-faint tabular-nums">{String(index + 1).padStart(2, "0")}</span>
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <div className="max-w-[760px]">
          {sections.map((section, index) => (
            <section key={section.title} id={`s${index + 1}`} className="scroll-mt-28 border-t border-line py-10 first:border-t-0 first:pt-0">
              <p className="font-display text-[14px] font-semibold text-cobalt tabular-nums">{String(index + 1).padStart(2, "0")}</p>
              <h2 className="mt-2 text-[26px] leading-tight font-bold tracking-[-0.03em] md:text-[30px]">{section.title}</h2>
              <div className="mt-5 space-y-4 text-[16px] leading-[1.75] text-slate [&_a]:font-medium [&_a]:text-ink [&_a]:underline [&_a]:decoration-line [&_a]:underline-offset-4 [&_a:hover]:decoration-ink [&_h3]:pt-2 [&_h3]:text-[17px] [&_h3]:font-semibold [&_h3]:text-ink [&_li]:pl-1 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5 [&_strong]:font-semibold [&_strong]:text-ink [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_li::marker]:text-faint">
                {section.body}
              </div>
            </section>
          ))}

          <aside className="mt-6 grid gap-6 rounded-[var(--radius-card)] bg-mist p-8 md:grid-cols-[1fr_auto] md:items-center md:p-10">
            <div>
              <p className="font-display text-[24px] leading-tight font-bold tracking-[-0.03em]">Questions about this page?</p>
              <p className="mt-2 text-[15px] leading-relaxed text-slate">
                Write to <a className="font-medium text-ink underline decoration-line underline-offset-4 hover:decoration-ink" href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>. A real person reads every message.
              </p>
            </div>
            <Link href="/contact" className="cta cta-black h-11 px-5 text-[15px]">
              Contact support
              <Icon name="arrowRight" className="size-[18px]" />
            </Link>
          </aside>
        </div>
      </div>
    </article>
  );
}
