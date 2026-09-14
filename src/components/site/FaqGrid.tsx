export interface FaqItem {
  question: string;
  answer: string;
}

function Question({ item }: { item: FaqItem }) {
  return (
    <details className="group rounded-[18px] bg-mist transition-colors open:bg-fog/70">
      <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-[18px] text-left [&::-webkit-details-marker]:hidden">
        <svg viewBox="0 0 20 20" className="size-5 shrink-0 text-ink transition-transform duration-300 group-open:rotate-45" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
          <path d="M10 3.5v13M3.5 10h13" strokeLinecap="round" />
        </svg>
        <span className="text-[15px] font-medium tracking-[-0.01em] text-ink">{item.question}</span>
      </summary>
      <p className="px-5 pb-5 pl-14 text-[15px] leading-relaxed text-slate">{item.answer}</p>
    </details>
  );
}

/** Two independent columns so opening a question never shifts the other column. */
export function FaqGrid({ items }: { items: FaqItem[] }) {
  const left = items.filter((_, index) => index % 2 === 0);
  const right = items.filter((_, index) => index % 2 === 1);
  return (
    <div className="grid gap-3 md:grid-cols-2 md:gap-4">
      {[left, right].map((column, index) => (
        <div key={index} className="flex flex-col gap-3 md:gap-4">
          {column.map((item) => <Question key={item.question} item={item} />)}
        </div>
      ))}
    </div>
  );
}
