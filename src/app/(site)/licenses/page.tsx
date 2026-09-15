import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";
import { LEGAL_UPDATED } from "@/lib/site";

export const metadata: Metadata = {
  title: "Open-source licences",
  description: "Open-source software and assets used in Hushgate.",
};

const credits: [string, string, string][] = [
  ["Inter and Inter Tight", "SIL Open Font License 1.1", "https://github.com/rsms/inter"],
  ["flag-icons", "MIT License", "https://github.com/lipis/flag-icons"],
  ["React", "MIT License", "https://github.com/facebook/react"],
  ["WXT", "MIT License", "https://github.com/wxt-dev/wxt"],
  ["Zod", "MIT License", "https://github.com/colinhacks/zod"],
  ["Next.js", "MIT License", "https://github.com/vercel/next.js"],
  ["Tailwind CSS", "MIT License", "https://github.com/tailwindlabs/tailwindcss"],
  ["Supabase client libraries", "MIT License", "https://github.com/supabase/supabase-js"],
  ["URLhaus and ThreatFox host files by abuse.ch (Threat Protection malware list)", "CC0 1.0", "https://abuse.ch/"],
  ["EasyList and EasyPrivacy (Threat Protection ad and tracker list, domain rules only)", "Creative Commons Attribution-ShareAlike 3.0, or GPL 3.0", "https://easylist.to/"],
];

export default function LicensesPage() {
  return (
    <LegalPage
      path="/licenses"
      icon="book"
      title="Open-source licences"
      serif="Thank you."
      updated={LEGAL_UPDATED}
      intro={<p>Hushgate is built with excellent open-source software. Thank you to everyone who maintains it.</p>}
      sections={credits.map(([name, licence, url]) => ({
        title: name,
        body: <p>{licence}. <a href={url} target="_blank" rel="noopener noreferrer">Source and licence text</a>.</p>,
      }))}
    />
  );
}
