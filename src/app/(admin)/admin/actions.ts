"use server";

import { randomUUID } from "node:crypto";
import { updateTag } from "next/cache";
import { audit, LAWYER_STATUSES, requireAdmin, REVIEW_STATUSES, type LawyerStatus, type ReviewStatus } from "@/lib/admin";
import { COMPANY } from "@/lib/company";
import { cleanApplication, lines, validateApplication, type ApplicationErrors, type LawyerApplication } from "@/lib/directory";
import { LAWYERS_TAG } from "@/lib/directory-listings";
import { detectType, EXTENSION_FOR } from "@/lib/documents/file-check";
import { emailEnabled, sendEmail } from "@/lib/email/send";
import { LAWYER_PHOTO_BUCKET, LAWYER_PHOTO_MAX_BYTES } from "@/lib/lawyer-photo";
import { createAdminClient } from "@/lib/supabase/admin";

export type AdminResult = { ok: true; message?: string } | { ok: false; message: string; errors?: ApplicationErrors };

const NOT_ALLOWED: AdminResult = { ok: false, message: "Your admin session has ended. Reload the page and sign in again." };
const FAILED: AdminResult = { ok: false, message: "That didn't save. Try again, and check the Supabase logs if it keeps failing." };
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const today = () => new Date().toISOString().slice(0, 10);

async function lawyerById(id: string) {
  const db = createAdminClient();
  if (!db || !UUID.test(id)) return null;
  const { data } = await db.from("lawyer_applications").select("*").eq("id", id).maybeSingle();
  return data;
}

/** Tells the lawyer their profile is live, when email is set up. Never blocks the change. */
async function emailListed(row: { email: string; full_name: string; slug: string }) {
  if (!emailEnabled()) return false;
  const url = `${COMPANY.siteUrl}/lawyers/${row.slug}`;
  const text = [
    `Hello ${row.full_name},`,
    "",
    "We've checked your license and your TrackMyUSCIS profile is now live:",
    url,
    "",
    `To change or remove anything on it, reply to this email or write to ${COMPANY.email.support}.`,
    "",
    "TrackMyUSCIS",
  ].join("\n");
  try {
    await sendEmail({
      to: row.email,
      subject: "Your TrackMyUSCIS profile is live",
      text,
      html: text
        .split("\n")
        .map((l) => (l.startsWith("http") ? `<p><a href="${l}">${l}</a></p>` : `<p>${l.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]!) || "&nbsp;"}</p>`))
        .join(""),
    });
    return true;
  } catch (e) {
    console.error("Listing email failed:", e instanceof Error ? e.message : "unknown error");
    return false;
  }
}

/**
 * Moves an application along: license checked, listed, rejected or unlisted (withdrawn).
 * Listing records today as the license-check date if none was recorded.
 */
export async function setLawyerStatus(id: string, status: LawyerStatus, reason?: string): Promise<AdminResult> {
  const me = await requireAdmin();
  if (!me) return NOT_ALLOWED;
  if (!LAWYER_STATUSES.includes(status)) return FAILED;
  const row = await lawyerById(id);
  if (!row) return { ok: false, message: "That application no longer exists." };
  const db = createAdminClient()!;
  const note = typeof reason === "string" ? reason.trim().slice(0, 1000) : "";
  const changes: Record<string, unknown> = { status };
  if ((status === "verified" || status === "listed") && !row.license_checked_on) changes.license_checked_on = today();
  if (status === "rejected" && note) changes.review_notes = [row.review_notes, `Rejected ${today()}: ${note}`].filter(Boolean).join("\n");
  const { error } = await db.from("lawyer_applications").update(changes).eq("id", id);
  if (error) {
    console.error("Lawyer status update failed:", error.message);
    return FAILED;
  }
  await audit(me.userId, `lawyer.${status}`, { type: "lawyer", id }, { from: row.status, ...(note ? { reason: note } : {}) });
  updateTag(LAWYERS_TAG);
  if (status === "listed" && row.status !== "listed") {
    const sent = await emailListed(row);
    return { ok: true, message: sent ? "Listed. We emailed the lawyer." : "Listed. Email isn't set up, so tell the lawyer yourself." };
  }
  return { ok: true };
}

/** Records the date the license was (re)checked, without changing anything else. */
export async function markLicenseChecked(id: string): Promise<AdminResult> {
  const me = await requireAdmin();
  if (!me) return NOT_ALLOWED;
  const row = await lawyerById(id);
  if (!row) return { ok: false, message: "That application no longer exists." };
  const { error } = await createAdminClient()!.from("lawyer_applications").update({ license_checked_on: today() }).eq("id", id);
  if (error) return FAILED;
  await audit(me.userId, "lawyer.license_checked", { type: "lawyer", id }, { date: today() });
  updateTag(LAWYERS_TAG);
  return { ok: true };
}

export async function saveLawyerNotes(id: string, notes: string): Promise<AdminResult> {
  const me = await requireAdmin();
  if (!me) return NOT_ALLOWED;
  if (!(await lawyerById(id))) return { ok: false, message: "That application no longer exists." };
  const text = typeof notes === "string" ? notes.slice(0, 4000) : "";
  const { error } = await createAdminClient()!.from("lawyer_applications").update({ review_notes: text.trim() || null }).eq("id", id);
  if (error) return FAILED;
  await audit(me.userId, "lawyer.notes_saved", { type: "lawyer", id });
  return { ok: true };
}

/** Edits the profile with the same rules as the application form. The page address stays the same. */
export async function updateLawyerProfile(id: string, input: LawyerApplication): Promise<AdminResult> {
  const me = await requireAdmin();
  if (!me) return NOT_ALLOWED;
  const row = await lawyerById(id);
  if (!row) return { ok: false, message: "That application no longer exists." };
  if (!input || typeof input !== "object") return FAILED;
  const raw = { ...input, accurate: true, agreed: true } as LawyerApplication;
  const errors = validateApplication(raw);
  if (Object.keys(errors).length > 0) return { ok: false, message: "Please fix the fields marked below.", errors };
  const a = cleanApplication(raw);
  const next = {
    role: a.role,
    full_name: a.fullName,
    firm_name: a.firmName,
    email: a.email,
    phone: a.phone,
    website: a.website || null,
    bar_state: a.barState || null,
    bar_number: a.barNumber || null,
    office_street: a.officeStreet || null,
    office_city: a.officeCity,
    office_state: a.officeState,
    office_zip: a.officeZip || null,
    languages: a.languages,
    practice_areas: a.practiceAreas,
    consultation_modes: a.consultationModes,
    free_consultation: a.consultationPrice === "free",
    consultation_fee: a.consultationPrice === "paid" ? Number(a.consultationFee) : null,
    licensed_since: a.licensedSince ? Number(a.licensedSince) : null,
    education: lines(a.education),
    career: lines(a.career),
    bio: a.bio,
  };
  const changed = Object.keys(next).filter((k) => JSON.stringify((row as Record<string, unknown>)[k] ?? null) !== JSON.stringify((next as Record<string, unknown>)[k] ?? null));
  if (changed.length === 0) return { ok: true, message: "Nothing changed." };
  const { error } = await createAdminClient()!.from("lawyer_applications").update(next).eq("id", id);
  if (error) {
    console.error("Lawyer profile update failed:", error.message);
    return FAILED;
  }
  await audit(me.userId, "lawyer.edited", { type: "lawyer", id }, { fields: changed });
  updateTag(LAWYERS_TAG);
  return { ok: true, message: "Saved." };
}

/** Replaces the photo (form field "photo", already cropped in the browser) or, with no file, removes it. */
export async function setLawyerPhoto(id: string, form: FormData): Promise<AdminResult> {
  const me = await requireAdmin();
  if (!me) return NOT_ALLOWED;
  const row = await lawyerById(id);
  if (!row) return { ok: false, message: "That application no longer exists." };
  const db = createAdminClient()!;
  let path: string | null = null;
  const photo = form.get("photo");
  if (photo instanceof File && photo.size > 0) {
    const bytes = new Uint8Array(await photo.arrayBuffer());
    const type = detectType(bytes);
    if (photo.size > LAWYER_PHOTO_MAX_BYTES || !type || type === "application/pdf") return { ok: false, message: "Use a JPG, PNG or WebP photo." };
    path = `${randomUUID()}.${EXTENSION_FOR[type]}`;
    const { error } = await db.storage.from(LAWYER_PHOTO_BUCKET).upload(path, bytes, { contentType: type, upsert: false });
    if (error) {
      console.error("Admin photo upload failed:", error.message);
      return FAILED;
    }
  }
  const { error } = await db.from("lawyer_applications").update({ photo_path: path }).eq("id", id);
  if (error) {
    if (path) await db.storage.from(LAWYER_PHOTO_BUCKET).remove([path]);
    return FAILED;
  }
  if (row.photo_path) await db.storage.from(LAWYER_PHOTO_BUCKET).remove([row.photo_path]);
  await audit(me.userId, path ? "lawyer.photo_replaced" : "lawyer.photo_removed", { type: "lawyer", id });
  updateTag(LAWYERS_TAG);
  return { ok: true };
}

/** Deletes an application, its photo and its reviews for good. */
export async function deleteLawyer(id: string): Promise<AdminResult> {
  const me = await requireAdmin();
  if (!me) return NOT_ALLOWED;
  const row = await lawyerById(id);
  if (!row) return { ok: true };
  const db = createAdminClient()!;
  const { error } = await db.from("lawyer_applications").delete().eq("id", id);
  if (error) return FAILED;
  if (row.photo_path) await db.storage.from(LAWYER_PHOTO_BUCKET).remove([row.photo_path]);
  await audit(me.userId, "lawyer.deleted", { type: "lawyer", id }, { name: row.full_name, status: row.status });
  updateTag(LAWYERS_TAG);
  return { ok: true };
}

export async function setReviewStatus(id: string, status: ReviewStatus): Promise<AdminResult> {
  const me = await requireAdmin();
  if (!me) return NOT_ALLOWED;
  if (!UUID.test(id) || !REVIEW_STATUSES.includes(status)) return FAILED;
  const db = createAdminClient()!;
  const { data: row } = await db.from("lawyer_reviews").select("status").eq("id", id).maybeSingle();
  if (!row) return { ok: false, message: "That review no longer exists." };
  const { error } = await db.from("lawyer_reviews").update({ status }).eq("id", id);
  if (error) return FAILED;
  await audit(me.userId, `review.${status}`, { type: "review", id }, { from: row.status });
  updateTag(LAWYERS_TAG);
  return { ok: true };
}

export async function deleteReview(id: string): Promise<AdminResult> {
  const me = await requireAdmin();
  if (!me) return NOT_ALLOWED;
  if (!UUID.test(id)) return FAILED;
  const db = createAdminClient()!;
  const { data: row } = await db.from("lawyer_reviews").select("status, rating").eq("id", id).maybeSingle();
  if (!row) return { ok: true };
  const { error } = await db.from("lawyer_reviews").delete().eq("id", id);
  if (error) return FAILED;
  await audit(me.userId, "review.deleted", { type: "review", id }, { status: row.status, rating: row.rating });
  updateTag(LAWYERS_TAG);
  return { ok: true };
}
