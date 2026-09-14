import Image from "next/image";
import Link from "next/link";
import { AppTile } from "@/components/site/SiteHeader";
import { Icon } from "@/components/ui/Icon";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-dvh bg-paper lg:grid-cols-[1.05fr_1fr]">
      {/* Brand side: the same sky and hills as the home page, with the extension in view. */}
      <aside className="relative m-3 hidden overflow-hidden rounded-[36px] text-white lg:block" aria-hidden="true">
        <div className="hero-sky absolute inset-0" />
        <Image src="/hero/hills.png" alt="" width={1672} height={941} unoptimized priority className="hero-hills absolute bottom-0 left-1/2 h-[62%] w-full max-w-none -translate-x-1/2 object-cover object-[center_80%]" />
        <div className="relative flex h-full flex-col p-12 xl:p-14">
          <p className="animate-rise font-display text-[64px] leading-[0.94] font-bold tracking-[-0.055em] xl:text-[84px]">
            Browse quietly.
            <br />
            <span className="font-serif font-normal tracking-[-0.035em] italic">Be nowhere.</span>
          </p>
          <ul className="animate-rise mt-8 flex flex-wrap gap-2 [animation-delay:120ms]">
            {["14 days free", "Clean, static IPs", "No browsing logs"].map((item) => (
              <li key={item} className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-[13px] font-semibold ring-1 ring-white/40 backdrop-blur-md ring-inset">
                <Icon name="check" className="size-3.5" />
                {item}
              </li>
            ))}
          </ul>
          <Image
            src="/extension/home-connected.png"
            alt=""
            width={960}
            height={1200}
            unoptimized
            priority
            className="animate-rise absolute right-12 bottom-0 w-[44%] max-w-[330px] rounded-t-[26px] shadow-[0_40px_80px_-30px_rgba(10,20,70,0.6)] [animation-delay:200ms]"
          />
        </div>
      </aside>

      <div className="flex min-h-dvh flex-col px-5 py-6 md:px-12">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Hushgate home">
            <AppTile size={36} />
            <span className="font-display text-[19px] font-bold tracking-[-0.03em]">Hushgate</span>
          </Link>
          <Link href="/" className="inline-flex items-center gap-1.5 text-[14px] font-medium text-slate hover:text-ink">
            <Icon name="arrowRight" className="size-4 rotate-180" />
            Back to site
          </Link>
        </header>
        <main className="flex flex-1 items-center justify-center py-12">
          <div className="animate-rise w-full max-w-[400px]">{children}</div>
        </main>
        <footer className="flex justify-center gap-5 text-[13px] text-muted">
          <Link href="/privacy" className="hover:text-ink">Privacy</Link>
          <Link href="/terms" className="hover:text-ink">Terms</Link>
          <a href="mailto:support@hushgate.uk" className="hover:text-ink">Support</a>
        </footer>
      </div>
    </div>
  );
}
