import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "The rules for using Hushgate.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of service"
      updated="15 September 2026"
      intro={<p>These terms apply when you use the Hushgate extension, website and servers. By creating an account you agree to them.</p>}
      sections={[
        {
          title: "The service",
          body: <p>Hushgate routes traffic from Google Chrome through servers we operate, so that websites see the server&apos;s IP address instead of yours. It protects Chrome only; other browsers and apps on your device are not covered.</p>,
        },
        {
          title: "Your account",
          body: <p>You need an account to connect. Keep your password to yourself and tell us if you think someone else has used your account. You are responsible for activity on your account.</p>,
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
              <p>To protect other users and our servers, we may limit, suspend or close accounts that break these rules.</p>
            </>
          ),
        },
        {
          title: "Availability",
          body: <p>We work to keep Hushgate fast and online, but we cannot promise it will always be available, error-free, or able to reach every website. Servers and locations may be added, changed or removed.</p>,
        },
        {
          title: "Liability",
          body: <p>Hushgate is provided as is. To the extent the law allows, we are not liable for indirect or consequential losses arising from your use of the service. Nothing in these terms limits rights you have under consumer law that cannot be excluded.</p>,
        },
        {
          title: "Ending your account",
          body: <p>You can stop using Hushgate and ask us to delete your account at any time. We may close accounts that breach these terms, and will tell you why unless the law prevents it.</p>,
        },
        {
          title: "Changes and contact",
          body: <p>We may update these terms and will change the date above when we do. For questions, email <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>.</p>,
        },
      ]}
    />
  );
}
