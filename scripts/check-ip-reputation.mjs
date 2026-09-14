// Checks Hushgate exit IPs against public DNS blocklists, over DNS-over-HTTPS.
// Usage: pnpm check:ips            (uses the list below)
//        pnpm check:ips 1.2.3.4,5.6.7.8
// Spamhaus refuses queries from public resolvers, so check it from a server
// with its own resolver or at https://check.spamhaus.org/.

// Public IPv4 addresses found in infrastructure/*-source configs (Dallas excluded). Keep in sync when servers change.
const defaultIps = [
  "104.238.167.136", "136.244.86.106", "136.244.88.102", "144.202.66.134", "149.248.12.5", "149.248.53.117",
  "149.248.53.175", "149.248.55.139", "149.28.67.131", "149.28.71.178", "149.28.81.213", "155.138.129.98",
  "155.138.137.15", "155.138.149.113", "207.148.3.21", "216.128.138.225", "216.128.140.164", "45.63.51.221",
  "45.76.81.244", "45.77.121.78", "45.77.53.226", "66.42.106.206",
];

const ips = process.argv[2] ? process.argv[2].split(",") : defaultIps;
const lists = ["dnsbl.dronebl.org", "b.barracudacentral.org", "bl.spamcop.net", "psbl.surriel.com", "dnsbl-1.uceprotect.net", "all.s5h.net"];

let problems = 0;
for (const list of lists) {
  const listed = [];
  const unknown = [];
  for (let i = 0; i < ips.length; i += 5) {
    await Promise.all(
      ips.slice(i, i + 5).map(async (ip) => {
        const name = `${ip.split(".").reverse().join(".")}.${list}`;
        try {
          const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${name}&type=A`, {
            headers: { accept: "application/dns-json" },
            signal: AbortSignal.timeout(8000),
          });
          const json = await res.json();
          if (json.Status === 0 && json.Answer?.length) listed.push(`${ip} (${json.Answer.map((answer) => answer.data).join(", ")})`);
          else if (json.Status !== 0 && json.Status !== 3) unknown.push(`${ip} (DNS status ${json.Status})`);
        } catch (error) {
          unknown.push(`${ip} (${error.name})`);
        }
      }),
    );
  }
  problems += listed.length;
  const status = listed.length ? `LISTED: ${listed.join("; ")}` : "clean";
  console.log(`${list.padEnd(26)} ${status}${unknown.length ? `  | could not check: ${unknown.join("; ")}` : ""}`);
}

process.exitCode = problems ? 1 : 0;
