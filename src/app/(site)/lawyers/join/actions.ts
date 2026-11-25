"use server";

import { randomUUID } from "node:crypto";
import { POLICY_VERSION } from "@/lib/auth";
import { COMPANY } from "@/lib/company";
import {
  cleanApplication,
  CONSULTATION_MODES,
  DIRECTORY,
  lines,
  PRACTICE_AREAS,
  slugify,
  validateApplication,
  type ApplicationErrors,
  type ConsultationPrice,
  type LawyerApplication,
} from "@/lib/directory";
import { detectType, EXTENSION_FOR } from "@/lib/documents/file-check";
import { emailEnabled, sendEmail } from "@/lib/email/send";
import { LAWYER_PHOTO_BUCKET, LAWYER_PHOTO_MAX_BYTES } from "@/lib/lawyer-photo";
import { createAdminClient } from "@/lib/supabase/admin";

export type JoinResult = { ok: true } | { ok: false; message: string; errors?: ApplicationErrors & { photo?: string } };

const UNAVAILABLE = `We couldn't save your application just now. Please try again in a few minutes, or email ${COMPANY.email.support}.`;
/** A ceiling on new applications an hour, so a script can't flood the table. */
const HOURLY_LIMIT = 40;

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

/** Reads the posted application without trusting any of its types. */
function readApplication(json: unknown): LawyerApplication | null {
  if (!json || typeof json !== "object") return null;
  const input = json as Record<string, unknown>;
  const text = (v: unknown) => (typeof v === "string" ? v.slice(0, 4000) : "");
  const list = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string").slice(0, 12) : []);
  const price: ConsultationPrice = input.consultationPrice === "free" || input.consultationPrice === "paid" ? input.consultationPrice : "ask";
  return {
    role: input.role === "accredited_representative" ? "accredited_representative" : "attorney",
    fullName: text(input.fullName),
    firmName: text(input.firmName),
    email: text(input.email),
    phone: text(input.phone),
    website: text(input.website),
    barState: text(input.barState),
    barNumber: text(input.barNumber),
    officeStreet: text(input.officeStreet),
    officeCity: text(input.officeCity),
    officeState: text(input.officeState),
    officeZip: text(input.officeZip),
    languages: text(input.languages),
    practiceAreas: list(input.practiceAreas),
    consultationModes: list(input.consultationModes),
    consultationPrice: price,
    consultationFee: text(input.consultationFee),
    licensedSince: text(input.licensedSince),
    education: text(input.education),
    career: text(input.career),
    bio: text(input.bio),
    accurate: input.accurate === true,
    agreed: input.agreed === true,
  };
}

/** A page address no one else has: the plain one, or the plain one with -2, -3… */
async function uniqueSlug(admin: NonNullable<ReturnType<typeof createAdminClient>>, a: LawyerApplication) {
  const base = slugify(`${a.fullName} ${a.officeCity} ${a.officeState}`) || "lawyer";
  const { data } = await admin.from("lawyer_applications").select("slug").like("slug", `${base}%`).limit(200);
  const taken = new Set((data ?? []).map((r) => r.slug as string));
  if (!taken.has(base)) return base;
  for (let n = 2; n < 200; n++) if (!taken.has(`${base}-${n}`)) return `${base}-${n}`;
  return `${base}-${randomUUID().slice(0, 6)}`;
}

/**
 * Saves a lawyer's application to the directory. Anyone can call this, so everything is
 * validated again here, the photo is checked from its own bytes, a hidden field catches simple
 * bots, repeat submissions from one email are ignored for a day and there is an hourly ceiling.
 * Nothing is listed automatically: a person checks the license first.
 */
export async function submitLawyerApplication(form: FormData): Promise<JoinResult> {
  // The trap field is hidden from people; a filled one is a bot. Answer as if it worked.
  const trap = form.get("trap");
  if (typeof trap === "string" && trap.trim() !== "") return { ok: true };

  let parsed: unknown = null;
  try {
    parsed = JSON.parse(String(form.get("application") ?? ""));
  } catch {
    return { ok: false, message: UNAVAILABLE };
  }
  const raw = readApplication(parsed);
  if (!raw) return { ok: false, message: UNAVAILABLE };
  const errors = validateApplication(raw);

  // The photo is optional. The browser has already shrunk it; check the real bytes here.
  const photo = form.get("photo");
  let photoBytes: Uint8Array | null = null;
  let photoType: ReturnType<typeof detectType> = null;
  if (photo instanceof File && photo.size > 0) {
    photoBytes = new Uint8Array(await photo.arrayBuffer());
    photoType = detectType(photoBytes);
    if (photo.size > LAWYER_PHOTO_MAX_BYTES || !photoType || photoType === "application/pdf") photoBytes = null;
    if (!photoBytes) return { ok: false, message: "Please fix the fields marked below.", errors: { ...errors, photo: "Use a JPG, PNG or WebP photo." } };
  }
  if (Object.keys(errors).length > 0) return { ok: false, message: "Please fix the fields marked below.", errors };
  const a = cleanApplication(raw);

  const admin = createAdminClient();
  if (!admin) return { ok: false, message: UNAVAILABLE };

  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const [recent, mine] = await Promise.all([
    admin.from("lawyer_applications").select("id", { count: "exact", head: true }).gte("created_at", hourAgo),
    admin.from("lawyer_applications").select("id", { count: "exact", head: true }).eq("email", a.email).gte("created_at", dayAgo),
  ]);
  if (recent.error || mine.error) {
    console.error("Lawyer application check failed:", recent.error?.message ?? mine.error?.message);
    return { ok: false, message: UNAVAILABLE };
  }
  // Already applied today with this email: nothing new to save.
  if ((mine.count ?? 0) > 0) return { ok: true };
  if ((recent.count ?? 0) >= HOURLY_LIMIT) return { ok: false, message: UNAVAILABLE };

  let photoPath: string | null = null;
  if (photoBytes && photoType && photoType !== "application/pdf") {
    photoPath = `${randomUUID()}.${EXTENSION_FOR[photoType]}`;
    const { error } = await admin.storage.from(LAWYER_PHOTO_BUCKET).upload(photoPath, photoBytes, { contentType: photoType, upsert: false });
    if (error) {
      console.error("Lawyer photo upload failed:", error.message);
      return { ok: false, message: UNAVAILABLE };
    }
  }

  const { error } = await admin.from("lawyer_applications").insert({
    slug: await uniqueSlug(admin, a),
    role: a.role,
    full_name: a.fullName,
    firm_name: a.firmName,
    email: a.email,
    phone: a.phone,
    website: a.website || null,
    bar_state: a.barState || null,
    bar_number: a.barNumber || null,
    photo_path: photoPath,
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
    policy_version: POLICY_VERSION,
    quoted_annual_fee: DIRECTORY.annualFee,
  });
  if (error) {
    console.error("Lawyer application insert failed:", error.message);
    if (photoPath) await admin.storage.from(LAWYER_PHOTO_BUCKET).remove([photoPath]);
    return { ok: false, message: UNAVAILABLE };
  }

  // Tell ourselves, when email is set up. The application is saved either way.
  if (emailEnabled()) {
    const label = (list: readonly { value: string; label: string }[], values: string[]) =>
      values.map((v) => list.find((p) => p.value === v)?.label ?? v).join(", ");
    const out = [
      `${a.fullName} (${a.role === "attorney" ? "attorney" : "DOJ-accredited representative"})`,
      a.firmName,
      [a.officeStreet, `${a.officeCity}, ${a.officeState} ${a.officeZip}`.trim()].filter(Boolean).join(", "),
      a.role === "attorney" ? `Bar: ${a.barState} ${a.barNumber}` : "Check the DOJ roster",
      `${a.email} · ${a.phone}${a.website ? ` · ${a.website}` : ""}`,
      `Languages: ${a.languages}`,
      `Cases: ${label(PRACTICE_AREAS, a.practiceAreas)}`,
      `Consultations: ${label(CONSULTATION_MODES, a.consultationModes)}; first one ${a.consultationPrice === "free" ? "free" : a.consultationPrice === "paid" ? `$${a.consultationFee}` : "not listed"}`,
      photoPath ? "Photo: yes" : "Photo: none",
      "",
      a.bio,
    ];
    try {
      await sendEmail({
        to: COMPANY.email.support,
        subject: `Lawyer directory application: ${a.fullName}, ${a.officeCity} ${a.officeState}`,
        text: out.join("\n"),
        html: out.map((l) => `<p>${esc(l) || "&nbsp;"}</p>`).join(""),
      });
    } catch (e) {
      console.error("Lawyer application email failed:", e instanceof Error ? e.message : "unknown error");
    }
  }
  return { ok: true };
}
