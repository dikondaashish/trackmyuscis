"use server";

import { createClient } from "@/lib/supabase/server";
import { applyEngineStatus, SYNC_COLUMNS, syncUserCases, type SyncedCase } from "@/lib/case-engine/sync";
import { caseEngineEnabled, engine } from "@/lib/case-engine/client";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Called by the browser after the person adds or removes a case. Registers new receipt
 * numbers with the status checker (and saves their first status) and drops removed ones.
 * Never throws: the case itself is already saved, and the dashboard retries later.
 */
export async function syncMyCases(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  try {
    await syncUserCases(user.id);
  } catch (error) {
    console.error("Case sync failed:", error instanceof Error ? error.message : "unknown error");
  }
}

export type RecheckResult = "found" | "not-found" | "too-soon" | "failed";

/**
 * "Check again" for a receipt number USCIS didn't recognize: one more lookup, which the
 * case engine allows at most hourly per case. Only for the person's own cases.
 */
export async function recheckMyCase(caseId: string): Promise<RecheckResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const admin = createAdminClient();
  if (!user || !admin || !caseEngineEnabled() || !/^[0-9a-f-]{36}$/i.test(caseId)) return "failed";
  // Read through row-level security first, so only the owner's case is touched.
  const { data: mine } = await supabase.from("cases").select("id").eq("id", caseId).maybeSingle();
  if (!mine) return "failed";
  const { data: row } = await admin.from("cases").select(SYNC_COLUMNS).eq("id", caseId).maybeSingle<SyncedCase>();
  if (!row || !row.uscis_not_found) return "failed";
  try {
    const { case: remote, rechecked } = await engine.recheck(user.id, row.receipt_number);
    const saved = await applyEngineStatus(admin, row, remote);
    if (!rechecked) return "too-soon";
    return saved.uscis_not_found ? "not-found" : "found";
  } catch {
    return "failed";
  }
}
