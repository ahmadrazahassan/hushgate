import { AppTile } from "@/components/site/SiteHeader";

export function SetupNotice() {
  return (
    <div className="grid min-h-dvh place-items-center bg-mist px-5">
      <div className="max-w-md rounded-[28px] bg-white p-10 ring-1 ring-line ring-inset">
        <AppTile size={40} />
        <h1 className="mt-8 text-3xl font-bold tracking-[-0.04em]">Connect Supabase first</h1>
        <p className="mt-3 text-[15px] leading-relaxed [overflow-wrap:anywhere] text-slate">
          Accounts need NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local. See docs/SETUP.md.
        </p>
      </div>
    </div>
  );
}
