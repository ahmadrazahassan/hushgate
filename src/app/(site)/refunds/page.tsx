import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/site/LegalPage";
import { TRIAL_DAYS } from "@/lib/pricing";
import { LEGAL_UPDATED, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Refunds and cancellation",
  description: "How to cancel Hushgate, when you get a refund and how long it takes.",
};

const mail = <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>;

export default function RefundsPage() {
  return (
    <LegalPage
      path="/refunds"
      icon="card"
      title="Refunds and cancellation"
      serif="No hoops."
      updated={LEGAL_UPDATED}
      intro={<p>Try Hushgate free for {TRIAL_DAYS} days, cancel in a click, and ask for your money back within 14 days of a payment if it is not for you. This page explains exactly how that works.</p>}
      sections={[
        {
          title: "The free trial",
          body: <p>Every new account gets {TRIAL_DAYS} days with all locations and features unlocked. We do not charge you during the trial. If you cancel before it ends, you pay nothing and there is nothing to refund.</p>,
        },
        {
          title: "Our 14-day money-back guarantee",
          body: (
            <>
              <p>If you paid for a plan and Hushgate is not right for you, email us within <strong>14 days of that payment</strong> and we will refund it in full. You do not have to explain why, though telling us helps us improve.</p>
              <p>The guarantee covers your first payment on a plan and each renewal payment. It does not cover payments made more than 14 days ago, or accounts closed for breaking our <Link href="/acceptable-use">acceptable use policy</Link>.</p>
            </>
          ),
        },
        {
          title: "How to cancel",
          body: (
            <>
              <p>Cancel at any time:</p>
              <ol>
                <li>Sign in and open <Link href="/account/plan">your plan</Link>.</li>
                <li>Choose to cancel the plan.</li>
                <li>Keep using Hushgate until the end of the period you have already paid for.</li>
              </ol>
              <p>Cancelling stops the next renewal. It does not delete your account: you can start a plan again later with the same email. If you would rather we handle it, email {mail} from your account address.</p>
            </>
          ),
        },
        {
          title: "How to ask for a refund",
          body: <p>Email {mail} from the address on your account, or use the <Link href="/contact">contact page</Link> and choose &quot;Billing&quot;. Tell us which payment you mean. We reply within one working day, approve eligible requests straight away and send the money back to the original payment method. Banks usually show it within 5 to 10 working days.</p>,
        },
        {
          title: "Part-used periods",
          body: <p>Outside the 14-day window we do not refund the unused part of a plan, because the price is already set for the whole period. There are two exceptions: if we close your account without cause, or if we make a change that materially reduces what you paid for, we refund the unused part.</p>,
        },
        {
          title: "Price changes and renewals",
          body: <p>We tell you by email before a price change affects a renewal, so you always have time to cancel. If a renewal is charged after you asked us to cancel, tell us and we will refund it in full, whatever the date.</p>,
        },
        {
          title: "Your legal rights",
          body: <p>This guarantee is offered on top of your statutory rights, not instead of them. Consumers in the UK and EU have a 14-day right to change their mind about a purchase made online; where the service starts immediately at your request, you agree that this period runs from the payment date. Nothing here limits rights you have under consumer law.</p>,
        },
        {
          title: "Chargebacks",
          body: <p>Please contact us before asking your bank to reverse a payment. We can almost always resolve it faster ourselves, and a chargeback may suspend your account while the bank investigates.</p>,
        },
      ]}
    />
  );
}
