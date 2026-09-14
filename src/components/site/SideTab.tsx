import Link from "next/link";
import { ChromeLogo } from "@/components/ui/BrandLogos";

/** A slim black tab fixed to the right edge of the window. */
export function SideTab({ installHref }: { installHref: string }) {
  return (
    <Link
      href={installHref}
      aria-label="Add Hushgate to Chrome"
      className="group fixed top-1/2 right-0 z-40 hidden w-[46px] -translate-y-1/2 flex-col items-center gap-4 rounded-l-[12px] bg-[#0b0d12] pt-4 pb-5 text-white shadow-[0_18px_40px_-20px_rgba(8,10,20,0.6)] transition-[width,padding] duration-300 hover:w-[52px] md:flex"
    >
      <ChromeLogo className="size-[22px] transition-transform duration-500 group-hover:rotate-[120deg]" />
      <span className="text-[13px] font-semibold tracking-[0.01em] [writing-mode:vertical-rl] rotate-180">Add to Chrome</span>
    </Link>
  );
}
