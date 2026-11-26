import { Suspense } from "react";
import Link from "next/link";
import { AdminButton } from "@/components/admin/AdminControls";
import { AdminOnly } from "@/components/admin/AdminOnly";
import { Stars } from "@/components/lawyers/LawyerBits";
import { REVIEW_STATUSES, type ReviewStatus } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { appCard, appLink, appTitle, focusRing } from "@/lib/ui";
import { deleteReview, setReviewStatus } from "../actions";

export const metadata = { title: "Reviews" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const LABEL: Record<ReviewStatus, string> = { pending: "Waiting", published: "Published", rejected: "Rejected" };
const when = (iso: string) =>
  new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", timeZone: "America/New_York" });

async function ReviewList({ searchParams }: { searchParams: PageProps<"/admin/reviews">["searchParams"] }) {
  const sp = await searchParams;
  const raw = sp.status;
  const status: ReviewStatus = typeof raw === "string" && (REVIEW_STATUSES as readonly string[]).includes(raw) ? (raw as ReviewStatus) : "pending";
  const lawyerId = typeof sp.lawyer === "string" && UUID.test(sp.lawyer) ? sp.lawyer : null;
  const db = createAdminClient()!;
  let q = db
    .from("lawyer_reviews")
    .select("id, created_at, lawyer_id, user_id, rating, body, relationship, reviewer_name, status, admin_note, lawyer_applications(full_name, slug, email)")
    .eq("status", status)
    .order("created_at", { ascending: status === "pending" })
    .limit(300);
  if (lawyerId) q = q.eq("lawyer_id", lawyerId);
  const [{ data, error }, lawyer] = await Promise.all([
    q,
    lawyerId ? db.from("lawyer_applications").select("full_name").eq("id", lawyerId).maybeSingle().then((r) => r.data) : null,
  ]);
  const href = (t: ReviewStatus) => `/admin/reviews?status=${t}${lawyerId ? `&lawyer=${lawyerId}` : ""}`;
  const reviews = (data ?? []) as unknown as {
    id: string;
    created_at: string;
    lawyer_id: string;
    user_id: string;
    rating: number;
    body: string;
    relationship: string;
    reviewer_name: string;
    admin_note: string | null;
    lawyer_applications: { full_name: string; slug: string; email: string } | null;
  }[];

  // The reviewer's account email helps spot a lawyer reviewing themselves. Admin-only.
  const ids = [...new Set(reviews.map((r) => r.user_id))];
  const { data: profiles } = ids.length ? await db.from("profiles").select("user_id, email").in("user_id", ids) : { data: [] };
  const emailOf = new Map((profiles ?? []).map((p) => [p.user_id as string, (p.email as string | null) ?? ""]));

  return (
    <div className="flex flex-col gap-5">
      <h1 className={appTitle}>Reviews</h1>
      {lawyerId && (
        <p className="text-small text-midnight">
          Only reviews of{" "}
          <Link href={`/admin/lawyers/${lawyerId}`} className={`${appLink} font-semibold`}>
            {lawyer?.full_name ?? "this lawyer"}
          </Link>
          {" · "}
          <Link href={`/admin/reviews?status=${status}`} className={appLink}>
            Show every lawyer
          </Link>
        </p>
      )}
      <p className="text-small text-slate">
        Publish a review if it follows the{" "}
        <a href="/advertising#reviews" target="_blank" rel="noopener noreferrer" className={appLink}>
          review rules
        </a>
        , even when it&apos;s negative. Reject it only when it breaks a rule.
      </p>
      <nav aria-label="Filter by status" className="flex flex-wrap gap-1">
        {REVIEW_STATUSES.map((t) => (
          <Link
            key={t}
            href={href(t)}
            aria-current={t === status ? "page" : undefined}
            className={`inline-flex h-9 items-center rounded-md border px-3 text-small font-medium ${t === status ? "border-blue bg-ice text-blue" : "border-border bg-white text-slate hover:text-midnight"} ${focusRing}`}
          >
            {LABEL[t]}
          </Link>
        ))}
      </nav>
      {error && <p className="text-small text-red">Couldn&apos;t load reviews: {error.message}</p>}
      {reviews.length === 0 && <p className={`${appCard} p-6 text-center text-small text-slate`}>Nothing here.</p>}
      <ul className="flex flex-col gap-3">
        {reviews.map((r) => {
          const reviewerEmail = emailOf.get(r.user_id) ?? "";
          const sameEmail = reviewerEmail && r.lawyer_applications?.email && reviewerEmail.toLowerCase() === r.lawyer_applications.email.toLowerCase();
          return (
            <li key={r.id} className={`${appCard} p-4 sm:p-5`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Link href={`/admin/lawyers/${r.lawyer_id}`} className={`${appLink} font-semibold`}>
                  {r.lawyer_applications?.full_name ?? "Unknown lawyer"}
                </Link>
                <span className="text-small text-slate tabular-nums">{when(r.created_at)}</span>
              </div>
              <div className="mt-2">
                <Stars value={r.rating} />
              </div>
              <p className="mt-2 text-small whitespace-pre-line text-midnight">{r.body}</p>
              <p className="mt-2 text-small text-slate">
                {r.reviewer_name} · {r.relationship === "client" ? "Hired them" : "Had a consultation"} · account {reviewerEmail || "unknown"}
              </p>
              {sameEmail && <p className="mt-1 text-small font-semibold text-red">The reviewer uses the lawyer&apos;s own email.</p>}
              {status === "rejected" && <p className="mt-1 text-small text-slate">Why it was rejected: {r.admin_note ?? "no reason saved"}</p>}
              <div className="mt-3 flex flex-wrap gap-2">
                {status !== "published" && <AdminButton action={setReviewStatus.bind(null, r.id, "published")} label="Publish" tone="primary" />}
                {status !== "rejected" && <AdminButton action={setReviewStatus.bind(null, r.id, "rejected")} label="Reject" reason="Which rule does it break? (private, the reviewer doesn't see it)" />}
                {status !== "pending" && <AdminButton action={setReviewStatus.bind(null, r.id, "pending")} label="Move back to waiting" />}
                <AdminButton action={deleteReview.bind(null, r.id)} label="Delete" tone="danger" confirm="Delete this review for good? The reviewer could write a new one." />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function AdminReviews({ searchParams }: PageProps<"/admin/reviews">) {
  return (
    <Suspense fallback={<div className="skeleton h-64 rounded-xl" />}>
      <AdminOnly next="/admin/reviews">
        <ReviewList searchParams={searchParams} />
      </AdminOnly>
    </Suspense>
  );
}
