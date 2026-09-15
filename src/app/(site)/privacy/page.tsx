import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/site/LegalPage";
import { LEGAL_UPDATED, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "What Hushgate collects, what it never collects, how long anything is kept and the rights you have over your data.",
};

const mail = <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>;

export default function PrivacyPage() {
  return (
    <LegalPage
      path="/privacy"
      icon="lock"
      title="Privacy policy"
      serif="Less data, by design."
      updated={LEGAL_UPDATED}
      intro={<p>Hushgate exists to keep your browsing private, so we collect as little as we can to run the service. This policy explains exactly what that is, why we need it and what you can ask us to do with it.</p>}
      sections={[
        {
          title: "The short version",
          body: (
            <ul>
              <li><strong>We never log the websites you visit</strong>, the addresses you connect to, your DNS lookups or the content of your traffic.</li>
              <li>We keep your <strong>account email</strong> so you can sign in, reset your password and manage your plan.</li>
              <li>While you are connected we keep <strong>which server you use and when the session expires</strong>, then delete it.</li>
              <li>We do not sell, rent or share your data for advertising, and we do not use third-party trackers.</li>
            </ul>
          ),
        },
        {
          title: "Who we are",
          body: (
            <p>Hushgate (&quot;we&quot;, &quot;us&quot;) operates the Hushgate Chrome extension, the website at {site.domain} and the servers behind them. We are the controller of the personal data described in this policy. You can reach us about anything privacy-related at {mail}.</p>
          ),
        },
        {
          title: "Account data",
          body: (
            <>
              <p>When you create an account we store your email address, a securely hashed password and the date the account was created. If you add a name to your profile, we store that too. Accounts are managed by our authentication provider, Supabase, which processes this data on our behalf.</p>
              <p>We use your email only to let you sign in, to send account emails you ask for (such as confirmation and password reset), to send receipts and billing notices, and to tell you about important changes to the service. We never send marketing email unless you opt in.</p>
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
          title: "Payment data",
          body: (
            <p>If you buy a plan, payment is handled by our payment provider. We never see or store your full card number. We keep a record of your plan, its price, when it started and when it renews or ends, so we can give you access and meet our tax and accounting obligations.</p>
          ),
        },
        {
          title: "Data in the extension",
          body: (
            <>
              <p>The Hushgate extension stores your settings (for example kill switch, split tunnelling rules and your chosen server) in Chrome&apos;s local storage on your device. Your current sign-in is kept in session storage and cleared when Chrome closes, unless you turn on &quot;Stay signed in&quot;, in which case an encrypted, rotating sign-in token is kept on the device. Your password is never stored by the extension.</p>
              <p>If &quot;IP address lookup&quot; is on, the extension asks Cloudflare&apos;s public trace endpoint for your current IP and country so it can show you your real and VPN addresses. You can turn this off in Settings.</p>
              <p>Threat Protection matches domains against lists packaged inside the extension. The matching happens on your device, and nothing about the pages you visit is sent to us. See <Link href="/permissions">extension permissions</Link> for what each Chrome permission is used for.</p>
            </>
          ),
        },
        {
          title: "This website",
          body: (
            <p>{site.domain} does not use advertising or third-party tracking cookies. If you sign in to the website, a strictly necessary session cookie keeps you signed in. Our <Link href="/cookies">cookie policy</Link> lists every cookie we set.</p>
          ),
        },
        {
          title: "Why we are allowed to use it",
          body: (
            <ul>
              <li><strong>To provide the service you signed up for</strong>: your account, sessions and plan (performance of a contract).</li>
              <li><strong>To keep Hushgate safe</strong>: preventing abuse of our servers and protecting other users (legitimate interests).</li>
              <li><strong>To meet the law</strong>: keeping billing records for tax and accounting (legal obligation).</li>
              <li><strong>Optional emails</strong>: only when you have said yes (consent), which you can withdraw at any time.</li>
            </ul>
          ),
        },
        {
          title: "Who we share it with",
          body: (
            <>
              <p>We share data only with service providers that help us run Hushgate, under contracts that stop them using it for anything else:</p>
              <ul>
                <li>Supabase, for accounts and the database behind our control plane;</li>
                <li>our hosting and server providers, which run the website and VPN servers;</li>
                <li>our payment provider, for purchases and receipts.</li>
              </ul>
              <p>We disclose data to authorities only when the law requires it. Because we do not keep browsing logs, we cannot hand over a record of the sites you visit, because no such record exists.</p>
            </>
          ),
        },
        {
          title: "International transfers",
          body: <p>Some of our providers process data outside the UK and the European Economic Area. When they do, we rely on adequacy decisions or standard contractual clauses so your data keeps an equivalent level of protection.</p>,
        },
        {
          title: "How long we keep data",
          body: (
            <ul>
              <li>Active sessions: until they expire, usually within 15 minutes of disconnecting.</li>
              <li>Sign-in tokens: up to 30 days, or until you sign out.</li>
              <li>Account email and profile: until you delete your account.</li>
              <li>Billing records: as long as tax law requires, usually six years.</li>
            </ul>
          ),
        },
        {
          title: "How we protect it",
          body: <p>Traffic between Chrome and our servers is encrypted with TLS 1.3. Passwords are hashed, never stored in plain text. Access to our systems is limited to the people who need it to run the service, and protected with strong authentication.</p>,
        },
        {
          title: "Children",
          body: <p>Hushgate is not intended for children under 13, and we do not knowingly collect their data. If you believe a child has created an account, contact us and we will delete it.</p>,
        },
        {
          title: "Your choices and rights",
          body: (
            <>
              <p>Depending on where you live, including under UK and EU data protection law, you have the right to:</p>
              <ul>
                <li>get a copy of the personal data we hold about you;</li>
                <li>ask us to correct it, or delete your account and its data;</li>
                <li>object to or restrict how we use it, and withdraw consent;</li>
                <li>receive your data in a portable format.</li>
              </ul>
              <p>Email {mail} from the address on your account, or use the <Link href="/contact">contact page</Link>. We answer within one month. Deleting your account removes your email and ends all sessions. If you are unhappy with our answer, you can complain to your local data protection authority; in the UK that is the Information Commissioner&apos;s Office.</p>
            </>
          ),
        },
        {
          title: "Changes to this policy",
          body: <p>If we change this policy we will update the date at the top of this page, and tell you by email before significant changes take effect.</p>,
        },
      ]}
    />
  );
}
