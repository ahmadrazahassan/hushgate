import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";

export const metadata: Metadata = {
  title: "Extension permissions",
  description: "Why the Hushgate Chrome extension asks for each permission.",
};

const permissions: [string, string][] = [
  ["proxy", "Routes Chrome's traffic through the Hushgate server you choose, and restores your normal connection when you disconnect."],
  ["webRequest and webRequestAuthProvider", "Answers the sign-in challenge from our own proxy server with your short-lived session credentials. Hushgate ignores challenges from any other server."],
  ["declarativeNetRequest", "Powers the kill switch: if the tunnel drops, it blocks Chrome from loading pages until protection is back."],
  ["privacy", "Turns on WebRTC leak protection while you are connected so web apps cannot discover your real IP address."],
  ["scripting", "Adds a small script to pages only while location matching is on, so sites that ask for your location see your server's city."],
  ["storage", "Saves your settings and your current sign-in on your device."],
  ["alarms", "Checks the connection every minute, renews your session before it expires and ends a pause on time."],
  ["notifications", "Tells you when protection drops, recovers or needs you to sign in again. You can turn these off in Settings."],
  ["Access to all sites (<all_urls>)", "Required for the proxy and kill switch to apply to every website. Hushgate does not read page content or browsing history."],
];

export default function PermissionsPage() {
  return (
    <LegalPage
      title="Extension permissions"
      updated="15 September 2026"
      intro={<p>Chrome shows a list of permissions when you install Hushgate. Here is what each one is for, in plain words.</p>}
      sections={permissions.map(([name, reason]) => ({ title: name, body: <p>{reason}</p> }))}
    />
  );
}
