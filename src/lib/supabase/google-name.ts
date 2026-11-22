import type { SupabaseClient, User } from "@supabase/supabase-js";

const MAX = 80; // matches the profiles column checks

function clean(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const v = value.trim().replace(/\s+/g, " ").slice(0, MAX);
  return v || null;
}

/**
 * First and last name from a Google account. Supabase keeps only the full name, so we use
 * Google's given_name / family_name when the browser passed them on (Google's own button),
 * and otherwise split the full name at the first space.
 */
export function googleName(user: User): { first: string | null; last: string | null } {
  const meta = user.user_metadata ?? {};
  const first = clean(meta.given_name);
  const last = clean(meta.family_name);
  if (first || last) return { first, last };

  const full = clean(meta.full_name ?? meta.name);
  if (!full) return { first: null, last: null };
  const space = full.indexOf(" ");
  if (space === -1) return { first: full, last: null };
  return { first: clean(full.slice(0, space)), last: clean(full.slice(space + 1)) };
}

/**
 * People who sign in with Google never type their name, so fill the profile's first and last
 * name from Google. Only fills empty fields: a name someone has edited in Settings stays.
 */
export async function fillNameFromGoogle(supabase: SupabaseClient, user: User | null) {
  if (!user || !(user.app_metadata?.providers ?? [user.app_metadata?.provider]).includes("google")) return;

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!profile || (profile.first_name && profile.last_name)) return;

  const { first, last } = googleName(user);
  const update: { first_name?: string; last_name?: string } = {};
  if (!profile.first_name && first) update.first_name = first;
  if (!profile.last_name && last) update.last_name = last;
  if (Object.keys(update).length === 0) return;

  await supabase.from("profiles").update(update).eq("user_id", user.id);
}
