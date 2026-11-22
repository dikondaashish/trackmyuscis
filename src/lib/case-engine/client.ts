import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * The case engine: a private service, run by our company, that checks saved receipt
 * numbers with the official USCIS Case Status API about once a day and posts status
 * changes back to /api/case-engine/status. We send it only a receipt number and the
 * account's random ID (never a name or email).
 *
 * Server only. Off until CASE_ENGINE_URL, CASE_ENGINE_KEY and CASE_ENGINE_WEBHOOK_SECRET
 * are all set, so nothing here runs in local development by default.
 */

export type EngineHistoryItem = { date: string; completedText: string };

export type EngineCase = {
  id: string;
  userRef: string;
  receiptNumber: string;
  formType: string | null;
  status: string | null;
  description: string | null;
  receivedDate: string | null;
  history: EngineHistoryItem[];
  statusChangedAt: string | null;
  lastCheckedAt: string | null;
  lastErrorCode: number | null;
  /** USCIS doesn't recognize the receipt number (it has never returned a status). */
  notFound?: boolean;
  /** Not found, and the engine has stopped retrying (after about two weeks). */
  checksStopped?: boolean;
};

export type EngineStatusEvent = {
  event: "case.status_changed";
  previousStatus: string | null;
  case: EngineCase;
  sentAt: string;
};

function config() {
  const url = process.env.CASE_ENGINE_URL;
  const key = process.env.CASE_ENGINE_KEY;
  const webhookSecret = process.env.CASE_ENGINE_WEBHOOK_SECRET;
  if (!url || !key || !webhookSecret) return null;
  try {
    const base = new URL(url);
    if (base.protocol !== "https:") return null;
    return { base: base.origin, key, webhookSecret };
  } catch {
    return null;
  }
}

/** On only when we can also save what the engine returns (SUPABASE_SECRET_KEY). */
export const caseEngineEnabled = () => config() !== null && Boolean(process.env.SUPABASE_SECRET_KEY);

export class CaseEngineError extends Error {
  constructor(readonly status: number) {
    super(`Case engine request failed (${status})`);
    this.name = "CaseEngineError";
  }
}

async function call<T>(method: "GET" | "POST" | "DELETE", query: Record<string, string>, body?: unknown): Promise<T> {
  const c = config();
  if (!c) throw new CaseEngineError(503);
  const url = new URL("/api/partner/cases", c.base);
  for (const [k, v] of Object.entries(query)) url.searchParams.set(k, v);
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${c.key}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
    redirect: "error",
    // Registering checks USCIS once, which can take a while.
    signal: AbortSignal.timeout(method === "POST" ? 45_000 : 15_000),
  });
  if (!response.ok) throw new CaseEngineError(response.status);
  return (await response.json()) as T;
}

export const engine = {
  list: (userId: string) => call<{ cases: EngineCase[] }>("GET", { userRef: userId }).then((r) => r.cases),
  /** Idempotent: an already-registered receipt returns the saved case. */
  add: (userId: string, receiptNumber: string) =>
    call<{ case: EngineCase }>("POST", {}, { userRef: userId, receiptNumber }).then((r) => r.case),
  /**
   * One more USCIS lookup for a receipt it didn't recognize. The engine allows it at most
   * hourly per case; `rechecked` is false when it didn't look again.
   */
  recheck: (userId: string, receiptNumber: string) =>
    call<{ case: EngineCase; rechecked?: boolean }>("POST", {}, { userRef: userId, receiptNumber, recheck: true }).then((r) => ({
      case: r.case,
      rechecked: r.rechecked === true,
    })),
  remove: (userId: string, receiptNumber?: string) =>
    call<{ removed: number }>("DELETE", receiptNumber ? { userRef: userId, receiptNumber } : { userRef: userId }),
};

/** Status updates older than this are refused, so a captured request can't be replayed later. */
const MAX_SKEW_SECONDS = 5 * 60;

/**
 * Checks X-Partner-Timestamp and X-Partner-Signature ("sha256=" + HMAC-SHA256 of
 * "<timestamp>.<raw body>") on an incoming status update.
 */
export function verifyEngineSignature(rawBody: string, timestamp: string | null, signature: string | null, now = Date.now()) {
  const c = config();
  if (!c || !timestamp || !signature || !/^\d{9,11}$/.test(timestamp)) return false;
  if (Math.abs(now / 1000 - Number(timestamp)) > MAX_SKEW_SECONDS) return false;
  const expected = `sha256=${createHmac("sha256", c.webhookSecret).update(`${timestamp}.${rawBody}`).digest("hex")}`;
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
