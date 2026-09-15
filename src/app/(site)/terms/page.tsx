import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/site/LegalPage";
import { TRIAL_DAYS } from "@/lib/pricing";
import { LEGAL_UPDATED, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "The agreement between you and Hushgate: your account, plans and billing, acceptable use, availability and liability.",
};

const mail = <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>;

export default function TermsPage() {
  return (
    <LegalPage
      path="/terms"
      icon="scale"
      title="Terms of service"
      serif="Plainly put."
      updated={LEGAL_UPDATED}
      intro={<p>These terms apply when you use the Hushgate extension, website and servers. By creating an account or using Hushgate, you agree to them. Please read them alongside our <Link href="/privacy">privacy policy</Link>.</p>}
      sections={[
        {
          title: "The service",
          body: <p>Hushgate routes traffic from Google Chrome through servers we operate, so that websites see the server&apos;s IP address instead of yours. It protects Chrome only; other browsers and apps on your device keep using your normal connection. Hushgate is a privacy tool, not a guarantee of anonymity, and it does not make unlawful activity lawful.</p>,
        },
        {
          title: "Who may use it",
          body: <p>You must be at least 13 years old, and old enough to enter a contract where you live, to use Hushgate. If you use it for an organisation, you confirm you may accept these terms on its behalf.</p>,
        },
        {
          title: "Your account",
          body: <p>You need an account to connect. Give us an email address you control, keep your password to yourself, and tell us promptly if you think someone else has used your account. You are responsible for activity that happens under it. One account is for one person; see acceptable use below for sharing and reselling.</p>,
        },
        {
          title: "Free trial",
          body: <p>New accounts get a {TRIAL_DAYS}-day free trial with every location and feature unlocked. You will not be charged during the trial, and if you cancel before it ends you pay nothing. One trial per person. We may end trials for accounts that abuse the offer, for example by creating accounts repeatedly.</p>,
        },
        {
          title: "Plans, billing and renewal",
          body: (
            <>
              <p>Plans are sold for a fixed period, currently one, three, six or twelve months, at the prices shown on our <Link href="/#pricing">pricing section</Link>. Plans are billed in US dollars; if you pay in another currency, the final amount depends on your bank&apos;s exchange rate and any fees it adds.</p>
              <p>Unless you cancel, a plan renews at the end of its period at the then-current price for that plan, and we will tell you by email before a price change affects you. You can cancel at any time and keep access until the end of the period you have already paid for. Refunds are covered by our <Link href="/refunds">refunds and cancellation policy</Link>.</p>
            </>
          ),
        },
        {
          title: "Acceptable use",
          body: (
            <>
              <p>Do not use Hushgate to:</p>
              <ul>
                <li>break the law or help anyone else break it;</li>
                <li>send spam, attack, scan or overload other networks or services;</li>
                <li>distribute malware or material that exploits or harms others;</li>
                <li>resell or share access to the service without our permission.</li>
              </ul>
              <p>Our <Link href="/acceptable-use">acceptable use policy</Link> sets this out in full. To protect other users and our servers, we may limit, suspend or close accounts that break these rules.</p>
            </>
          ),
        },
        {
          title: "Availability and changes",
          body: <p>We work to keep Hushgate fast and online, but we cannot promise it will always be available, error-free, or able to reach every website; some services block VPN addresses. Servers and locations may be added, changed or removed, and we may change features as the product develops. If we make a change that materially reduces what you have paid for, you may cancel and ask for a fair refund of the unused period.</p>,
        },
        {
          title: "Your content and our rights",
          body: <p>You keep all rights to your own data and traffic. We keep all rights to the Hushgate software, brand and website. These terms give you a personal, non-exclusive, non-transferable licence to use the extension while your account is in good standing. Do not copy, decompile or modify the software except where the law expressly allows it. Open-source components are covered by their own licences, listed on our <Link href="/licenses">licences page</Link>.</p>,
        },
        {
          title: "Liability",
          body: <p>Hushgate is provided as is. To the extent the law allows, we are not liable for indirect or consequential losses, lost profits or lost data arising from your use of the service, and our total liability in any 12-month period is limited to the amount you paid us in that period. Nothing in these terms limits liability for death or personal injury caused by negligence, for fraud, or any other right you have under consumer law that cannot be excluded.</p>,
        },
        {
          title: "Ending your account",
          body: <p>You can stop using Hushgate and ask us to delete your account at any time. We may suspend or close accounts that breach these terms, and will tell you why unless the law prevents it. If we close your account without cause, we will refund the unused part of your plan. When an account ends, sessions stop working immediately and we delete your data as described in the privacy policy.</p>,
        },
        {
          title: "Governing law",
          body: <p>These terms are governed by the laws of England and Wales, and disputes may be brought in the courts of England and Wales. If you are a consumer living elsewhere, you keep the protection of any mandatory rules of your own country.</p>,
        },
        {
          title: "Changes and contact",
          body: <p>We may update these terms and will change the date above when we do. For material changes we will tell you by email before they take effect; continuing to use Hushgate afterwards means you accept the new terms. Questions: {mail}, or use the <Link href="/contact">contact page</Link>.</p>,
        },
      ]}
    />
  );
}
