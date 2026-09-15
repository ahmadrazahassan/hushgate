import type { Metadata } from "next";
import Link from "next/link";
import { ExtensionShot } from "@/components/site/ExtensionShot";
import { FaqGrid, type FaqItem } from "@/components/site/FaqGrid";
import { FeatureGrid } from "@/components/site/FeatureGrid";
import { Hero } from "@/components/site/Hero";
import { LocationsSection } from "@/components/site/LocationsSection";
import { BlurText, Reveal, SectionTitle } from "@/components/site/Reveal";
import { CountUp, Parallax } from "@/components/site/Motion";
import { FinalCta, IpStatement, PromiseRibbon, Statement, UseCases } from "@/components/site/StorySections";
import { VpnExplainer } from "@/components/site/VpnExplainer";
import { Pricing } from "@/components/site/Pricing";
import { WhySection } from "@/components/site/WhySection";
import { Icon } from "@/components/ui/Icon";
import { TRIAL_DAYS } from "@/lib/pricing";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Hushgate — Private VPN for Chrome" },
};

const install = site.chromeStoreUrl || "/download";

const steps = [
  { number: "01", title: "Add Hushgate to Chrome", body: "Install the extension and pin it next to the address bar.", shot: "welcome" as const },
  { number: "02", title: "Create your account", body: "An email and a password. That is all we ask for.", shot: "sign-in" as const },
  { number: "03", title: "Tap the power button", body: "Pick a country or let Hushgate choose the fastest server.", shot: "home-connected" as const },
];

const faq: FaqItem[] = [
  { question: "What is a VPN?", answer: "A VPN, or virtual private network, is a secure tunnel between you and the internet. Your traffic travels encrypted to a VPN server, so websites see the server's address instead of yours, and your internet provider cannot see which sites you open." },
  { question: "How does the 14-day free trial work?", answer: `Create an account in the extension and every location and feature is unlocked for ${TRIAL_DAYS} days. You will not be charged during the trial, and if you cancel before it ends you pay nothing.` },
  { question: "How much does Hushgate cost after the trial?", answer: "$0.99 for one month, $2.50 for three months, $4 for six months or $6.99 for a full year. Longer plans cost less per month, and every plan includes every location and feature." },
  { question: "Can I see prices in PKR, INR or taka?", answer: "Yes. Use the currency menu in the pricing card to see approximate prices in Pakistani rupees, Indian rupees and Bangladeshi taka. Plans are billed in US dollars, so the final amount depends on your bank's exchange rate." },
  { question: "Can I cancel any time?", answer: "Yes. Cancel whenever you like and Hushgate keeps working until the end of the period you have already paid for. There are no cancellation fees." },
  { question: "Do you keep logs of the sites I visit?", answer: "No. Our servers never record the websites or addresses you open. To run the service we keep your account email and, while you are connected, which server you use and when the session expires." },
  { question: "What does Hushgate protect?", answer: "Everything you open in Chrome, including incognito windows once you allow the extension there, goes through an encrypted TLS 1.3 tunnel. Apps outside Chrome and other browsers keep using your normal connection." },
  { question: "Which countries can I connect to?", answer: "More than 50 countries across the Americas, Europe, Asia Pacific, the Middle East and Africa. Every plan includes all of them, and the extension shows the full list." },
  { question: "What does the kill switch actually do?", answer: "If the tunnel drops while you are connected, Hushgate stops Chrome from loading pages until the connection is back or you turn the kill switch off. Nothing is sent from your real IP in between." },
  { question: "Can I use one account on several computers?", answer: "Yes. Sign in to Hushgate in Chrome on any computer with the same email and password." },
  { question: "Is there an app for iPhone or Android?", answer: "Not yet. Apps for the App Store and Google Play are on the way. For now Hushgate works in Chrome on Windows, macOS, Linux and ChromeOS." },
  { question: "Why does the extension ask for these permissions?", answer: "Chrome needs the proxy permission to route traffic, storage to remember your settings and privacy to block WebRTC leaks. Our permissions page explains each one in plain words." },
  { question: "Are VPNs legal?", answer: "Using a VPN is legal in most countries, and millions of people and companies use one every day. A few countries restrict them, so check the rules where you are. Using Hushgate for anything illegal is never allowed." },
  { question: "Why choose Hushgate over a free VPN?", answer: "Free VPNs have to make money somehow, often by showing ads, selling data or limiting speed. Hushgate is paid for by its members, so we have no reason to track you and every location is included." },
  { question: "Can I use Hushgate while travelling?", answer: "Yes. Hushgate works anywhere Chrome can reach the internet. Pick your home country to keep your usual sites familiar while you are away." },
  { question: "Are Hushgate IP addresses clean?", answer: "Yes. We check our server addresses against the major spam and abuse blocklists and fix or replace any address that gets listed, so you browse from an IP with a good reputation." },
  { question: "Will my IP address change while I browse?", answer: "No. Each Hushgate server has its own static IP address, so it stays the same for as long as you stay connected to that server. Pick the same server again and you get the same address." },
  { question: "I forgot my password.", answer: "Use the reset link on the sign-in screen, or visit hushgate.uk/reset-password. We will email you a link to choose a new one." },
];

export default function HomePage() {
  return (
    <>
      <Hero installHref={install} />

      {/* Numbers */}
      <section className="container-page py-16 md:py-20">
        <dl className="grid grid-cols-2 gap-y-10 md:grid-cols-4">
          {[
            { value: <CountUp to={50} suffix="+" />, label: "countries to appear from" },
            { value: "Static", label: "clean IP addresses on every server" },
            { value: "TLS 1.3", label: "encryption on every connection" },
            { value: <CountUp to={0} />, label: "websites logged, ever" },
          ].map((item, index) => (
            <Reveal key={item.label} delay={index * 0.08} className="border-l border-line pl-5 md:pl-7">
              <dt className="font-display text-[40px] leading-none font-bold tracking-[-0.03em] md:text-[56px]">{item.value}</dt>
              <dd className="mt-3 max-w-[18ch] text-[15px] leading-snug text-slate">{item.label}</dd>
            </Reveal>
          ))}
        </dl>
      </section>

      <WhySection />
      <PromiseRibbon />
      <VpnExplainer />
      <FeatureGrid installHref={install} />
      <LocationsSection installHref={install} />
      <IpStatement />
      <UseCases />

      {/* How it works */}
      <section id="how-it-works" className="container-page scroll-mt-24 py-24 md:py-32">
        <SectionTitle align="center" eyebrow={<><Icon name="route" className="size-5" />How it works</>} line="Set up in a minute." serif="Then forget about it." />
        <ol className="mt-16 grid gap-12 md:mt-20 md:grid-cols-3 md:gap-6">
          {steps.map((step, index) => (
            <li key={step.number}>
              <Reveal delay={index * 0.1} className="flex flex-col">
                <span className="font-display text-[15px] font-semibold text-cobalt">{step.number}</span>
                <h3 className="mt-3 text-[26px] leading-tight font-bold tracking-[-0.035em]">{step.title}</h3>
                <p className="mt-2 min-h-[3lh] text-[16px] text-slate md:min-h-[2lh]">{step.body}</p>
                <div className="mt-6 flex h-[340px] justify-center overflow-hidden rounded-[28px] bg-mist px-6 pt-8">
                  <Parallax speed={0.1 + index * 0.05} className="w-full max-w-[280px] self-start">
                    <ExtensionShot name={step.shot} className="h-auto w-full rounded-b-none shadow-[0_0_0_1px_rgba(21,25,34,0.06)]" />
                  </Parallax>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <Statement />

      <Pricing installHref={install} />

      {/* FAQ */}
      <section id="faq" className="container-page scroll-mt-20 py-24 md:py-32">
        <div className="text-center">
          <h2 className="text-[40px] leading-[1.02] font-bold tracking-[-0.045em] md:text-[64px]">
            <BlurText text="Frequently asked questions" />
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-slate md:text-[19px]">
            Everything about Hushgate, the free trial and your privacy. Still stuck?{" "}
            <Link className="font-medium text-ink underline decoration-line underline-offset-4 hover:decoration-ink" href="/contact">Talk to support</Link>{" "}
            or email <a className="font-medium text-ink underline decoration-line underline-offset-4 hover:decoration-ink" href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>.
          </p>
        </div>
        <div className="mx-auto mt-12 max-w-[1080px] md:mt-16">
          <FaqGrid items={faq} />
        </div>
      </section>

      <FinalCta installHref={install} />
    </>
  );
}
