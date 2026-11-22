"use server";

import { createClient } from "@/lib/supabase/server";
import { syncUserCases } from "@/lib/case-engine/sync";

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
