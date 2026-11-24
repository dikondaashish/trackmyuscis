import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Info } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { OfficeTimes } from "@/components/OfficeTimes";
import { OfficialSources } from "@/components/OfficialSources";
import { LinkRows } from "@/components/ui/LinkRows";
import { PageIntro } from "@/components/ui/PageIntro";
import { RichText } from "@/components/ui/RichText";
import { officialFormUrl, USCIS_PROCESSING_TIMES } from "@/lib/content";
import {
  allFieldOfficeRows,
  formatTime,
  getOfficePage,
  leadLabel,
  officeName,
  officeSlug,
  officeStanding,
  PT_CHECKED,
  PT_OFFICE_PAGES,
  type PtOfficePage,
} from "@/lib/processing-times";
import { breadcrumbSchema, faqSchema, longDate, pageMetadata, webPageSchema } from "@/lib/seo";
import { btnPrimary, focusRing, panel, readContainer, rowPad, rows, section } from "@/lib/ui";

/** Every office of every form with office-by-office times is prerendered; anything else is a real 404. */
export const instant = false;

export function generateStaticParams() {
  return PT_OFFICE_PAGES.map((o) => ({ slug: o.p.form.slug, office: o.slug }));
}

const E_REQUEST = "https://egov.uscis.gov/e-request/";
const monthYear = (iso: string) => longDate(iso).replace(/ \d+,/, "");
const shortDate = (iso?: string) =>
  iso
    ? new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })
    : "–";

/** "family-based adjustment applications" for a form with several categories; nothing for a form with one. */
const categoryPhrase = (o: PtOfficePage) => (o.p.categories.length > 1 ? ` for ${o.category.name.toLowerCase()}` : "");

function shortAnswer(o: PtOfficePage) {
  return `At the USCIS field office in ${o.name}, the official Form ${o.p.form.form} processing time${categoryPhrase(o)} is ${formatTime(o.office)}. That's how long it took USCIS to finish 80% of these cases over the past six months, as shown on ${longDate(PT_CHECKED)}.`;
}

function standingText(o: PtOfficePage) {
  const s = officeStanding(o);
  if (s.faster === 0 || s.slower === 0) {
    const end = s.faster === 0 ? "shortest" : "longest";
    return `${o.name} has the ${end} time of the ${s.total} field offices USCIS lists for this form${s.same > 0 ? `, level with ${s.same} other${s.same === 1 ? "" : "s"}` : ""}.`;
  }
  const same = s.same > 0 ? ` and ${s.same} ${s.same === 1 ? "has" : "have"} the same time` : "";
  return `Of the ${s.total} field offices USCIS lists for this form, ${s.faster} ${s.faster === 1 ? "has" : "have"} a shorter time than ${o.name}, ${s.slower} ${s.slower === 1 ? "has" : "have"} a longer one${same}.`;
}

function inquiryText(o: PtOfficePage) {
  return o.office.inquiry
    ? `USCIS's case inquiry date for this office is ${longDate(o.office.inquiry)}. If USCIS received your case before that date, it is outside the normal processing time and you can send a case inquiry.`
    : "USCIS lists a case inquiry date for each office on its processing times page. If USCIS received your case before that date, you can send a case inquiry.";
}

function faq(o: PtOfficePage) {
  const f = o.p.form.form;
  return [
    { q: `How long does Form ${f} take at the ${o.name} field office?`, a: shortAnswer(o) },
    { q: `Is ${o.name} faster or slower than other USCIS offices for Form ${f}?`, a: standingText(o) },
    { q: `When can I ask USCIS about a Form ${f} case at ${o.name}?`, a: inquiryText(o) },
    {
      q: "Can I move my case to a faster office?",
      a: "You can't choose your office: USCIS assigns it, usually based on where you live.",
    },
  ];
}

export async function generateMetadata({ params }: PageProps<"/processing-times/[slug]/[office]">): Promise<Metadata> {
  const { slug, office } = await params;
  const o = getOfficePage(slug, office);
  if (!o) return {};
  const f = o.p.form.form;
  const titles = [`${f} Processing Time in ${o.name} (${monthYear(PT_CHECKED)})`, `${f} Processing Time in ${o.name}`];
  const scope = o.p.categories.length > 1 ? ` ${leadLabel(f, o.category.code) ?? `for ${o.category.name.toLowerCase()}`}` : "";
  const base = `USCIS's official ${f} processing time at the ${o.name} field office is ${formatTime(o.office)}${scope}.`;
  const tails = [" See the case inquiry date, how this office compares and what to do if you're past it.", " See the case inquiry date and how this office compares.", " See the inquiry date and how it compares.", ""];
  return pageMetadata({
    title: titles.find((t) => t.length <= 60) ?? titles[1],
    description: base + (tails.find((t) => (base + t).length <= 160) ?? ""),
    path: `/processing-times/${slug}/${o.slug}`,
    type: "article",
  });
}

/**
 * One form at one USCIS field office: the official time, the case inquiry date, how the office
 * compares with the others and what to do when a case is past the time.
 */
export default async function OfficeProcessingTimePage({ params }: PageProps<"/processing-times/[slug]/[office]">) {
  const { slug, office } = await params;
  const o = getOfficePage(slug, office);
  if (!o) notFound();
  const f = o.p.form;
  const path = `/processing-times/${f.slug}/${o.slug}`;
  const answer = shortAnswer(o);
  const questions = faq(o);
  const standing = officeStanding(o);
  const shared = allFieldOfficeRows(o.p, o.category);
  const otherForms = PT_OFFICE_PAGES.filter((x) => x.slug === o.slug && x.p.form.slug !== f.slug);
  const sameState = o.state ? PT_OFFICE_PAGES.filter((x) => x.p.form.slug === f.slug && x.state === o.state && x.slug !== o.slug) : [];
  const officePath = (name: string) => `/processing-times/${f.slug}/${officeSlug(name)}`;

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ name: `Form ${f.form} processing time in ${o.name}`, description: answer, path, speakable: ["#short-answer"], dateModified: PT_CHECKED }),
          faqSchema(questions),
          breadcrumbSchema([
            { name: "Processing times", path: "/processing-times" },
            { name: `Form ${f.form}`, path: `/processing-times/${f.slug}` },
            { name: o.name, path },
          ]),
        ]}
      />
      <PageIntro
        title={`Form ${f.form} processing time in ${o.name}`}
        description={`How long the USCIS field office in ${o.name} is taking to decide Form ${f.form} (${f.label.toLowerCase()}), from the official USCIS tool.`}
        back={{ href: `/processing-times/${f.slug}`, label: `All Form ${f.form} offices` }}
        width={readContainer}
      >
        <p className="text-small text-slate">Checked {longDate(PT_CHECKED)} · Read from uscis.gov</p>
      </PageIntro>

      <section className={section}>
        <div className={readContainer}>
          <div id="short-answer" className="rounded-xl border border-blue/15 bg-ice p-5 sm:p-6">
            <h2 className="text-small font-semibold text-blue">Short answer</h2>
            <p className="mt-2 text-lead text-midnight">{answer}</p>
          </div>

          <h2 className="mt-12 text-h3 font-semibold text-midnight">Form {f.form} times at this office</h2>
          <p className="mt-3 text-body text-slate">
            The time is how long it took USCIS to finish 80% of those cases. The case inquiry date is USCIS&apos;s own cutoff: if your
            receipt date is before it, you can ask USCIS about your case.
          </p>
          <div className="mt-6">
            <OfficeTimes
              caption={`Form ${f.form} at ${o.name}`}
              head={["Category", "80% done within", "Case inquiry date"]}
              rows={[
                { key: o.category.code, label: o.category.name, sub: `${o.name} field office`, cells: [formatTime(o.office), shortDate(o.office.inquiry)] },
                ...shared.map((r) => ({
                  key: r.category.code,
                  label: r.category.name,
                  sub: "All field offices together",
                  cells: [formatTime(r.office), shortDate(r.office.inquiry)],
                })),
              ]}
            />
          </div>
          {shared.length > 0 && (
            <p className="mt-4 text-small text-slate">
              USCIS reports one time for all field offices together in the other categories, so those lines are the same for every
              office.
            </p>
          )}
          <p className="mt-4 text-small text-slate">
            <RichText text={`Source: [USCIS processing times](${USCIS_PROCESSING_TIMES}), read on ${longDate(PT_CHECKED)}.`} />
          </p>

          <h2 className="mt-12 text-h3 font-semibold text-midnight">How {o.name} compares</h2>
          <p className="mt-3 text-body text-slate">{standingText(o)}</p>
          <ul className={`mt-6 ${rows}`}>
            {[
              { label: "Shortest time", office: standing.fastest },
              { label: "Office in the middle of the list", office: standing.middle },
              { label: "Longest time", office: standing.slowest },
            ].map((r) => (
              <li key={r.label} className={`flex items-center justify-between gap-4 ${rowPad} py-4`}>
                <span className="min-w-0">
                  <span className="block text-small text-slate">{r.label}</span>
                  {r.office.name === o.office.name ? (
                    <span className="block text-body font-semibold text-midnight">{o.name} (this office)</span>
                  ) : (
                    <Link href={officePath(r.office.name)} className={`link-draw inline-flex min-h-11 items-center rounded text-body font-semibold text-blue ${focusRing}`}>
                      {officeName(r.office.name)}
                    </Link>
                  )}
                </span>
                <span className="shrink-0 text-body font-semibold text-midnight tabular-nums">{formatTime(r.office)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-small text-slate">
            You can&apos;t choose your office: USCIS assigns it, usually based on where you live.
          </p>

          <h2 className="mt-12 text-h3 font-semibold text-midnight">If you&apos;re past the time</h2>
          <ol className={`mt-6 ${panel}`}>
            {[
              "Find the received date on your receipt notice (Form I-797C).",
              inquiryText(o),
              `If you're outside the normal time, send a case inquiry through [USCIS e-Request](${E_REQUEST}). See [how to contact USCIS about a delayed case](/answers/contact-uscis-about-delayed-case).`,
            ].map((step, i, all) => (
              <li key={step} className="relative flex gap-5 pb-6 last:pb-0">
                {i < all.length - 1 && <span aria-hidden className="absolute top-9 bottom-0 left-[17px] w-0.5 bg-border" />}
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ice text-small font-semibold text-blue tabular-nums">
                  {i + 1}
                </span>
                <span className="pt-1.5 text-body text-midnight">
                  <RichText text={step} />
                </span>
              </li>
            ))}
          </ol>

          <h2 className="mt-12 text-h3 font-semibold text-midnight">Common questions</h2>
          <div className={`mt-6 ${rows}`}>
            {questions.map((q) => (
              <div key={q.q} className={`${rowPad} py-5`}>
                <h3 className="text-title font-semibold text-midnight">{q.q}</h3>
                <p className="mt-1 text-body text-slate">{q.a}</p>
              </div>
            ))}
          </div>

          <div className={`mt-12 flex flex-col items-start gap-3 ${panel} sm:p-8`}>
            <h2 className="text-title text-midnight">Follow your own case</h2>
            <p className="text-body text-slate">
              Save your receipt number in a free account. We check it with USCIS about once a day and show the latest status and
              its history.
            </p>
            <Link href="/sign-up" className={`mt-1 ${btnPrimary}`}>
              Create free account
            </Link>
          </div>

          {otherForms.length > 0 && (
            <div className="mt-12">
              <h2 className="text-h3 font-semibold text-midnight">Other forms at {o.name}</h2>
              <LinkRows
                compact
                className="mt-5"
                items={otherForms.map((x) => ({
                  href: `/processing-times/${x.p.form.slug}/${x.slug}`,
                  title: `Form ${x.p.form.form}: ${x.p.form.label}`,
                  note: formatTime(x.office),
                }))}
              />
            </div>
          )}

          {sameState.length > 0 && (
            <div className="mt-12">
              <h2 className="text-h3 font-semibold text-midnight">
                Form {f.form} at other {o.state} offices
              </h2>
              <LinkRows
                compact
                className="mt-5"
                items={sameState.map((x) => ({ href: `/processing-times/${f.slug}/${x.slug}`, title: x.name, note: formatTime(x.office) }))}
              />
            </div>
          )}

          <div className={`mt-12 ${panel} sm:p-8`}>
            <OfficialSources
              sources={[
                { label: "USCIS: Check case processing times", href: USCIS_PROCESSING_TIMES },
                { label: `USCIS: Form ${f.form}, ${f.title}`, href: officialFormUrl(f) },
                { label: "USCIS: e-Request (case inquiries)", href: E_REQUEST },
              ]}
            />
          </div>

          <p className="mt-6 flex items-start gap-2 text-small text-slate">
            <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
            General information, not legal advice. USCIS notices and uscis.gov are the official source.
          </p>

          <LinkRows
            compact
            className="mt-12"
            items={[
              { href: `/processing-times/${f.slug}`, title: `Form ${f.form} processing time at every office` },
              { href: `/forms/${f.slug}`, title: `Form ${f.form}: fee, documents and steps` },
            ]}
          />
        </div>
      </section>
    </>
  );
}
