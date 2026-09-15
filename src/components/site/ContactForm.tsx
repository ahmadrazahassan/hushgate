"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

export const topics = [
  { id: "help", label: "Something is not working" },
  { id: "billing", label: "Billing, plans or refunds" },
  { id: "account", label: "Account and sign-in" },
  { id: "privacy", label: "Privacy or data request" },
  { id: "abuse", label: "Report abuse" },
  { id: "other", label: "Something else" },
] as const;

export type TopicId = (typeof topics)[number]["id"];

const field =
  "w-full rounded-[14px] bg-white px-4 py-3 text-[15px] text-ink ring-1 ring-line ring-inset transition-shadow placeholder:text-faint focus:ring-2 focus:ring-cobalt focus:outline-none";
const label = "block text-[14px] font-semibold text-ink";

/**
 * Support form. Hushgate has no ticketing back end, so rather than pretend to
 * send, it composes the message and hands it to the visitor's email app with
 * everything already filled in.
 */
export function ContactForm({ to, defaultTopic = "help" }: { to: string; defaultTopic?: TopicId }) {
  const [topic, setTopic] = useState<TopicId>(defaultTopic);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const topicLabel = topics.find((item) => item.id === topic)?.label ?? "Support";
  const body = [
    message,
    "",
    "—",
    name && `Name: ${name}`,
    email && `Account email: ${email}`,
    `Topic: ${topicLabel}`,
  ]
    .filter(Boolean)
    .join("\n");
  const href = `mailto:${to}?subject=${encodeURIComponent(`[${topicLabel}] Hushgate support`)}&body=${encodeURIComponent(body)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(`${topicLabel}\n\n${body}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <form
      className="rounded-[var(--radius-card)] bg-mist p-6 md:p-9"
      onSubmit={(event) => {
        event.preventDefault();
        window.location.href = href;
      }}
    >
      <fieldset>
        <legend className={label}>What is it about?</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {topics.map((item) => {
            const active = item.id === topic;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                onClick={() => setTopic(item.id)}
                className={`rounded-full px-4 py-2 text-[14px] font-medium transition-colors ${
                  active ? "bg-ink text-white" : "bg-white text-slate ring-1 ring-line ring-inset hover:text-ink"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="contact-name">Your name <span className="font-normal text-muted">(optional)</span></label>
          <input id="contact-name" className={`${field} mt-2`} value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" placeholder="Alex" />
        </div>
        <div>
          <label className={label} htmlFor="contact-email">Account email</label>
          <input id="contact-email" className={`${field} mt-2`} value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" placeholder="you@example.com" />
        </div>
      </div>

      <div className="mt-5">
        <label className={label} htmlFor="contact-message">How can we help?</label>
        <textarea
          id="contact-message"
          className={`${field} mt-2 min-h-[160px] resize-y`}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          required
          placeholder="Tell us what happened, what you expected, and which country you were connected to. Screenshots help."
        />
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <button type="submit" className="cta cta-cobalt h-[52px] px-6 text-[16px]">
          <Icon name="mail" className="size-5" />
          Open in email app
        </button>
        <button type="button" onClick={copy} className="inline-flex h-[52px] items-center gap-2 rounded-[14px] px-5 text-[15px] font-semibold text-slate ring-1 ring-line transition-colors ring-inset hover:text-ink">
          <Icon name={copied ? "check" : "copy"} className="size-[18px]" />
          {copied ? "Copied" : "Copy message"}
        </button>
      </div>
      <p className="mt-4 text-[13px] leading-relaxed text-muted">
        This opens your own email app with the message ready to send to {to}, so your reply always lands in your inbox. Prefer to write it yourself? Copy the message or email us directly.
      </p>
    </form>
  );
}
