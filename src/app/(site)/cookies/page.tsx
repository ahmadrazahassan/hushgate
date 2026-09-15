import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/site/LegalPage";
import { LEGAL_UPDATED, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cookie policy",
  description: "Hushgate uses a handful of strictly necessary cookies and no tracking. Here is every one of them.",
};

export default function CookiesPage() {
  return (
    <LegalPage
      path="/cookies"
      icon="cookie"
      title="Cookie policy"
      serif="Only the necessary ones."
      updated={LEGAL_UPDATED}
      intro={<p>We do not run advertising, analytics or third-party tracking on {site.domain}. That is why you never see a cookie banner here: the only cookies we set are the ones needed to keep you signed in.</p>}
      sections={[
        {
          title: "What a cookie is",
          body: <p>A cookie is a small file a website asks your browser to keep, so it can recognise the same browser on the next request. Related technologies, such as local storage and session storage, keep data on your device in a similar way.</p>,
        },
        {
          title: "Cookies we set",
          body: (
            <>
              <h3>Authentication</h3>
              <p>When you sign in, our authentication provider, Supabase, sets a session cookie holding a signed token, plus a refresh token used to renew it. Without them you would be signed out on every page. They are cleared when you sign out.</p>
              <h3>Security</h3>
              <p>Short-lived cookies are used during sign-in, email confirmation and password reset to tie a request to the browser that started it, which protects you from cross-site request forgery.</p>
              <p>These are all strictly necessary cookies, so we do not need your consent to set them. We set no advertising, profiling or analytics cookies at all.</p>
            </>
          ),
        },
        {
          title: "Storage in the extension",
          body: <p>The Hushgate extension does not use cookies. It keeps your settings in Chrome&apos;s local storage and your current sign-in in session storage, on your device. The <Link href="/privacy">privacy policy</Link> describes exactly what is stored there.</p>,
        },
        {
          title: "Third parties",
          body: <p>Pages here load fonts and images from our own domain, so no third party can set a cookie through them. If you follow a link to another website, such as the Chrome Web Store or our payment provider, that site&apos;s own cookie policy applies.</p>,
        },
        {
          title: "Managing cookies",
          body: <p>You can delete or block cookies in your browser settings at any time. Blocking our authentication cookies means you will not be able to stay signed in to your account, though the rest of the site works normally.</p>,
        },
        {
          title: "Changes",
          body: <p>If we ever add a cookie that is not strictly necessary, we will ask for your consent first and list it here before it is used.</p>,
        },
      ]}
    />
  );
}
