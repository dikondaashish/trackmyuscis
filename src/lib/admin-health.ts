/**
 * How the daily case checks are doing, for /admin. Server only (uses the secret key).
 * The engine checks every saved receipt number about once a day but only posts back when a
 * status changes, so our own last_checked_at goes stale whenever nothing changes. To tell
 * whether checks are really running we ask the engine itself about one account.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { caseEngineEnabled, engine } from "@/lib/case-engine/client";

const HOUR = 3_600_000;
/** A new case should be accepted by the checker within this long (the dashboard registers it at once). */
export const REGISTER_GRACE_HOURS = 6;
/** Cases are checked about once a day; past this the checker is behind or stopped. */
export const STALE_AFTER_HOURS = 48;
/** How long the overview waits for the engine before calling it unreachable. */
const PROBE_TIMEOUT_MS = 6_000;

export type CaseHealth = {
  engineOn: boolean;
  total: number;
  /** Saved over REGISTER_GRACE_HOURS ago but never accepted by the checker. */
  waiting: number;
  /** USCIS doesn't recognize the number; the checker still tries now and then. */
  notFound: number;
  /** USCIS never recognized it and the checker gave up. */
  stopped: number;
  /** Status changes in the last 7 days, and how many of those weren't emailed (or marked as handled). */
  changes7d: number;
  unemailed: number;
  /** The engine's newest check on the sampled account's cases (null when unknown). */
  lastCheck: string | null;
  /** What asking the engine found: fine, behind (no check for STALE_AFTER_HOURS), no answer, or nothing to ask about. */
  probe: "ok" | "behind" | "no-answer" | "no-cases" | "off";
  /** True when checks look broken: the engine didn't answer or is behind. */
  checkerDown: boolean;
};

const iso = (msAgo: number, now: number) => new Date(now - msAgo).toISOString();

export async function caseHealth(db: SupabaseClient, now = Date.now()): Promise<CaseHealth> {
  const count = (build: (q: ReturnType<typeof base>) => ReturnType<typeof base>) => build(base()).then((r) => r.count ?? 0);
  const base = () => db.from("cases").select("id", { count: "exact", head: true });
  const registerCutoff = iso(REGISTER_GRACE_HOURS * HOUR, now);

  const [total, waiting, notFound, stopped, recent, sample] = await Promise.all([
    count((q) => q),
    count((q) => q.is("engine_registered_at", null).lt("created_at", registerCutoff)),
    count((q) => q.eq("uscis_not_found", true).eq("checks_stopped", false)),
    count((q) => q.eq("checks_stopped", true)),
    db.from("cases").select("current_status, alerted_status").gt("status_changed_at", iso(7 * 24 * HOUR, now)).limit(2000),
    // An account whose cases the engine has accepted and is still checking.
    db.from("cases").select("user_id").not("engine_registered_at", "is", null).eq("checks_stopped", false).order("created_at", { ascending: false }).limit(1).maybeSingle(),
  ]);

  const engineOn = caseEngineEnabled();
  let probe: CaseHealth["probe"] = engineOn ? "no-cases" : "off";
  let lastCheck: string | null = null;
  const userId = sample.data?.user_id as string | undefined;
  if (engineOn && userId) {
    const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), PROBE_TIMEOUT_MS));
    const remote = await Promise.race([engine.list(userId).catch(() => null), timeout]);
    if (!remote) probe = "no-answer";
    else if (remote.length > 0) {
      // Compared as times: the engine's date format may differ from ours.
      const newest = Math.max(0, ...remote.map((c) => (c.lastCheckedAt ? Date.parse(c.lastCheckedAt) || 0 : 0)));
      lastCheck = newest ? new Date(newest).toISOString() : null;
      probe = newest > now - STALE_AFTER_HOURS * HOUR ? "ok" : "behind";
    }
  }

  const changes = recent.data ?? [];
  return {
    engineOn,
    total,
    waiting,
    notFound,
    stopped,
    changes7d: changes.length,
    unemailed: changes.filter((c) => c.current_status && c.current_status !== c.alerted_status).length,
    lastCheck,
    probe,
    checkerDown: probe === "behind" || probe === "no-answer",
  };
}

export type ProblemCase = {
  id: string;
  user_id: string;
  receipt_number: string;
  form_type: string | null;
  created_at: string;
  last_checked_at: string | null;
  email: string | null;
};

/** Up to 50 cases of one problem kind, with the account email so you can open the account. */
export async function problemCases(db: SupabaseClient, kind: "waiting" | "notFound" | "stopped", now = Date.now()): Promise<ProblemCase[]> {
  let q = db.from("cases").select("id, user_id, receipt_number, form_type, created_at, last_checked_at");
  if (kind === "waiting") q = q.is("engine_registered_at", null).lt("created_at", iso(REGISTER_GRACE_HOURS * HOUR, now));
  if (kind === "notFound") q = q.eq("uscis_not_found", true).eq("checks_stopped", false);
  if (kind === "stopped") q = q.eq("checks_stopped", true);
  const { data } = await q.order("created_at", { ascending: true }).limit(50);
  const rows = data ?? [];
  const ids = [...new Set(rows.map((r) => r.user_id as string))];
  const { data: profiles } = ids.length ? await db.from("profiles").select("user_id, email").in("user_id", ids) : { data: [] };
  const emailOf = new Map((profiles ?? []).map((p) => [p.user_id as string, p.email as string | null]));
  return rows.map((r) => ({ ...(r as Omit<ProblemCase, "email">), email: emailOf.get(r.user_id as string) ?? null }));
}
