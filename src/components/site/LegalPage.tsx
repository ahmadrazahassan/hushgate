import type { ReactNode } from "react";

export interface LegalSection {
  title: string;
  body: ReactNode;
}

/** Plain, readable long-form page used for policies and reference pages. */
export function LegalPage({ title, intro, updated, sections }: { title: string; intro: ReactNode; updated: string; sections: LegalSection[] }) {
  return (
    <article className="container-page pt-32 pb-24 md:pt-40">
      <header className="max-w-3xl">
        <p className="text-[14px] font-medium text-slate">Last updated {updated}</p>
        <h1 className="mt-3 text-4xl leading-[1.08] font-bold md:text-[56px]">{title}</h1>
        <div className="mt-6 text-lg leading-relaxed text-slate">{intro}</div>
      </header>
      <div className="mt-14 grid gap-12 lg:grid-cols-[220px_1fr]">
        <nav className="hidden lg:block" aria-label="On this page">
          <ol className="sticky top-28 space-y-3 text-[14px]">
            {sections.map((section, index) => (
              <li key={section.title}>
                <a href={`#s${index + 1}`} className="text-slate transition-colors hover:text-ink">{section.title}</a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="max-w-3xl space-y-12">
          {sections.map((section, index) => (
            <section key={section.title} id={`s${index + 1}`} className="scroll-mt-28">
              <h2 className="text-2xl font-bold">{section.title}</h2>
              <div className="mt-4 space-y-4 text-[16px] leading-relaxed text-slate [&_a]:font-medium [&_a]:text-ink [&_a]:underline [&_a]:decoration-line [&_a]:underline-offset-4 [&_li]:pl-1 [&_strong]:font-semibold [&_strong]:text-ink [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
                {section.body}
              </div>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
