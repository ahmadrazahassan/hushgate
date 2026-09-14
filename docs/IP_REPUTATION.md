# IP reputation

The website says Hushgate IPs are **clean** and **static**, and that we **check them against the major spam blocklists**. Keep those words true.

## What each claim means

| Claim | Why it is true | What keeps it true |
|---|---|---|
| Static | Each server has its own fixed public IPv4 address that does not change between sessions. | Don't rotate server IPs without updating the site. |
| Clean | The addresses are checked against public spam and abuse blocklists. | Run `pnpm check:ips` regularly, and fix or swap any listed address. |
| Checked against the major spam blocklists | `scripts/check-ip-reputation.mjs` queries DroneBL, Barracuda, SpamCop, PSBL, UCEPROTECT and s5h. | Keep running it, and check Spamhaus from a server (see below). |

We do **not** say "residential". The servers are hosted by Vultr, so every address belongs to a hosting network. Any IP lookup site shows that immediately. Only use the word if the exits really move to residential addresses.

## Check on 15 September 2026

22 addresses from the server configs (Dallas excluded) were checked:

- Barracuda, SpamCop, PSBL, UCEPROTECT level 1, s5h: **all clean**.
- DroneBL: **45.77.53.226 is listed** with code `127.0.0.9` (DroneBL class 9, SOCKS proxy). The other 21 addresses are clean.
- Spamhaus ZEN: not checked, because Spamhaus refuses queries from public resolvers.

### To do

1. Look up 45.77.53.226 at https://dronebl.org/lookup and request removal. The gateway requires authentication, so it is not an open proxy. Make sure no unauthenticated proxy port is reachable on that server first.
2. Until it is removed, consider taking that address out of the Frankfurt exit pool.
3. Check all addresses on Spamhaus: run `dig +short <reversed-ip>.zen.spamhaus.org` from one of the servers, or use https://check.spamhaus.org/.

## Running the check

```bash
pnpm check:ips
```

The command exits with code 1 if any address is listed.
