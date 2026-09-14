# Hushgate website

Public site, account pages and admin control panel for Hushgate, the private VPN for Chrome.

- **Stack:** Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS 4, Supabase (`@supabase/ssr`).
- **Public pages:** `/`, `/download`, `/privacy`, `/terms`, `/permissions`, `/licenses`, `/uninstalled`.
- **Account pages:** `/signup`, `/login`, `/reset-password`, `/update-password`, `/auth/confirmed`.
- **Admin panel:** `/admin` (overview), `/admin/users`, `/admin/sessions`, `/admin/locations`. Admins only.

## Start

```bash
cp .env.example .env.local   # fill in Supabase and gateway values
pnpm install
pnpm dev
```

## Docs

- [docs/SETUP.md](docs/SETUP.md): Supabase, the gateway switch-over, deployment and Chrome Web Store publishing.
- [docs/IMAGE_PROMPTS.md](docs/IMAGE_PROMPTS.md): prompts for every illustration slot in `public/art/`.
- `supabase/migrations/`: database schema (profiles, roles, blocking).

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Local development server |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint |
