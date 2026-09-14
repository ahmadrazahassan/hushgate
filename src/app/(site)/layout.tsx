import { SideTab } from "@/components/site/SideTab";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { site } from "@/lib/site";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  const installHref = site.chromeStoreUrl || "/download";
  return (
    <>
      <SmoothScroll />
      <SiteHeader installHref={installHref} />
      <SideTab installHref={installHref} />
      <main>{children}</main>
      <SiteFooter installHref={installHref} />
    </>
  );
}
