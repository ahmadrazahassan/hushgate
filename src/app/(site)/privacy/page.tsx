import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "What Hushgate collects, what it never collects, and how long anything is kept.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      updated="15 September 2026"
      intro={<p>Hushgate exists to keep your browsing private, so we collect as little as we can to run the service. This page explains exactly what that is.</p>}
      sections={[
        {
          title: "The short version",
          body: (
            <ul>
              <li><strong>We never log the websites you visit</strong>, the addresses you connect to or the content of your traffic.</li>
              <li>We keep your <strong>account email</strong> so you can sign in and reset your password.</li>
              <li>While you are connected we keep <strong>which server you use and when the session expires</strong>, then delete it.</li>
              <li>We do not sell, rent or share your data for advertising.</li>
            </ul>
          ),
        },
        {
          title: "Account data",
          body: (
            <>
              <p>When you create an account we store your email address, a securely hashed password and the date the account was created. Accounts are managed by our authentication provider, Supabase, which processes this data on our behalf.</p>
              <p>We use your email only to let you sign in, to send account emails you ask for (such as confirmation and password reset) and to contact you about important changes to the service.</p>
            </>
          ),
        },
        {
          title: "Connection data",
          body: (
            <>
              <p>To connect you, our control plane creates a short-lived session. For each active session it stores your account ID and email, the server and exit IP you chose, when the session started and when it expires. Sessions last about 15 minutes at a time and are renewed while you stay connected. Expired sessions are deleted automatically.</p>
              <p>To keep you signed in, we store a rotating sign-in token for up to 30 days. Signing out deletes it.</p>
              <p>Our servers do not record destination hosts, URLs, DNS lookups or traffic content. Server software logs contain only operational events, such as a server becoming unavailable, without user or destination details.</p>
            </>
          ),
        },
        {
          title: "Data in the extension",
          body: (
            <>
              <p>The Hushgate extension stores your settings (for example kill switch, split tunnelling rules and your chosen server) in Chrome&apos;s local storage on your device. Your current sign-in is kept in session storage and cleared when Chrome closes, unless you turn on &quot;Stay signed in&quot;, in which case an encrypted, rotating sign-in token is kept on the device. Your password is never stored by the extension.</p>
              <p>If &quot;IP address lookup&quot; is on, the extension asks Cloudflare&apos;s public trace endpoint for your current IP and country so it can show you your real and VPN addresses. You can turn this off in Settings.</p>
            </>
          ),
        },
        {
          title: "This website",
          body: <p>hushgate.uk does not use advertising or third-party tracking cookies. If you sign in to the website, a strictly necessary session cookie keeps you signed in.</p>,
        },
        {
          title: "How long we keep data",
          body: (
            <ul>
              <li>Active sessions: until they expire, usually within 15 minutes of disconnecting.</li>
              <li>Sign-in tokens: up to 30 days, or until you sign out.</li>
              <li>Account email: until you delete your account.</li>
            </ul>
          ),
        },
        {
          title: "Your choices and rights",
          body: (
            <p>You can ask for a copy of your data, ask us to correct it, or delete your account at any time by emailing <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a> from the address on your account. Deleting your account removes your email and ends all sessions.</p>
          ),
        },
        {
          title: "Changes and contact",
          body: <p>If we change this policy we will update the date at the top of this page, and tell you by email for significant changes. Questions: <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>.</p>,
        },
      ]}
    />
  );
}
