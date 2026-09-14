import { AppleLogo, GooglePlayLogo } from "@/components/ui/BrandLogos";

const stores = [
  { name: "App Store", caption: "iPhone and iPad", logo: (tone: "light" | "dark") => <AppleLogo className={`size-6 ${tone === "dark" ? "text-white" : "text-ink"}`} /> },
  { name: "Google Play", caption: "Android phones", logo: () => <GooglePlayLogo className="size-6" /> },
];

/** Mobile store placeholders, clearly marked as not yet available. */
export function StoreBadges({ tone = "light", className = "" }: { tone?: "light" | "dark"; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-3 ${className}`}>
      {stores.map((store) => (
        <li
          key={store.name}
          aria-label={`${store.name}: coming soon`}
          className={`inline-flex items-center gap-3 rounded-2xl py-2.5 pr-3 pl-3.5 ring-1 ring-inset ${
            tone === "dark" ? "text-white ring-white/15" : "bg-white text-ink ring-line"
          }`}
        >
          {store.logo(tone)}
          <span className="leading-tight">
            <span className={`block text-[11px] font-medium ${tone === "dark" ? "text-white/55" : "text-slate"}`}>{store.caption}</span>
            <span className="block text-[15px] font-semibold tracking-[-0.01em]">{store.name}</span>
          </span>
          <span className={`ml-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${tone === "dark" ? "bg-white text-ink" : "bg-ink text-white"}`}>Coming soon</span>
        </li>
      ))}
    </ul>
  );
}
