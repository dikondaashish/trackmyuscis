import type { SupabaseClient, User } from "@supabase/supabase-js";
import { POLICY_VERSION } from "@/lib/auth";

/**
 * The first Google sign-in creates the account: record that the person agreed to Terms and
 * Privacy (the text under the Google button on the sign-up page says so).
 */
export async function recordGoogleSignupConsent(supabase: SupabaseClient, user: User | null) {
  const isNew = user && Date.now() - new Date(user.created_at).getTime() < 60_000;
  if (!isNew || user.app_metadata?.provider !== "google") return;
  await supabase.from("policy_consents").insert([
    { policy: "terms", policy_version: POLICY_VERSION, method: "google_signup" },
    { policy: "privacy", policy_version: POLICY_VERSION, method: "google_signup" },
  ]);
}
