"use server";

import { COMPANY } from "@/lib/company";
import { emailEnabled, sendEmail } from "@/lib/email/send";
import { REVIEWS_PER_DAY, reviewerName, validateReview, type ReviewErrors, type ReviewInput } from "@/lib/reviews";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type ReviewResult = { ok: true } | { ok: false; message: string; errors?: ReviewErrors; signIn?: boolean };

const UNAVAILABLE = `We couldn't save your review just now. Please try again later, or email ${COMPANY.email.support}.`;

/**
 * Saves a review of a listed lawyer from a signed-in account. It is held as "pending" and only
 * appears after a person has checked it against the review rules. One review per lawyer per
 * account, a daily limit per account, and lawyers can't review their own profile.
 */
export async function submitLawyerReview(slug: string, input: ReviewInput): Promise<ReviewResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Please sign in to write a review.", signIn: true };

  if (typeof slug !== "string" || !/^[a-z0-9-]{3,120}$/.test(slug) || !input || typeof input !== "object") return { ok: false, message: UNAVAILABLE };
  const review: ReviewInput = {
    rating: Number(input.rating),
    relationship: input.relationship === "client" || input.relationship === "consultation" ? input.relationship : "",
    body: typeof input.body === "string" ? input.body.slice(0, 4000) : "",
    honest: input.honest === true,
  };
  const errors = validateReview(review);
  if (Object.keys(errors).length > 0) return { ok: false, message: "Please fix the fields marked below.", errors };

  const admin = createAdminClient();
  if (!admin) return { ok: false, message: UNAVAILABLE };

  const { data: lawyer } = await admin.from("lawyer_applications").select("id, email").eq("slug", slug).eq("status", "listed").maybeSingle();
  if (!lawyer) return { ok: false, message: "This profile isn't available any more." };
  if (user.email && lawyer.email && user.email.toLowerCase() === String(lawyer.email).toLowerCase())
    return { ok: false, message: "You can't review your own profile." };

  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count, error: countError } = await admin
    .from("lawyer_reviews")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", dayAgo);
  if (countError) return { ok: false, message: UNAVAILABLE };
  if ((count ?? 0) >= REVIEWS_PER_DAY) return { ok: false, message: "You've written several reviews today. Please try again tomorrow." };

  const { data: profile } = await admin.from("profiles").select("first_name, last_name").eq("user_id", user.id).maybeSingle();

  const { error } = await admin.from("lawyer_reviews").insert({
    lawyer_id: lawyer.id,
    user_id: user.id,
    rating: review.rating,
    relationship: review.relationship,
    body: review.body.trim(),
    reviewer_name: reviewerName(profile?.first_name, profile?.last_name),
  });
  if (error) {
    if (error.code === "23505") return { ok: false, message: "You've already reviewed this lawyer. Email us if you'd like to change your review." };
    console.error("Lawyer review insert failed:", error.message);
    return { ok: false, message: UNAVAILABLE };
  }
  // Tell ourselves a review is waiting, when email is set up.
  if (emailEnabled()) {
    const text = `A ${review.rating}-star review is waiting for a check: ${COMPANY.siteUrl}/admin/reviews?status=pending`;
    await sendEmail({ to: COMPANY.email.support, subject: "New lawyer review to check", text, html: `<p>${text}</p>` }).catch((e) =>
      console.error("Review notice email failed:", e instanceof Error ? e.message : "unknown error"),
    );
  }
  return { ok: true };
}
