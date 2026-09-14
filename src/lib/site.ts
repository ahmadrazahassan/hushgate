/** Public facts about Hushgate used across the site. */
export const site = {
  name: "Hushgate",
  domain: "hushgate.uk",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://hushgate.uk",
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
