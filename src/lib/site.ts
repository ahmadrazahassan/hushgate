/** Public facts about Hushgate used across the site. */
export const site = {
  name: "Hushgate",
  domain: "hushgate.uk",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.hushgate.uk",
  description:
    "Hushgate routes Chrome through encrypted servers in more than 50 countries, with a kill switch and WebRTC leak protection built in.",
  supportEmail: "support@hushgate.uk",
  chromeStoreUrl: process.env.NEXT_PUBLIC_CHROME_STORE_URL ?? "",
};

/** Network reach shown on the marketing pages. */
export const reach = {
  countries: "50+",
  regions: 4,
};

/** How we describe IP quality. Keep it true: see docs/IP_REPUTATION.md before changing. */
export const IP_REPUTATION_DETAIL = "Checked against the major spam blocklists";

/** Every policy and reference page, in the order they appear in legal navigation. */
export const legalPages = [
  { href: "/privacy", label: "Privacy policy" },
  { href: "/terms", label: "Terms of service" },
  { href: "/refunds", label: "Refunds and cancellation" },
  { href: "/acceptable-use", label: "Acceptable use" },
  { href: "/cookies", label: "Cookie policy" },
  { href: "/permissions", label: "Extension permissions" },
  { href: "/licenses", label: "Open-source licences" },
] as const;

/** When the policies last changed. Update alongside the text. */
export const LEGAL_UPDATED = "16 September 2026";
