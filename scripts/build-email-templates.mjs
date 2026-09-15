// Builds every Supabase Auth email from one layout that matches hushgate.uk.
// Run: node scripts/build-email-templates.mjs
// Output: docs/email-templates/*.html plus README.md with the subject for each template.

import { mkdirSync, writeFileSync } from "node:fs";

const OUT = new URL("../docs/email-templates/", import.meta.url);
const LOGO = "https://sgqfpvntgcgpkjkjpxwy.supabase.co/storage/v1/object/public/brand/email/hushgate-logo.png";

const color = { ink: "#151922", slate: "#596273", muted: "#828c9e", faint: "#adb5c3", line: "#e3e6ee", mist: "#f4f5f9", cobalt: "#5267ff", black: "#0b0d12" };
const sans = "'Inter Tight','Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const body = "'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const serif = "'Instrument Serif',Georgia,'Times New Roman',serif";
const mono = "'SFMono-Regular',Menlo,Consolas,'Liberation Mono',monospace";

/** Glossy key buttons, same as the site's CTA buttons (gradient with a solid fallback). */
function button(label, href, tone = "cobalt") {
  const look = tone === "cobalt"
    ? { bg: "#5267ff", gradient: "linear-gradient(180deg,#7280ff 0%,#5a67f7 46%,#4b56e8 100%)", border: "#3a43c6", shadow: "0 10px 22px -8px rgba(72,84,232,0.55)" }
    : { bg: "#1c1d20", gradient: "linear-gradient(180deg,#414246 0%,#2c2d31 48%,#1c1d20 100%)", border: "#0b0b0d", shadow: "0 10px 22px -8px rgba(0,0,0,0.45)" };
  return `
<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:30px 0 0">
  <tr>
    <td bgcolor="${look.bg}" style="border-radius:14px;background:${look.bg};background-image:${look.gradient};border:1px solid ${look.border};box-shadow:inset 0 1px 0 rgba(255,255,255,0.35),${look.shadow}">
      <a href="${href}" target="_blank" style="display:inline-block;padding:15px 26px;font-family:${sans};font-size:16px;font-weight:700;letter-spacing:-0.2px;line-height:20px;color:#ffffff;text-decoration:none;border-radius:14px">${label}&nbsp;&nbsp;&rarr;</a>
    </td>
  </tr>
</table>`;
}

function fallbackLink(href) {
  return `
<p style="margin:22px 0 0;font-family:${body};font-size:13px;line-height:20px;color:${color.muted}">Button not working? Copy this link into your browser:<br>
<a href="${href}" target="_blank" style="color:${color.cobalt};text-decoration:none;word-break:break-all">${href}</a></p>`;
}

function codeBox(code, caption) {
  return `
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:28px 0 0">
  <tr>
    <td style="background:${color.mist};border-radius:20px;padding:22px 24px;text-align:center">
      <p style="margin:0;font-family:${body};font-size:13px;font-weight:600;color:${color.slate}">${caption}</p>
      <p style="margin:10px 0 0;font-family:${mono};font-size:34px;font-weight:700;letter-spacing:10px;color:${color.ink}">${code}</p>
    </td>
  </tr>
</table>`;
}

function rows(items) {
  return `
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:26px 0 0;background:${color.mist};border-radius:20px">
  ${items.map(([label, value], index) => `<tr>
    <td style="padding:${index === 0 ? "18px" : "12px"} 22px ${index === items.length - 1 ? "18px" : "12px"};font-family:${body};font-size:14px;color:${color.slate};${index < items.length - 1 ? `border-bottom:1px solid ${color.line};` : ""}">${label}</td>
    <td align="right" style="padding:${index === 0 ? "18px" : "12px"} 22px ${index === items.length - 1 ? "18px" : "12px"};font-family:${body};font-size:14px;font-weight:600;color:${color.ink};word-break:break-all;${index < items.length - 1 ? `border-bottom:1px solid ${color.line};` : ""}">${value}</td>
  </tr>`).join("\n  ")}
</table>`;
}

function steps(items) {
  return `
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:30px 0 0;background:${color.mist};border-radius:20px">
  <tr><td style="padding:20px 22px 8px;font-family:${body};font-size:13px;font-weight:700;color:${color.ink}">Then, in Chrome</td></tr>
  ${items.map((text, index) => `<tr><td style="padding:6px 22px ${index === items.length - 1 ? "20px" : "6px"}">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr>
      <td width="26" height="26" align="center" style="width:26px;height:26px;border-radius:13px;background:#ffffff;border:1px solid ${color.line};font-family:${sans};font-size:12px;font-weight:700;color:${color.cobalt}">${index + 1}</td>
      <td style="padding-left:12px;font-family:${body};font-size:14px;line-height:20px;color:${color.slate}">${text}</td>
    </tr></table>
  </td></tr>`).join("\n  ")}
</table>`;
}

function note(text) {
  return `<p style="margin:26px 0 0;padding-top:22px;border-top:1px solid ${color.line};font-family:${body};font-size:13px;line-height:21px;color:${color.muted}">${text}</p>`;
}

/** The shared frame: black notch with the logo, the white card, and the black footer card. */
function layout({ preheader, eyebrow, title, serifTitle, intro, content }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>Hushgate</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Inter+Tight:wght@700;800&family=Instrument+Serif:ital@1&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:${color.mist};-webkit-font-smoothing:antialiased">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${preheader}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="${color.mist}" style="background:${color.mist}">
  <tr>
    <td align="center" style="padding:32px 14px 40px">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px">
        <tr>
          <td style="background:#ffffff;border-radius:28px;border:1px solid ${color.line}">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td align="center" style="padding:0">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <td bgcolor="${color.black}" style="background:${color.black};border-radius:0 0 20px 20px;padding:10px 20px 10px 12px">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr>
                          <td><img src="${LOGO}" width="32" height="32" alt="" style="display:block;width:32px;height:32px;border:0;border-radius:9px"></td>
                          <td style="padding-left:10px;font-family:${sans};font-size:18px;font-weight:800;letter-spacing:-0.5px;color:#ffffff">Hushgate</td>
                        </tr></table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:38px 40px 40px" class="card">
                  <p style="margin:0;font-family:${sans};font-size:14px;font-weight:700;letter-spacing:-0.2px;color:${color.cobalt}">${eyebrow}</p>
                  <h1 style="margin:12px 0 0;font-family:${sans};font-size:38px;line-height:40px;font-weight:800;letter-spacing:-1.6px;color:${color.ink}">${title}<br><span style="font-family:${serif};font-style:italic;font-weight:400;letter-spacing:-0.8px">${serifTitle}</span></h1>
                  <p style="margin:18px 0 0;font-family:${body};font-size:16px;line-height:26px;color:${color.slate}">${intro}</p>
                  ${content}
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding-top:14px">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td bgcolor="${color.black}" style="background:${color.black};border-radius:24px;padding:26px 28px">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr>
                    <td valign="middle">
                      <p style="margin:0;font-family:${sans};font-size:20px;line-height:22px;font-weight:800;letter-spacing:-0.8px;color:#ffffff">Browse quietly.<br><span style="font-family:${serif};font-style:italic;font-weight:400;letter-spacing:-0.3px">Be nowhere.</span></p>
                    </td>
                    <td valign="middle" align="right"><img src="${LOGO}" width="36" height="36" alt="Hushgate" style="display:block;width:36px;height:36px;border:0;border-radius:10px"></td>
                  </tr></table>
                  <p style="margin:18px 0 0;font-family:${body};font-size:13px;line-height:20px">
                    <a href="{{ .SiteURL }}/account" style="color:#ffffff;text-decoration:none;font-weight:600">Your account</a>
                    <span style="color:rgba(255,255,255,0.3)">&nbsp;&middot;&nbsp;</span>
                    <a href="{{ .SiteURL }}/privacy" style="color:rgba(255,255,255,0.7);text-decoration:none">Privacy</a>
                    <span style="color:rgba(255,255,255,0.3)">&nbsp;&middot;&nbsp;</span>
                    <a href="{{ .SiteURL }}/terms" style="color:rgba(255,255,255,0.7);text-decoration:none">Terms</a>
                    <span style="color:rgba(255,255,255,0.3)">&nbsp;&middot;&nbsp;</span>
                    <a href="mailto:support@hushgate.uk" style="color:rgba(255,255,255,0.7);text-decoration:none">Support</a>
                  </p>
                  <p style="margin:10px 0 0;font-family:${body};font-size:12px;line-height:18px;color:rgba(255,255,255,0.45)">Private VPN for Chrome &middot; hushgate.uk<br>You received this email because of activity on your Hushgate account.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>
`;
}

const security = (what) => note(`Wasn't you? <a href="{{ .SiteURL }}/reset-password" style="color:${color.ink};font-weight:600">Reset your password</a> right away and write to <a href="mailto:support@hushgate.uk" style="color:${color.ink};font-weight:600">support@hushgate.uk</a>. ${what}`);

const templates = [
  {
    file: "confirm-signup.html", supabase: "Confirm sign up", subject: "Confirm your Hushgate account",
    html: layout({
      preheader: "One tap to start your 14-day free trial.",
      eyebrow: "Welcome to Hushgate", title: "Confirm your", serifTitle: "email.",
      intro: "One tap and your 14-day free trial starts. Every location and feature is included, and you will not be charged during the trial.",
      content: button("Confirm email", "{{ .ConfirmationURL }}") + steps(["Open Hushgate from the puzzle-piece icon.", "Sign in with {{ .Email }}.", "Tap the power button to connect."]) + fallbackLink("{{ .ConfirmationURL }}") + note("Did not create a Hushgate account? You can safely ignore this email."),
    }),
  },
  {
    file: "invite-user.html", supabase: "Invite user", subject: "You're invited to Hushgate",
    html: layout({
      preheader: "Accept your invitation and choose a password.",
      eyebrow: "Invitation", title: "You're invited to", serifTitle: "Hushgate.",
      intro: "An account has been created for {{ .Email }}. Accept the invitation to choose your password and start browsing privately in Chrome.",
      content: button("Accept invitation", "{{ .ConfirmationURL }}") + fallbackLink("{{ .ConfirmationURL }}") + note("Not expecting this? You can ignore this email and no account will be activated."),
    }),
  },
  {
    file: "magic-link.html", supabase: "Magic link or OTP", subject: "Your Hushgate sign-in link",
    html: layout({
      preheader: "Your one-time sign-in link and code.",
      eyebrow: "Sign in", title: "Your sign-in", serifTitle: "link.",
      intro: "Tap the button to sign in to Hushgate. The link and the code below work once and expire soon.",
      content: button("Sign in to Hushgate", "{{ .ConfirmationURL }}") + codeBox("{{ .Token }}", "Or enter this code") + fallbackLink("{{ .ConfirmationURL }}") + note("Did not try to sign in? Ignore this email. Nobody can sign in without this link or code."),
    }),
  },
  {
    file: "change-email.html", supabase: "Change email address", subject: "Confirm your new Hushgate email",
    html: layout({
      preheader: "Confirm the new email for your Hushgate account.",
      eyebrow: "Account", title: "Confirm your", serifTitle: "new email.",
      intro: "Your Hushgate sign-in is changing. Confirm to finish; until then, keep using your current email.",
      content: rows([["From", "{{ .Email }}"], ["To", "{{ .NewEmail }}"]]) + button("Confirm new email", "{{ .ConfirmationURL }}") + fallbackLink("{{ .ConfirmationURL }}") + note(`Did not ask for this? <a href="{{ .SiteURL }}/reset-password" style="color:${color.ink};font-weight:600">Change your password</a> and write to support@hushgate.uk.`),
    }),
  },
  {
    file: "reset-password.html", supabase: "Reset password", subject: "Reset your Hushgate password",
    html: layout({
      preheader: "Choose a new password for your Hushgate account.",
      eyebrow: "Password", title: "Choose a new", serifTitle: "password.",
      intro: "We received a request to reset the password for {{ .Email }}. The link works once and expires in an hour. You will use the new password here and in the extension.",
      content: button("Reset password", "{{ .ConfirmationURL }}", "black") + fallbackLink("{{ .ConfirmationURL }}") + note("Did not ask for this? Ignore this email and your password stays the same."),
    }),
  },
  {
    file: "reauthentication.html", supabase: "Reauthentication", subject: "{{ .Token }} is your Hushgate code",
    html: layout({
      preheader: "Your Hushgate verification code.",
      eyebrow: "Verification", title: "Confirm it's", serifTitle: "you.",
      intro: "Enter this code to finish a sensitive change on your Hushgate account. It expires in a few minutes.",
      content: codeBox("{{ .Token }}", "Your verification code") + note(`Did not try to change anything? <a href="{{ .SiteURL }}/reset-password" style="color:${color.ink};font-weight:600">Reset your password</a> right away.`),
    }),
  },
  {
    file: "password-changed.html", supabase: "Password changed", subject: "Your Hushgate password was changed",
    html: layout({
      preheader: "The password for your Hushgate account was changed.",
      eyebrow: "Security", title: "Your password", serifTitle: "was changed.",
      intro: "The password for {{ .Email }} was just changed. Use the new password next time you sign in to the Hushgate extension.",
      content: button("Review security", "{{ .SiteURL }}/account/security", "black") + security(""),
    }),
  },
  {
    file: "email-changed.html", supabase: "Email address changed", subject: "Your Hushgate email was changed",
    html: layout({
      preheader: "The sign-in email for your Hushgate account was changed.",
      eyebrow: "Security", title: "Your email", serifTitle: "was changed.",
      intro: "The email you use to sign in to Hushgate is now different.",
      content: rows([["Old email", "{{ .OldEmail }}"], ["New email", "{{ .Email }}"]]) + button("Review security", "{{ .SiteURL }}/account/security", "black") + security(""),
    }),
  },
  {
    file: "phone-changed.html", supabase: "Phone number changed", subject: "Your Hushgate phone number was changed",
    html: layout({
      preheader: "The phone number on your Hushgate account was changed.",
      eyebrow: "Security", title: "Your phone number", serifTitle: "was changed.",
      intro: "The phone number on your Hushgate account ({{ .Email }}) is now different.",
      content: rows([["Old number", "{{ .OldPhone }}"], ["New number", "{{ .Phone }}"]]) + button("Review security", "{{ .SiteURL }}/account/security", "black") + security(""),
    }),
  },
  {
    file: "identity-linked.html", supabase: "Sign-in method linked", subject: "A sign-in method was added to your Hushgate account",
    html: layout({
      preheader: "A new way to sign in was added to your account.",
      eyebrow: "Security", title: "Sign-in method", serifTitle: "added.",
      intro: "A new way to sign in was linked to your Hushgate account.",
      content: rows([["Method", "{{ .Provider }}"], ["Account", "{{ .Email }}"]]) + button("Review security", "{{ .SiteURL }}/account/security", "black") + security(""),
    }),
  },
  {
    file: "identity-unlinked.html", supabase: "Sign-in method removed", subject: "A sign-in method was removed from your Hushgate account",
    html: layout({
      preheader: "A way to sign in was removed from your account.",
      eyebrow: "Security", title: "Sign-in method", serifTitle: "removed.",
      intro: "A way to sign in was removed from your Hushgate account.",
      content: rows([["Method", "{{ .Provider }}"], ["Account", "{{ .Email }}"]]) + button("Review security", "{{ .SiteURL }}/account/security", "black") + security(""),
    }),
  },
  {
    file: "mfa-added.html", supabase: "MFA method added", subject: "A verification method was added to your Hushgate account",
    html: layout({
      preheader: "A new verification method protects your account.",
      eyebrow: "Security", title: "Verification method", serifTitle: "added.",
      intro: "A new two-step verification method was added to your Hushgate account ({{ .Email }}).",
      content: rows([["Method", "{{ .FactorType }}"]]) + button("Review security", "{{ .SiteURL }}/account/security", "black") + security(""),
    }),
  },
  {
    file: "mfa-removed.html", supabase: "MFA method removed", subject: "A verification method was removed from your Hushgate account",
    html: layout({
      preheader: "A verification method was removed from your account.",
      eyebrow: "Security", title: "Verification method", serifTitle: "removed.",
      intro: "A two-step verification method was removed from your Hushgate account ({{ .Email }}).",
      content: rows([["Method", "{{ .FactorType }}"]]) + button("Review security", "{{ .SiteURL }}/account/security", "black") + security(""),
    }),
  },
];

mkdirSync(OUT, { recursive: true });
for (const template of templates) writeFileSync(new URL(template.file, OUT), template.html);

const readme = `# Hushgate email templates

Generated by \`node scripts/build-email-templates.mjs\`; edit the script, not the HTML files.

In Supabase: **Authentication → Emails → Templates**. Open each template, paste the **Subject**, switch the body to **Source**, and paste the whole HTML file.

| Supabase template | Subject | File |
|---|---|---|
${templates.map((t) => `| ${t.supabase} | \`${t.subject}\` | \`${t.file}\` |`).join("\n")}

The logo loads from Supabase Storage (public bucket \`brand\`), so it shows in every inbox without the website being live.
`;
writeFileSync(new URL("README.md", OUT), readme);
console.log(`Wrote ${templates.length} templates to docs/email-templates/`);
