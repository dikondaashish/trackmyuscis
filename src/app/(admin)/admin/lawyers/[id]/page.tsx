import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { AdminButton, LawyerEditForm, NotesForm, PhotoForm } from "@/components/admin/AdminControls";
import { AdminOnly } from "@/components/admin/AdminOnly";
import { areaLabel, stateName } from "@/components/lawyers/LawyerBits";
import { LAWYER_STATUS_LABEL, type LawyerStatus } from "@/lib/admin";
import { DOJ_ROSTER } from "@/lib/content";
import { CONSULTATION_MODES, type LawyerApplication } from "@/lib/directory";
import { lawyerPhotoUrl } from "@/lib/lawyer-photo";
import { longDate } from "@/lib/seo";
import { createAdminClient } from "@/lib/supabase/admin";
import { appCard, appLink, appPanel, appSectionTitle, appTitle, focusRing, rowPad } from "@/lib/ui";
import { deleteLawyer, markLicenseChecked, saveLawyerNotes, setLawyerPhoto, setLawyerStatus, updateLawyerProfile } from "../../actions";

export const metadata = { title: "Lawyer" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const when = (iso: string) =>
  new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", timeZone: "America/New_York" });

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={`grid gap-1 ${rowPad} py-2.5 sm:grid-cols-[10rem_1fr] sm:gap-4`}>
      <dt className="text-small text-slate">{label}</dt>
      <dd className="text-small text-midnight [overflow-wrap:anywhere]">{children}</dd>
    </div>
  );
}

async function LawyerDetail({ params }: { params: PageProps<"/admin/lawyers/[id]">["params"] }) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();
  const db = createAdminClient()!;
  const { data: r } = await db.from("lawyer_applications").select("*").eq("id", id).maybeSingle();
  if (!r) notFound();
  const [{ data: reviews }, { data: log }] = await Promise.all([
    db.from("lawyer_reviews").select("status").eq("lawyer_id", id),
    db.from("admin_audit").select("created_at, action, details").eq("target_type", "lawyer").eq("target_id", id).order("created_at", { ascending: false }).limit(30),
  ]);
  const status = r.status as LawyerStatus;
  const attorney = r.role === "attorney";
  const reviewCount = (s: string) => (reviews ?? []).filter((x) => x.status === s).length;
  const fee = r.free_consultation ? "Free" : r.consultation_fee ? `$${r.consultation_fee}` : "Not shown";
  const barSearch = `https://www.google.com/search?q=${encodeURIComponent(`${stateName(r.bar_state)} state bar attorney search ${r.full_name}`)}`;

  const initial: LawyerApplication = {
    role: attorney ? "attorney" : "accredited_representative",
    fullName: r.full_name,
    firmName: r.firm_name,
    email: r.email,
    phone: r.phone,
    website: r.website ?? "",
    barState: r.bar_state ?? "",
    barNumber: r.bar_number ?? "",
    officeStreet: r.office_street ?? "",
    officeCity: r.office_city,
    officeState: r.office_state,
    officeZip: r.office_zip ?? "",
    languages: r.languages,
    practiceAreas: r.practice_areas ?? [],
    consultationModes: r.consultation_modes ?? [],
    consultationPrice: r.free_consultation ? "free" : r.consultation_fee ? "paid" : "ask",
    consultationFee: r.consultation_fee ? String(r.consultation_fee) : "",
    licensedSince: r.licensed_since ? String(r.licensed_since) : "",
    education: (r.education ?? []).join("\n"),
    career: (r.career ?? []).join("\n"),
    bio: r.bio,
    accurate: true,
    agreed: true,
  };

  const list = setLawyerStatus.bind(null, id, "listed");
  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin/lawyers" className={`-ml-1 inline-flex min-h-8 w-fit items-center gap-1 rounded px-1 text-small font-medium text-slate hover:text-midnight ${focusRing}`}>
        <ArrowLeft aria-hidden className="size-3.5" />
        All applications
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className={appTitle}>{r.full_name}</h1>
          <p className="text-small text-slate">
            {r.firm_name} · {r.office_city}, {r.office_state} · applied {when(r.created_at)}
          </p>
        </div>
        <span className="rounded-full bg-ice px-3 py-1 text-small font-semibold text-blue">{LAWYER_STATUS_LABEL[status] ?? status}</span>
      </div>

      <section className={appPanel}>
        <h2 className={appSectionTitle}>Next step</h2>
        <p className="mt-1 text-small text-slate">
          {status === "new" && "Check the license, then approve and list. Rejecting keeps the application on file."}
          {status === "verified" && "The license is checked. List the profile to put it on the site."}
          {status === "listed" && "The profile is live. Unlisting hides it at once; nothing is deleted."}
          {(status === "rejected" || status === "withdrawn") && "Hidden from the site. You can list it again or move it back to new."}
        </p>
        <div className="mt-3 flex flex-wrap items-start gap-2">
          {status !== "listed" && <AdminButton action={list} label="Approve and list" tone="primary" confirm="This puts the profile on the site now." />}
          {status === "new" && <AdminButton action={setLawyerStatus.bind(null, id, "verified")} label="Mark license checked" />}
          {(status === "new" || status === "verified") && (
            <AdminButton action={setLawyerStatus.bind(null, id, "rejected")} label="Reject" reason="Why? (private, saved in the notes)" tone="danger" />
          )}
          {status === "listed" && <AdminButton action={markLicenseChecked.bind(null, id)} label="Record a license recheck today" />}
          {status === "listed" && <AdminButton action={setLawyerStatus.bind(null, id, "withdrawn")} label="Unlist" confirm="Hide this profile from the site now?" />}
          {(status === "rejected" || status === "withdrawn") && <AdminButton action={setLawyerStatus.bind(null, id, "new")} label="Move back to new" />}
          {status === "listed" && (
            <a href={`/lawyers/${r.slug}`} target="_blank" rel="noopener noreferrer" className={appLink}>
              View public profile
              <ArrowUpRight aria-hidden className="size-3.5" />
            </a>
          )}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={appCard}>
          <h2 className={`${appSectionTitle} border-b border-border ${rowPad} py-3`}>{attorney ? "License check" : "Accreditation check"}</h2>
          <dl className="divide-y divide-border">
            {attorney ? (
              <>
                <Row label="State bar">{stateName(r.bar_state)}</Row>
                <Row label="Bar number">
                  <span className="font-mono">{r.bar_number}</span>
                </Row>
                <Row label="Look it up">
                  <a href={barSearch} target="_blank" rel="noopener noreferrer" className={appLink}>
                    Find the {stateName(r.bar_state)} bar&apos;s lawyer search
                    <ArrowUpRight aria-hidden className="size-3.5" />
                  </a>
                </Row>
              </>
            ) : (
              <Row label="Look it up">
                <a href={DOJ_ROSTER} target="_blank" rel="noopener noreferrer" className={appLink}>
                  DOJ recognition and accreditation roster
                  <ArrowUpRight aria-hidden className="size-3.5" />
                </a>
              </Row>
            )}
            <Row label="Licensed since">{r.licensed_since ?? "Not given"}</Row>
            <Row label="Last checked">{r.license_checked_on ? longDate(r.license_checked_on) : "Not yet"}</Row>
          </dl>
        </section>

        <section className={appCard}>
          <h2 className={`${appSectionTitle} border-b border-border ${rowPad} py-3`}>Contact and profile</h2>
          <dl className="divide-y divide-border">
            <Row label="Email">
              <a href={`mailto:${r.email}`} className={appLink}>
                {r.email}
              </a>
            </Row>
            <Row label="Phone">{r.phone}</Row>
            <Row label="Website">{r.website ?? "None"}</Row>
            <Row label="Office">{[r.office_street, `${r.office_city}, ${r.office_state} ${r.office_zip ?? ""}`.trim()].filter(Boolean).join(", ")}</Row>
            <Row label="Consultations">
              {(r.consultation_modes ?? []).map((m: string) => CONSULTATION_MODES.find((c) => c.value === m)?.label).filter(Boolean).join(", ") || "None"} · first: {fee}
            </Row>
            <Row label="Cases">{(r.practice_areas ?? []).map(areaLabel).filter(Boolean).join(", ")}</Row>
            <Row label="Reviews">
              {reviewCount("published")} published, {reviewCount("pending")} pending ·{" "}
              <Link href={`/admin/reviews?status=${reviewCount("pending") > 0 || reviewCount("published") === 0 ? "pending" : "published"}&lawyer=${id}`} className={appLink}>
                See their reviews
              </Link>
            </Row>
            <Row label="Page address">/lawyers/{r.slug}</Row>
          </dl>
        </section>
      </div>

      <section className={appPanel}>
        <h2 className={appSectionTitle}>Photo</h2>
        <div className="mt-3">
          <PhotoForm action={setLawyerPhoto.bind(null, id)} photoUrl={lawyerPhotoUrl(r.photo_path)} name={r.full_name} />
        </div>
      </section>

      <section className={appPanel}>
        <NotesForm action={saveLawyerNotes.bind(null, id)} initial={r.review_notes ?? ""} />
      </section>

      <section className={appPanel}>
        <h2 className={appSectionTitle}>Edit profile</h2>
        <p className="mt-1 mb-4 text-small text-slate">Same rules as the application form. The page address stays the same.</p>
        <LawyerEditForm action={updateLawyerProfile.bind(null, id)} initial={initial} />
      </section>

      <section className={appCard}>
        <h2 className={`${appSectionTitle} border-b border-border ${rowPad} py-3`}>History</h2>
        <ul className="divide-y divide-border">
          <li className={`flex justify-between gap-3 ${rowPad} py-2.5 text-small`}>
            <span className="text-midnight">Applied (agreed to terms version {r.policy_version}, quoted ${r.quoted_annual_fee} a year)</span>
            <span className="shrink-0 text-slate tabular-nums">{when(r.created_at)}</span>
          </li>
          {(log ?? []).map((l, i) => (
            <li key={i} className={`flex justify-between gap-3 ${rowPad} py-2.5 text-small`}>
              <span className="text-midnight">
                {l.action}
                {l.details?.reason ? `: ${l.details.reason}` : ""}
                {Array.isArray(l.details?.fields) ? ` (${l.details.fields.join(", ")})` : ""}
              </span>
              <span className="shrink-0 text-slate tabular-nums">{when(l.created_at)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={`${appPanel} border-red/30`}>
        <h2 className={appSectionTitle}>Delete</h2>
        <p className="mt-1 mb-3 text-small text-slate">Removes the application, its photo and its reviews for good. Use Reject or Unlist to keep a record.</p>
        <AdminButton action={deleteLawyer.bind(null, id)} label="Delete for good" tone="danger" goTo="/admin/lawyers?status=all" confirm={`Delete ${r.full_name}'s application, photo and reviews? This can't be undone.`} />
      </section>
    </div>
  );
}

export default function AdminLawyer({ params }: PageProps<"/admin/lawyers/[id]">) {
  return (
    <Suspense fallback={<div className="skeleton h-96 rounded-xl" />}>
      <AdminOnly next="/admin/lawyers">
        <LawyerDetail params={params} />
      </AdminOnly>
    </Suspense>
  );
}
