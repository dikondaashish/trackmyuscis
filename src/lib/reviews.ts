/** Lawyer review rules, shared by the form (browser) and the server action. */

export const REVIEW_MIN = 20;
export const REVIEW_MAX = 1000;
/** Reviews one account can send in a day, across all lawyers. */
export const REVIEWS_PER_DAY = 5;

export type ReviewInput = {
  rating: number;
  relationship: "client" | "consultation" | "";
  body: string;
  /** "This is my own experience and I'm not connected to this lawyer." */
  honest: boolean;
};

export type ReviewErrors = Partial<Record<keyof ReviewInput, string>>;

export function validateReview(r: ReviewInput): ReviewErrors {
  const errors: ReviewErrors = {};
  if (!Number.isInteger(r.rating) || r.rating < 1 || r.rating > 5) errors.rating = "Choose a rating from 1 to 5 stars.";
  if (r.relationship !== "client" && r.relationship !== "consultation") errors.relationship = "Tell us how you worked with this lawyer.";
  const body = r.body.trim();
  if (body.length < REVIEW_MIN) errors.body = `Write a little more: at least ${REVIEW_MIN} characters.`;
  else if (body.length > REVIEW_MAX) errors.body = `Keep it to ${REVIEW_MAX} characters.`;
  if (!r.honest) errors.honest = "Please confirm this is your own experience.";
  return errors;
}

/** "Maria" + "Lopez" → "Maria L."; nothing usable → "TrackMyUSCIS member". */
export function reviewerName(first: string | null | undefined, last: string | null | undefined) {
  const f = (first ?? "").trim().split(/\s+/)[0]?.slice(0, 30) ?? "";
  const l = (last ?? "").trim().slice(0, 1).toUpperCase();
  if (!f) return "TrackMyUSCIS member";
  return l ? `${f} ${l}.` : f;
}
