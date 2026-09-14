# Hushgate setup: accounts, admin panel and launch

This connects the three parts that replace the old staging access code:

1. **Supabase** stores accounts (email + password) and the `profiles` table (role, blocked).
2. **The gateway** on Toronto verifies Supabase sign-ins, issues its own tokens per user, enforces blocks and exposes a signed admin API.
3. **This website** is the public site, the account pages (sign-up, reset password) and the admin panel at `/admin`.

The extension signs people in directly with Supabase, then exchanges that sign-in with the gateway.

> Once the gateway is switched to accounts, the old access code stops working. Anyone using an older build (for example the zip shared earlier) must install the new build and create an account.

---

## 1. Create the Supabase project

1. Go to supabase.com → **New project**. Pick a region close to the Toronto server (for example *East US (North Virginia)* or *Canada Central*).
2. **Authentication → Sign In / Providers → Email**:
   - Enable email provider and **Confirm email**.
   - Minimum password length: **8**.
3. **Authentication → URL Configuration**:
   - Site URL: `https://hushgate.uk`
   - Redirect URLs: `https://hushgate.uk/auth/confirmed`, `https://hushgate.uk/auth/callback`, and for local testing `http://localhost:3000/**`
4. **Authentication → Emails → SMTP Settings**: add your own SMTP (for example Resend, Postmark or Amazon SES) with a sender like `no-reply@hushgate.uk`. Supabase's built-in email is heavily rate-limited and not meant for real users.
5. **SQL Editor** → paste and run `supabase/migrations/20260915000000_profiles.sql`.
   (Or with the Supabase CLI: `supabase link` then `supabase db push`.)
6. **Project Settings → API Keys**: note the **Project URL**, the **publishable key** (`sb_publishable_…`) and the **secret key** (`sb_secret_…`). Legacy `anon` / `service_role` keys also work.

## 2. Run the website locally

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | publishable key |
| `SUPABASE_SECRET_KEY` | secret key (server only) |
| `GATEWAY_API_URL` | `https://155-138-149-113.sslip.io` |
| `GATEWAY_ADMIN_KEY` | generated in step 4 |
| `NEXT_PUBLIC_CHROME_STORE_URL` | empty until the extension is published |

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

## 3. Make yourself an admin

1. Create your account at http://localhost:3000/signup and confirm the email.
2. In Supabase **SQL Editor** run:

```sql
update public.profiles set role = 'admin' where email = 'you@example.com';
```

3. Sign in at `/login`. You land on `/admin`.

## 4. Switch the gateway to accounts

Generate the admin key once (keep it secret; it goes in the gateway and in `GATEWAY_ADMIN_KEY`):

```bash
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

On the Toronto control plane, as root, store the keys in root-owned files readable by the gateway service only:

```bash
umask 027
printf '%s' 'sb_publishable_…' > /etc/merlon-gateway/supabase-anon
printf '%s' 'sb_secret_…'      > /etc/merlon-gateway/supabase-service
printf '%s' 'THE_ADMIN_KEY'    > /etc/merlon-gateway/admin-key
chown root:merlon-gateway /etc/merlon-gateway/supabase-anon /etc/merlon-gateway/supabase-service /etc/merlon-gateway/admin-key
chmod 0640 /etc/merlon-gateway/supabase-anon /etc/merlon-gateway/supabase-service /etc/merlon-gateway/admin-key
```

Add these keys to the top level of `/etc/merlon-gateway/config.json` on Toronto:

```json
"supabase": {
  "url": "https://YOUR-PROJECT.supabase.co",
  "anonKeyFile": "/etc/merlon-gateway/supabase-anon",
  "serviceKeyFile": "/etc/merlon-gateway/supabase-service"
},
"adminKeyFile": "/etc/merlon-gateway/admin-key"
```

Deploy the new `merlon_gateway.py` to Toronto, Frankfurt and Los Angeles (same file everywhere; it now requires TLS 1.3) and restart `merlon-gateway`. Check:

```bash
curl -s https://155-138-149-113.sslip.io/healthz
```

The local test suite for this code is `vpn-extension/infrastructure/gateway/test_gateway_accounts.py`.

## 5. Build the extension with accounts

In `vpn-extension/`:

```bash
cp .env.example .env
# WXT_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
# WXT_SUPABASE_ANON_KEY=sb_publishable_…
pnpm verify
```

Load `.output/chrome-mv3` in `chrome://extensions`, create an account in the popup, confirm the email, sign in and connect. The account should appear in `/admin/users` and the connection in `/admin/sessions`.

## 6. Deploy the website

1. Push this folder to a Git repository and import it in Vercel (framework: Next.js).
2. Add the same environment variables as `.env.local` in Vercel → Settings → Environment Variables, with `NEXT_PUBLIC_SITE_URL=https://hushgate.uk`.
3. Vercel → Domains → add `hushgate.uk` and `www.hushgate.uk`, then set the DNS records Vercel shows at your domain registrar.

## 7. Publish to the Chrome Web Store

1. Create a developer account at https://chrome.google.com/webstore/devconsole (one-time fee).
2. `pnpm zip` in `vpn-extension/` and upload the zip.
3. Listing:
   - **Privacy policy URL:** `https://hushgate.uk/privacy`
   - **Single purpose:** "Routes Chrome traffic through the user's chosen Hushgate VPN server."
   - **Permission justifications:** copy from `https://hushgate.uk/permissions`.
   - **Data use:** declare *Personally identifiable information (email address)* and *Authentication information*, used only for app functionality, not sold or transferred.
   - Screenshots: 1280 × 800. Use the popup captures in `public/extension/` on a flat cobalt background.
4. After approval, set `NEXT_PUBLIC_CHROME_STORE_URL` in Vercel to the listing URL and redeploy. Every "Add to Chrome" button switches to the store link.

## Admin panel reference

| Page | What it does |
|---|---|
| `/admin` | Account totals, connected and signed-in users, server health, newest accounts |
| `/admin/users` | Search accounts; **Block** (ends sessions immediately and refuses sign-in), **Unblock**, **Sign out everywhere**, **Delete** (type the email to confirm) |
| `/admin/sessions` | Live connections with location and exit IP; **End** a session |
| `/admin/locations` | Turn a server off or on for new connections |

Every admin page and action checks the signed-in user's `profiles.role = 'admin'` on the server. The secret key and gateway admin key never reach the browser.
