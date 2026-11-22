import { createClient } from "@supabase/supabase-js";

/**
 * Supabase with the secret (service role) key, for server-only work that no signed-in
 * person may do themselves: writing case statuses and email preferences from the case
 * engine and the unsubscribe link. Never import this from a client component.
 * Returns null when SUPABASE_SECRET_KEY isn't set, so features that need it stay off.
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!key) return null;
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
