"use server";

import { POLICY_VERSION } from "@/lib/auth";
import { COMPANY } from "@/lib/company";
import { cleanApplication, DIRECTORY, PRACTICE_AREAS, validateApplication, type ApplicationErrors, type LawyerApplication } from "@/lib/directory";
import { emailEnabled, sendEmail } from "@/lib/email/send";
import { createAdminClient } from "@/lib/supabase/admin";

export type JoinResult = { ok: true } | { ok: false; message: string; errors?: ApplicationErrors };

const UNAVAILABLE = `We couldn't save your application just now. Please try again in a few minutes, or email ${COMPANY.email.support}.`;
/** A ceiling on new applications an hour, so a script can't flood the table. */
const HOURLY_LIMIT = 40;

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

/**
 * Saves a lawyer's application to the directory. Anyone can call this, so everything is
 * validated again here, a hidden field catches simple bots, repeat submissions from one
 * email are ignored for a day and there is an hourly ceiling. Nothing is listed
 * automatically: a person checks the license first.
 */
export async function submitLawyerApplication(input: LawyerApplication, trap: string): Promise<JoinResult> {
  // The trap field is hidden from people; a filled one is a bot. Answer as if it worked.
  if (typeof trap === "string" && trap.trim() !== "") return { ok: true };
  if (!input || typeof input !== "object") return { ok: false, message: UNAVAILABLE };

  const text = (v: unknown) => (typeof v === "string" ? v : "");
  const raw: LawyerApplication = {
    role: input.role === "accredited_representative" ? "accredited_representative" : "attorney",
    fullName: text(input.fullName),
    firmName: text(input.firmName),
    email: text(input.email),
    phone: text(input.phone),
    website: text(input.website),
    barState: text(input.barState),
    barNumber: text(input.barNumber),
    officeCity: text(input.officeCity),
    officeState: text(input.officeState),
    languages: text(input.languages),
    practiceAreas: Array.isArray(input.practiceAreas) ? input.practiceAreas.filter((v): v is string => typeof v === "string").slice(0, 12) : [],
    freeConsultation: input.freeConsultation === true,
    bio: text(input.bio),
    accurate: input.accurate === true,
    agreed: input.agreed === true,
  };
  const errors = validateApplication(raw);
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

  const { error } = await admin.from("lawyer_applications").insert({
    role: a.role,
    full_name: a.fullName,
    firm_name: a.firmName,
    email: a.email,
    phone: a.phone,
    website: a.website || null,
    bar_state: a.barState || null,
    bar_number: a.barNumber || null,
    office_city: a.officeCity,
    office_state: a.officeState,
    languages: a.languages,
    practice_areas: a.practiceAreas,
    free_consultation: a.freeConsultation,
    bio: a.bio,
    policy_version: POLICY_VERSION,
    quoted_annual_fee: DIRECTORY.annualFee,
  });
  if (error) {
    console.error("Lawyer application insert failed:", error.message);
    return { ok: false, message: UNAVAILABLE };
  }

  // Tell ourselves, when email is set up. The application is saved either way.
  if (emailEnabled()) {
    const areas = a.practiceAreas.map((v) => PRACTICE_AREAS.find((p) => p.value === v)?.label ?? v).join(", ");
    const lines = [
      `${a.fullName} (${a.role === "attorney" ? "attorney" : "DOJ-accredited representative"})`,
      a.firmName,
      `${a.officeCity}, ${a.officeState}`,
      a.role === "attorney" ? `Bar: ${a.barState} ${a.barNumber}` : "Check the DOJ roster",
      `${a.email} · ${a.phone}${a.website ? ` · ${a.website}` : ""}`,
      `Languages: ${a.languages}`,
      `Cases: ${areas}`,
      `Free first consultation: ${a.freeConsultation ? "yes" : "no"}`,
      "",
      a.bio,
    ];
    try {
      await sendEmail({
        to: COMPANY.email.support,
        subject: `Lawyer directory application: ${a.fullName}, ${a.officeCity} ${a.officeState}`,
        text: lines.join("\n"),
        html: lines.map((l) => `<p>${esc(l) || "&nbsp;"}</p>`).join(""),
      });
    } catch (e) {
      console.error("Lawyer application email failed:", e instanceof Error ? e.message : "unknown error");
    }
  }
  return { ok: true };
}
