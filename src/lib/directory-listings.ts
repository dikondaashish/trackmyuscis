/**
 * The public lawyer directory: applications whose status is "listed", and their published
 * reviews. Server only.
 *
 * Only the columns shown on the site are read. Email, bar number and review notes never leave
 * the database. Cached so the pages stay prerendered; with the "minutes" profile a change in the
 * table shows up within a minute or two of the next visit.
 */
import { cacheLife, cacheTag } from "next/cache";
import type { ApplicantRole } from "@/lib/directory";
import { lawyerPhotoUrl } from "@/lib/lawyer-photo";
import { createAdminClient } from "@/lib/supabase/admin";

export type Rating = { average: number; count: number };

/** Cache tag on every directory read. */
export const LAWYERS_TAG = "lawyers";

export type Listing = {
  slug: string;
  role: ApplicantRole;
  fullName: string;
  firmName: string;
  phone: string;
  website: string | null;
  photoUrl: string | null;
  /** The state bar we checked, for attorneys. */
  barState: string | null;
  licensedSince: number | null;
  /** ISO date we last checked the license or accreditation, when recorded. */
  licenseCheckedOn: string | null;
  officeStreet: string | null;
  officeCity: string;
  officeState: string;
  officeZip: string | null;
  languages: string;
  practiceAreas: string[];
  consultationModes: string[];
  freeConsultation: boolean;
  consultationFee: number | null;
  education: string[];
  career: string[];
  bio: string;
  /** ISO date the listing last changed, for the sitemap. */
  updated: string;
  /** From published reviews only; null when there are none. */
  rating: Rating | null;
};

export type Review = {
  rating: number;
  body: string;
  relationship: "client" | "consultation";
  reviewerName: string;
  /** ISO date. */
  date: string;
};

const PUBLIC_COLUMNS = [
  "id", "slug", "role", "full_name", "firm_name", "phone", "website", "photo_path", "bar_state", "licensed_since",
  "license_checked_on", "office_street", "office_city", "office_state", "office_zip", "languages", "practice_areas",
  "consultation_modes", "free_consultation", "consultation_fee", "education", "career", "bio", "updated_at",
].join(", ");

type Row = {
  id: string;
  slug: string;
  role: string;
  full_name: string;
  firm_name: string;
  phone: string;
  website: string | null;
  photo_path: string | null;
  bar_state: string | null;
  licensed_since: number | null;
  license_checked_on: string | null;
  office_street: string | null;
  office_city: string;
  office_state: string;
  office_zip: string | null;
  languages: string;
  practice_areas: string[] | null;
  consultation_modes: string[] | null;
  free_consultation: boolean;
  consultation_fee: number | null;
  education: string[] | null;
  career: string[] | null;
  bio: string;
  updated_at: string;
};

function toListing(r: Row, rating: Rating | null): Listing {
  return {
    slug: r.slug,
    role: r.role === "accredited_representative" ? "accredited_representative" : "attorney",
    fullName: r.full_name,
    firmName: r.firm_name,
    phone: r.phone,
    // The table only accepts http(s) addresses; checked again so nothing else can become a link.
    website: r.website && /^https?:\/\//i.test(r.website) ? r.website : null,
    photoUrl: lawyerPhotoUrl(r.photo_path),
    barState: r.bar_state,
    licensedSince: r.licensed_since,
    licenseCheckedOn: r.license_checked_on,
    officeStreet: r.office_street,
    officeCity: r.office_city,
    officeState: r.office_state,
    officeZip: r.office_zip,
    languages: r.languages,
    practiceAreas: r.practice_areas ?? [],
    consultationModes: r.consultation_modes ?? [],
    freeConsultation: r.free_consultation,
    consultationFee: r.consultation_fee,
    education: r.education ?? [],
    career: r.career ?? [],
    bio: r.bio,
    updated: r.updated_at.slice(0, 10),
    rating,
  };
}

/** Every listed lawyer with their rating, ordered by state, city and name. Empty when the database can't be read. */
export async function listedLawyers(): Promise<Listing[]> {
  "use cache";
  cacheLife("minutes");
  // Admin changes call updateTag(LAWYERS_TAG), so they show at once instead of within a minute.
  cacheTag(LAWYERS_TAG);
  const admin = createAdminClient();
  if (!admin) return [];
  const { data, error } = await admin
    .from("lawyer_applications")
    .select(PUBLIC_COLUMNS)
    .eq("status", "listed")
    .order("office_state")
    .order("office_city")
    .order("full_name")
    .limit(1000);
  if (error) {
    console.error("Lawyer listings could not be read:", error.message);
    return [];
  }
  const rows = (data ?? []) as unknown as Row[];
  if (rows.length === 0) return [];

  const ratings = new Map<string, { sum: number; count: number }>();
  const { data: reviews, error: reviewError } = await admin
    .from("lawyer_reviews")
    .select("lawyer_id, rating")
    .eq("status", "published")
    .in("lawyer_id", rows.map((r) => r.id));
  if (reviewError) console.error("Lawyer ratings could not be read:", reviewError.message);
  for (const r of (reviews ?? []) as { lawyer_id: string; rating: number }[]) {
    const s = ratings.get(r.lawyer_id) ?? { sum: 0, count: 0 };
    ratings.set(r.lawyer_id, { sum: s.sum + r.rating, count: s.count + 1 });
  }
  return rows.map((r) => {
    const s = ratings.get(r.id);
    return toListing(r, s ? { average: Math.round((s.sum / s.count) * 10) / 10, count: s.count } : null);
  });
}

export async function getListing(slug: string) {
  return (await listedLawyers()).find((l) => l.slug === slug);
}

/** Published reviews of one listed lawyer, newest first. */
export async function lawyerReviews(slug: string): Promise<Review[]> {
  "use cache";
  cacheLife("minutes");
  // Admin changes call updateTag(LAWYERS_TAG), so they show at once instead of within a minute.
  cacheTag(LAWYERS_TAG);
  const admin = createAdminClient();
  if (!admin) return [];
  const { data: lawyer } = await admin.from("lawyer_applications").select("id").eq("slug", slug).eq("status", "listed").maybeSingle();
  if (!lawyer) return [];
  const { data, error } = await admin
    .from("lawyer_reviews")
    .select("rating, body, relationship, reviewer_name, created_at")
    .eq("lawyer_id", lawyer.id)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) {
    console.error("Lawyer reviews could not be read:", error.message);
    return [];
  }
  return (data ?? []).map((r) => ({
    rating: r.rating as number,
    body: r.body as string,
    relationship: r.relationship === "client" ? "client" : "consultation",
    reviewerName: r.reviewer_name as string,
    date: (r.created_at as string).slice(0, 10),
  }));
}
