import { cache } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { communityPhotoUrl } from "@/lib/community";

export type Account = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  /** Full name, or null when we don't have one. */
  name: string | null;
  initials: string;
  /** Random Reddit-style username (Calm-River-4821), set by the database at sign-up. */
  username: string | null;
  /** When the username may next be changed (once every 30 days), or null if it can change now. */
  usernameLockedUntil: string | null;
  /** Profile photo from Google, or null (then the avatar shows initials). */
  photoUrl: string | null;
  /** Optional, private, typed by the person in Settings (YYYY-MM-DD). Never from Google. */
  dateOfBirth: string | null;
  /**
   * The community profile: a display name, bio and photo kept apart from the real name and
   * Google photo above. The username belongs to it too. Not shown to anyone yet.
   */
  community: { name: string | null; bio: string | null; photoUrl: string | null; photoPath: string | null };
  /** Choices from Settings > Preferences. */
  preferences: { emailNotifications: boolean; publicProfile: boolean; showActivityStatus: boolean; documentReminders: boolean };
  /** True when the account signs in with Google (no password to manage here). */
  google: boolean;
  /**
   * "free" for everyone today. "premium" only when the server has set app_metadata.plan
   * (people can't change app_metadata themselves), ready for a paid plan later.
   */
  plan: "free" | "premium";
};

/**
 * The signed-in person, read once per request (the layout and the page share it).
 * Sends signed-out visitors to sign in. Request-time only, so call it inside <Suspense>.
 */
export const getAccount = cache(async (next = "/dashboard"): Promise<Account> => {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/sign-in?next=${encodeURIComponent(next)}`);

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name, email, username, username_changed_at, date_of_birth, community_name, community_bio, community_avatar_path, email_notifications, public_profile, show_activity_status, document_reminders")
    .eq("user_id", user.id)
    .maybeSingle();

  const meta = user.user_metadata ?? {};
  const firstName: string | null = profile?.first_name || meta.first_name || meta.given_name || null;
  const lastName: string | null = profile?.last_name || meta.last_name || meta.family_name || null;
  const email = profile?.email ?? user.email ?? "";
  const name = [firstName, lastName].filter(Boolean).join(" ") || meta.full_name || null;
  const initials =
    ((firstName?.[0] ?? "") + (lastName?.[0] ?? "")).toUpperCase() || email.slice(0, 1).toUpperCase() || "?";

  return {
    id: user.id,
    email,
    firstName,
    lastName,
    name,
    initials,
    username: profile?.username ?? null,
    usernameLockedUntil: lockedUntil(profile?.username_changed_at),
    photoUrl: googlePhoto(meta.avatar_url ?? meta.picture),
    dateOfBirth: profile?.date_of_birth ?? null,
    community: {
      name: profile?.community_name ?? null,
      bio: profile?.community_bio ?? null,
      photoUrl: communityPhotoUrl(profile?.community_avatar_path),
      photoPath: profile?.community_avatar_path ?? null,
    },
    preferences: {
      emailNotifications: profile?.email_notifications ?? true,
      publicProfile: profile?.public_profile ?? false,
      showActivityStatus: profile?.show_activity_status ?? false,
      documentReminders: profile?.document_reminders ?? true,
    },
    google: user.app_metadata?.provider === "google",
    plan: user.app_metadata?.plan === "premium" ? "premium" : "free",
  };
});

/** Only Google's own photo host, over https; anything else falls back to initials. */
function googlePhoto(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.endsWith(".googleusercontent.com") ? url.toString() : null;
  } catch {
    return null;
  }
}

const USERNAME_COOLDOWN_DAYS = 30;

/** The database allows one username change every 30 days; mirror it so the form can say when. */
function lockedUntil(changedAt: string | null | undefined): string | null {
  if (!changedAt) return null;
  const until = new Date(changedAt).getTime() + USERNAME_COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
  return until > Date.now() ? new Date(until).toISOString() : null;
}

