import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/site/LegalPage";
import { LEGAL_UPDATED, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Acceptable use policy",
  description: "What Hushgate may and may not be used for, and what happens if someone crosses the line.",
};

const mail = <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>;

export default function AcceptableUsePage() {
  return (
    <LegalPage
      path="/acceptable-use"
      icon="shieldless"
      title="Acceptable use"
      serif="Privacy, not impunity."
      updated={LEGAL_UPDATED}
      intro={<p>Hushgate is shared infrastructure. A handful of people abusing it would get our addresses blocklisted and make the service worse for everyone, so this policy sets out what is not allowed. It forms part of our <Link href="/terms">terms of service</Link>.</p>}
      sections={[
        {
          title: "Use it for anything lawful",
          body: <p>Browsing privately, keeping your traffic safe on public Wi-Fi, comparing prices, working remotely and appearing from your home country while travelling are all exactly what Hushgate is for. The rules below are about harm to other people and to the network, not about what you read.</p>,
        },
        {
          title: "Never allowed",
          body: (
            <ul>
              <li><strong>Breaking the law</strong>, or helping anyone else break it, in your country or the country your server is in.</li>
              <li><strong>Attacking networks</strong>: port scanning, denial-of-service, brute-force or credential-stuffing attempts, or probing systems you do not own.</li>
              <li><strong>Spam and bulk abuse</strong>: unsolicited email, messaging or comment spam, mass account creation, or scraping designed to overload a service.</li>
              <li><strong>Malware and fraud</strong>: distributing malicious software, phishing pages, carding, or trading stolen credentials or data.</li>
              <li><strong>Child sexual abuse material</strong>, and material that incites violence or terrorism. We report this to the authorities.</li>
              <li><strong>Harassment</strong>: stalking, doxxing or threatening people.</li>
              <li><strong>Reselling or sharing</strong> access to Hushgate, or using one account to serve many people, without our written permission.</li>
              <li><strong>Circumventing limits</strong>, for example abusing free trials by creating accounts repeatedly.</li>
            </ul>
          ),
        },
        {
          title: "Fair use of the network",
          body: <p>There is no data cap on any plan. We do ask that a single account does not run sustained traffic at a level that degrades the server for other members, such as commercial-scale automated traffic. If that happens we will contact you first and look for a sensible answer before taking any action.</p>,
        },
        {
          title: "How we enforce it",
          body: (
            <>
              <p>Because we do not log the sites you visit, we cannot monitor your browsing and we do not try. We act on abuse reports from the networks we connect to, and on operational signals such as a server address being added to a spam blocklist.</p>
              <p>Depending on what we find, we may contact you, rate-limit a connection, block a specific protocol on a server, suspend the account or close it. For serious harm, such as attacks or illegal material, we act immediately and without notice, and cooperate with law enforcement where the law requires.</p>
            </>
          ),
        },
        {
          title: "If your account is suspended",
          body: <p>We tell you why unless the law prevents it. If you think we got it wrong, reply to us and a person will review it. Accounts closed for breaking this policy are not refunded; see the <Link href="/refunds">refunds policy</Link>.</p>,
        },
        {
          title: "Reporting abuse",
          body: <p>If traffic from a Hushgate address is causing you a problem, email {mail} with the IP address, timestamps in UTC and a short description. We investigate every report and reply.</p>,
        },
      ]}
    />
  );
}
