# Hushgate setup: accounts, panels and launch

Three parts work together:

1. **Supabase** (project `hushgate`, ref `sgqfpvntgcgpkjkjpxwy`) stores accounts, the `profiles` table and the admin audit log. Access rules live in the database: `account_access()` decides whether an account may connect (not suspended, and inside the free trial, a paid period or complimentary).
2. **The gateway** on the VPN servers checks `account_access()` with the user's own sign-in token, issues its own short-lived tokens and exposes a signed admin API for live sessions.
3. **This website**: the public site, sign-up and sign-in, the account panel at `/account` and the admin panel at `/admin`.

The extension signs people in with Supabase, then exchanges that sign-in with the gateway.

---

## 1. Supabase (done)

Already applied to the `hushgate` project:

- `supabase/migrations/20260915120000_accounts.sql`: profiles, trial and plan fields, row-level security, access check, admin functions and the audit log.
- `supabase/migrations/20260915121000_hardening.sql`: an index, and removes public access to Supabase's RLS helper.

The website and the extension only use the **publishable key**. No secret key is needed anywhere on the website.

### Still to do in the Supabase dashboard

1. **Authentication → URL Configuration**
   - Site URL: `https://hushgate.uk`
   - Redirect URLs: `https://hushgate.uk/**` and `http://localhost:3100/**`

   Without these, confirmation and password-reset emails send people to the wrong address.
2. **Authentication → Emails → SMTP Settings**: add your own SMTP (Resend, Postmark or Amazon SES) with a sender like `no-reply@hushgate.uk`. Supabase's built-in email sends only a few emails an hour.
3. **Authentication → Sign In / Providers → Email**: keep **Confirm email** on and set the minimum password length to 8.

## 2. Run the website locally

`.env.local` already contains the Supabase URL and publishable key.

```bash
pnpm install
pnpm build
pnpm start -p 3100
```

Open http://localhost:3100.

## 3. Make yourself an admin

1. Create your account at `/signup` and confirm the email.
2. In Supabase **SQL Editor** run:

```sql
update public.profiles set role = 'admin' where email = 'you@example.com';
```

3. Sign in at `/login`. The dock at the bottom of your account now shows the admin panel.

After that, promote or demote other admins from `/admin/users/<id>`. Every change is recorded in `/admin/activity`.

## 4. Gateway: switch to accounts (done on 15 September 2026)

On the control plane (Toronto), as root:

```bash
umask 027
printf '%s' 'sb_publishable_Bbn_k1hN7bN3cbRWTiMFqQ_oeRPxRQs' > /etc/merlon-gateway/supabase-anon
python3 -c "import secrets; print(secrets.token_urlsafe(48))" > /etc/merlon-gateway/admin-key
chown root:merlon-gateway /etc/merlon-gateway/supabase-anon /etc/merlon-gateway/admin-key
chmod 0640 /etc/merlon-gateway/supabase-anon /etc/merlon-gateway/admin-key
```

Add to the top level of `/etc/merlon-gateway/config.json`:

```json
"supabase": {
  "url": "https://sgqfpvntgcgpkjkjpxwy.supabase.co",
  "anonKeyFile": "/etc/merlon-gateway/supabase-anon"
},
"adminKeyFile": "/etc/merlon-gateway/admin-key"
```

Deploy the new `merlon_gateway.py` to every server and restart `merlon-gateway`.

- **At sign-in:** access is checked with the user's token, so blocked or expired accounts cannot sign in.
- **While connected:** to also cut access within a minute of a trial ending, add `"serviceKeyFile"` with the Supabase secret key (server only).

Then set these in the website's environment so the admin panel shows live sessions and can end them:

```
GATEWAY_API_URL=https://155-138-149-113.sslip.io
GATEWAY_ADMIN_KEY=<contents of /etc/merlon-gateway/admin-key>
```

Tests: `python vpn-extension/infrastructure/gateway/test_gateway_accounts.py`.

## 5. Extension

`vpn-extension/.env` is set to the same Supabase project. `pnpm verify` builds `.output/chrome-mv3`. Create an account in the popup, confirm the email, sign in and connect. When a trial ends, the popup explains it and links to `hushgate.uk/account`.

## 6. Deploy the website

1. Import the folder in Vercel (framework: Next.js).
2. Add the variables from `.env.local` (plus the gateway ones), and `NEXT_PUBLIC_SITE_URL=https://hushgate.uk`.
3. Add `hushgate.uk` and `www.hushgate.uk` under Domains and set the DNS records Vercel shows.

## 7. Chrome Web Store

1. Create a developer account at https://chrome.google.com/webstore/devconsole.
2. `pnpm zip` in `vpn-extension/` and upload.
3. Listing details:
   - **Privacy policy:** `https://hushgate.uk/privacy`
   - **Permission justifications:** from `https://hushgate.uk/permissions`
   - **Data use:** email address and authentication information, for app functionality only.
4. After approval, set `NEXT_PUBLIC_CHROME_STORE_URL` and redeploy.

## Panel reference

| Page | What it does |
|---|---|
| `/account` | Access status (trial days left, paid until, expired or suspended), how to connect, account details |
| `/account/plan` | Current plan and prices. Checkout opens once a payment provider is connected |
| `/account/profile` | Name, favourite location, product emails |
| `/account/security` | Change password, sign out other devices, delete account |
| `/admin` | Totals, 14-day sign-ups, servers (with the gateway), newest accounts, recent activity |
| `/admin/users` | Search and filter by trial, paid, expired, suspended or admin |
| `/admin/users/<id>` | Extend trial, set plan, suspend or restore, make or remove admin, sign out everywhere, delete, history |
| `/admin/sessions` | Live connections; end one (needs the gateway) |
| `/admin/locations` | Turn servers on or off for new connections (needs the gateway) |
| `/admin/activity` | Every admin change, newest first |

The database enforces every rule:
- People can read only their own profile and change only their name, favourite location and email preference.
- Admin changes go through database functions that check the caller is an admin and record an audit entry.
- The panel UI hides options that are not allowed, but it is not what enforces the rules.
