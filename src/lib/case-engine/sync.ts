import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { caseEngineEnabled, engine, type EngineCase } from "@/lib/case-engine/client";

export type SyncedCase = {
  id: string;
  user_id: string;
  receipt_number: string;
  current_status: string | null;
  alerted_status: string | null;
  engine_registered_at: string | null;
};

export const SYNC_COLUMNS = "id, user_id, receipt_number, current_status, alerted_status, engine_registered_at";

/**
 * Copies what the engine knows about one case onto our row. A first status is marked as
 * already alerted, so people are only emailed about real changes, never the first reading.
 */
export async function applyEngineStatus(admin: SupabaseClient, row: SyncedCase, remote: EngineCase) {
  const update: Record<string, unknown> = {};
  if (!row.engine_registered_at) update.engine_registered_at = new Date().toISOString();
  if (remote.lastCheckedAt) update.last_checked_at = remote.lastCheckedAt;
  if (remote.status) {
    update.current_status = remote.status;
    update.status_description = remote.description;
    update.status_history = remote.history ?? [];
    if (row.current_status === null) {
      update.alerted_status = remote.status;
    } else if (row.current_status !== remote.status) {
      update.status_changed_at = remote.statusChangedAt ?? new Date().toISOString();
    }
  }
  if (Object.keys(update).length === 0) return row;
  const { data, error } = await admin.from("cases").update(update).eq("id", row.id).select(SYNC_COLUMNS).maybeSingle<SyncedCase>();
  if (error) throw new Error("Could not save the case status");
  return data ?? row;
}

/**
 * Makes the engine's list for one account match its saved cases: registers new receipt
 * numbers (which also fetches their first status), removes ones the person deleted, and
 * copies the latest statuses across. Safe to run any number of times.
 */
export async function syncUserCases(userId: string) {
  const admin = createAdminClient();
  if (!admin || !caseEngineEnabled()) return { synced: false as const };

  const { data: rows, error } = await admin.from("cases").select(SYNC_COLUMNS).eq("user_id", userId).returns<SyncedCase[]>();
  if (error) throw new Error("Could not read saved cases");
  const remote = await engine.list(userId);
  const remoteByReceipt = new Map(remote.map((c) => [c.receiptNumber, c]));
  const saved = new Set((rows ?? []).map((r) => r.receipt_number));

  for (const extra of remote) {
    if (!saved.has(extra.receiptNumber)) await engine.remove(userId, extra.receiptNumber);
  }
  for (const row of rows ?? []) {
    const known = remoteByReceipt.get(row.receipt_number) ?? (await engine.add(userId, row.receipt_number));
    await applyEngineStatus(admin, row, known);
  }
  return { synced: true as const };
}
