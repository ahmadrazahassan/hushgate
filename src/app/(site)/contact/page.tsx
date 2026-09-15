import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/site/ContactForm";
import { PageIntro } from "@/components/site/PageIntro";
import { Reveal } from "@/components/site/Reveal";
import { Icon, type IconName } from "@/components/ui/Icon";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact support",
  description: `Get help with Hushgate. Email ${site.supportEmail} and a real person replies, usually within one working day.`,
};

const routes: { icon: IconName; title: string; body: string; action: string; href: string }[] = [
  {
    icon: "unplug",
    title: "Something is not working",
    body: "Pages not loading, the tunnel dropping, or a country you cannot reach. Tell us the server you were on and we will dig in.",
    action: "Report a problem",
    href: `mailto:${site.supportEmail}?subject=${encodeURIComponent("[Something is not working] Hushgate support")}`,
  },
  {
    icon: "card",
    title: "Billing and refunds",
    body: "Change or cancel a plan, ask about a charge, or claim the 14-day money-back guarantee.",
    action: "Read the refunds policy",
    href: "/refunds",
  },
  {
    icon: "key",
    title: "Account and sign-in",
    body: "Locked out, or need to change the email on your account? Start with a password reset, then write to us if it still will not budge.",
    action: "Reset your password",
    href: "/reset-password",
  },
  {
    icon: "lock",
    title: "Privacy and data requests",
    body: "Ask for a copy of your data, have it corrected, or delete your account and everything attached to it.",
    action: "Read the privacy policy",
    href: "/privacy",
  },
];

const facts: { icon: IconName; title: string; body: string }[] = [
  { icon: "clock", title: "Usually within one working day", body: "Every email is answered by a person who works on Hushgate, not a script." },
  { icon: "globe", title: "English, any time zone", body: "Write whenever suits you. We read messages on UK working days." },
  { icon: "noLog", title: "We cannot see your browsing", body: "There are no logs of the sites you visit, so please include the details we need to help." },
];

const quick = [
  { question: "I forgot my password", answer: "Use the reset link on the sign-in screen and we will email you a link to choose a new one.", href: "/reset-password", cta: "Reset password" },
  { question: "How do I cancel?", answer: "Open your plan, choose cancel, and keep access until the period you paid for ends.", href: "/account/plan", cta: "Manage plan" },
  { question: "Why does Chrome ask for these permissions?", answer: "Each permission maps to one feature: the proxy, the kill switch, leak protection and your settings.", href: "/permissions", cta: "See permissions" },
  { question: "A site is blocking my VPN address", answer: "Some services block VPN ranges. Switch to another country in Locations, and tell us which site it was.", href: "/download", cta: "Get the extension" },
];

export default function ContactPage() {
  return (
    <>
      <section className="container-page pt-32 pb-16 md:pt-44">
        <PageIntro
          eyebrow={<><Icon name="message" className="size-5" />Support</>}
          line="Talk to a person."
          serif="Not a ticket queue."
          lead={
            <p>
              Hushgate is made by a small team, and the same people who build it answer the email. Write to{" "}
              <a className="font-medium text-ink underline decoration-line underline-offset-4 hover:decoration-ink" href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>{" "}
              or use the form below.
            </p>
          }
        />

        <ul className="mt-14 grid gap-10 border-t border-line pt-10 md:grid-cols-3 md:gap-12">
          {facts.map((fact, index) => (
            <Reveal key={fact.title} delay={index * 0.08}>
              <li>
                <Icon name={fact.icon} className="size-7 text-cobalt" />
                <h2 className="mt-5 text-[19px] font-semibold tracking-[-0.02em]">{fact.title}</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-slate">{fact.body}</p>
              </li>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="container-page grid gap-12 py-8 lg:grid-cols-[1fr_0.85fr] lg:gap-16" aria-labelledby="write-title">
        <div>
          <h2 id="write-title" className="text-[34px] leading-[1.02] font-bold tracking-[-0.045em] md:text-[44px]">
            Write to us
            <span className="block font-serif font-normal tracking-[-0.03em] italic">and we will write back.</span>
          </h2>
          <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-slate">
            Pick a topic so your message reaches the right place, and include your account email if you have one. The more detail you give, the fewer questions we have to ask.
          </p>
          <div className="mt-8">
            <ContactForm to={site.supportEmail} />
          </div>
        </div>

        <div className="lg:pt-24">
          <h2 className="text-[13px] font-semibold tracking-[0.08em] text-muted uppercase">Where to start</h2>
          <ul className="mt-6 border-t border-line">
            {routes.map((route) => (
              <li key={route.title} className="border-b border-line py-7">
                <Icon name={route.icon} className="size-6 text-cobalt" />
                <h3 className="mt-4 text-[18px] font-semibold tracking-[-0.02em]">{route.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate">{route.body}</p>
                <Link href={route.href} className="mt-3 inline-flex items-center gap-1.5 text-[15px] font-semibold text-ink transition-opacity hover:opacity-70">
                  {route.action}
                  <Icon name="arrowRight" className="size-[17px]" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-page py-20 md:py-28" aria-labelledby="quick-title">
        <div className="flex flex-col justify-between gap-6 border-t border-line pt-12 md:flex-row md:items-end">
          <h2 id="quick-title" className="text-[34px] leading-[1.02] font-bold tracking-[-0.045em] md:text-[48px]">
            Answers in a hurry
          </h2>
          <Link href="/#faq" className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-ink transition-opacity hover:opacity-70">
            All frequently asked questions
            <Icon name="arrowRight" className="size-[17px]" />
          </Link>
        </div>
        <ul className="mt-10 grid gap-px overflow-hidden border-y border-line bg-line sm:grid-cols-2">
          {quick.map((item) => (
            <li key={item.question} className="bg-paper px-1 py-8 sm:px-8">
              <h3 className="text-[19px] font-semibold tracking-[-0.02em]">{item.question}</h3>
              <p className="mt-2 max-w-[42ch] text-[15px] leading-relaxed text-slate">{item.answer}</p>
              <Link href={item.href} className="mt-4 inline-flex items-center gap-1.5 text-[15px] font-semibold text-cobalt transition-opacity hover:opacity-70">
                {item.cta}
                <Icon name="arrowRight" className="size-[17px]" />
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-10 max-w-2xl text-[15px] leading-relaxed text-slate">
          Reporting abuse coming from a Hushgate address? Email{" "}
          <a className="font-medium text-ink underline decoration-line underline-offset-4 hover:decoration-ink" href={`mailto:${site.supportEmail}?subject=${encodeURIComponent("[Report abuse] Hushgate")}`}>{site.supportEmail}</a>{" "}
          with the IP address and timestamps in UTC. Our <Link className="font-medium text-ink underline decoration-line underline-offset-4 hover:decoration-ink" href="/acceptable-use">acceptable use policy</Link> explains what happens next.
        </p>
      </section>
    </>
  );
}
