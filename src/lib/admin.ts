/**
 * Who may use /admin, checked on the server for every page and every action:
 * 1. signed in (the token is checked with Supabase, not just read from the cookie),
 * 2. listed in public.admins (only SQL in the Supabase dashboard can add someone),
 * 3. signed in with a second step (an authenticator-app code) in this session.
 * Anyone who fails step 2 gets a 404, so the admin area isn't advertised.
 */
import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type AdminGate = { state: "ok"; userId: string; email: string } | { state: "mfa-setup" | "mfa-code"; email: string };

type Check = AdminGate | { state: "signed-out" } | { state: "not-admin" };

async function check(): Promise<Check> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { state: "signed-out" };
  const admin = createAdminClient();
  if (!admin) return { state: "not-admin" };
  const { data } = await admin.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!data) return { state: "not-admin" };
  const email = user.email ?? "";
  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (aal?.currentLevel === "aal2") return { state: "ok", userId: user.id, email };
  return { state: aal?.nextLevel === "aal2" ? "mfa-code" : "mfa-setup", email };
}

/** For admin pages (inside <Suspense>): sends signed-out visitors to sign in and everyone else who isn't an admin to a 404. */
export const adminGate = cache(async (next = "/admin"): Promise<AdminGate> => {
  await connection();
  const result = await check();
  if (result.state === "signed-out") redirect(`/sign-in?next=${encodeURIComponent(next)}`);
  if (result.state === "not-admin") notFound();
  return result;
});

/** For admin server actions: the admin, or null when the caller may not act. */
export async function requireAdmin(): Promise<{ userId: string; email: string } | null> {
  const result = await check();
  return result.state === "ok" ? { userId: result.userId, email: result.email } : null;
}

/** Records one admin change. Never throws: a failed log line shouldn't undo the change. */
export async function audit(
  adminId: string,
  action: string,
  target: { type: "lawyer" | "review"; id: string },
  details: Record<string, unknown> = {},
) {
  const admin = createAdminClient();
  if (!admin) return;
  const { error } = await admin.from("admin_audit").insert({ admin_id: adminId, action, target_type: target.type, target_id: target.id, details });
  if (error) console.error("Admin audit write failed:", error.message);
}

export const LAWYER_STATUSES = ["new", "verified", "listed", "rejected", "withdrawn"] as const;
export type LawyerStatus = (typeof LAWYER_STATUSES)[number];
export const LAWYER_STATUS_LABEL: Record<LawyerStatus, string> = {
  new: "New",
  verified: "License checked",
  listed: "Listed",
  rejected: "Rejected",
  withdrawn: "Unlisted",
};

export const REVIEW_STATUSES = ["pending", "published", "rejected"] as const;
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];
