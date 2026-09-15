import "server-only";

import { createHash, createHmac } from "node:crypto";

/**
 * Talks to the Hushgate control plane's admin API. Every request is signed with
 * HMAC-SHA256 over "timestamp\nMETHOD\npath\nsha256(body)", matching the gateway.
 */

export interface GatewayServer {
  region: string;
  host: string;
  role: "control" | "node";
  healthy: boolean;
  activeTunnels: number;
  exitIps: string[];
  checkedSecondsAgo: number | null;
}

export interface GatewayLocation {
  id: string;
  country: string;
  countryName: string;
  city: string;
  displayName: string;
  exitIp: string;
  load: number;
  available: boolean;
  enabled: boolean;
  region: string;
  /** User id the location is reserved for as a dedicated IP, if any. */
  dedicatedTo?: string | null;
}

export interface GatewayOverview {
  servers: GatewayServer[];
  locations: GatewayLocation[];
  counts: { activeSessions: number; connectedUsers: number; signedInUsers: number };
}

export interface GatewaySession {
  sessionId: string;
  userId: string;
  email: string;
  locationId: string;
  exitIp: string;
  region: string;
  createdAt: string | null;
  expiresAt: string;
}

export class GatewayError extends Error {}

/** True when the admin panel can talk to the gateway (live sessions, locations, sign-outs). */
export function gatewayConfigured(): boolean {
  return Boolean(process.env.GATEWAY_API_URL && process.env.GATEWAY_ADMIN_KEY);
}

function config(): { base: string; key: string } {
  const base = process.env.GATEWAY_API_URL;
  const key = process.env.GATEWAY_ADMIN_KEY;
  if (!base || !key) throw new GatewayError("Gateway admin API is not configured. Set GATEWAY_API_URL and GATEWAY_ADMIN_KEY.");
  return { base: base.replace(/\/+$/, ""), key };
}

function base64url(buffer: Buffer): string {
  return buffer.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function call<T>(method: "GET" | "POST" | "DELETE", path: string, body?: unknown): Promise<T> {
  const { base, key } = config();
  const payload = body === undefined ? "" : JSON.stringify(body);
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const bodyHash = createHash("sha256").update(payload).digest("hex");
  const signature = base64url(createHmac("sha256", key).update(`${timestamp}\n${method}\n${path}\n${bodyHash}`).digest());

  let response: Response;
  try {
    response = await fetch(`${base}${path}`, {
      method,
      headers: { "X-Hushgate-Admin-Auth": `${timestamp}.${signature}`, ...(payload ? { "Content-Type": "application/json" } : {}) },
      body: payload || undefined,
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    throw new GatewayError("The gateway could not be reached.");
  }
  if (response.status === 404) throw new GatewayError("The gateway rejected the admin signature or the item no longer exists.");
  if (!response.ok) throw new GatewayError(`The gateway answered ${response.status}.`);
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export const gateway = {
  overview: () => call<GatewayOverview>("GET", "/v1/admin/overview"),
  sessions: () => call<{ sessions: GatewaySession[] }>("GET", "/v1/admin/sessions").then((data) => data.sessions),
  endSession: (sessionId: string) => call<void>("DELETE", `/v1/admin/sessions/${encodeURIComponent(sessionId)}`),
  signOutUser: (userId: string) => call<{ ok: boolean; endedSessions: number }>("POST", `/v1/admin/users/${encodeURIComponent(userId)}/revoke`, {}),
  setLocationEnabled: (locationId: string, enabled: boolean) =>
    call<{ ok: boolean }>("POST", `/v1/admin/locations/${encodeURIComponent(locationId)}`, { enabled }),
};
