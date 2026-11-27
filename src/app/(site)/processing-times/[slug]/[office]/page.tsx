import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Info } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { OfficeTimes } from "@/components/OfficeTimes";
import { TimeCheck } from "@/components/TimeCheck";
import { TrackCard } from "@/components/TrackCard";
import { LinkRows } from "@/components/ui/LinkRows";
import { Questions } from "@/components/ui/Questions";
import { SourceNote } from "@/components/ui/SourceNote";
import { Stats, ToolHero } from "@/components/ui/ToolHero";
import { RichText } from "@/components/ui/RichText";
import { officialFormUrl, USCIS_PROCESSING_TIMES } from "@/lib/content";
import {
  allFieldOfficeRows,
  formatTime,
  getOfficePage,
  inMonths,
  timeCheckForm,
  leadLabel,
  officeName,
  officeSlug,
  officeStanding,
  PT_CHECKED,
  PT_OFFICE_PAGES,
  type PtOfficePage,
} from "@/lib/processing-times";
import { breadcrumbSchema, faqSchema, longDate, pageMetadata, webPageSchema } from "@/lib/seo";
import { card, container, focusRing, panel, section } from "@/lib/ui";

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
  // 0 at the shortest field office, 1 at the longest.
  const span = inMonths(standing.slowest) - inMonths(standing.fastest);
  const place = span > 0 ? (inMonths(o.office) - inMonths(standing.fastest)) / span : 0.5;

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
      <ToolHero
        title={`Form ${f.form} processing time in ${o.name}`}
        description={`How long the USCIS field office in ${o.name} is taking to decide Form ${f.form} (${f.label.toLowerCase()}).`}
        back={{ href: `/processing-times/${f.slug}`, label: `All Form ${f.form} offices` }}
        meta={<p>Checked {longDate(PT_CHECKED)} · Official USCIS figures</p>}
        aside={
          <div id="short-answer" className={`${card} p-5 sm:p-6`}>
            <p className="text-small text-slate">80% of cases finished within</p>
            <p className="mt-1 text-display text-midnight tabular-nums">{formatTime(o.office)}</p>
            <p className="mt-1 text-small font-medium text-midnight">
              {o.name} field office{o.p.categories.length > 1 ? ` · ${o.category.name}` : ""}
            </p>
            {/* Where this office sits between the shortest and longest field office. */}
            <div className="mt-5">
              <div aria-hidden className="relative h-2 rounded-full bg-border">
                <span
                  className="pop absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-blue"
                  style={{ left: `${Math.min(98, Math.max(2, place * 100))}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between gap-4 text-small text-slate tabular-nums">
                <span>Shortest: {formatTime(standing.fastest)}</span>
                <span>Longest: {formatTime(standing.slowest)}</span>
              </div>
            </div>
            <p className="sr-only">{answer}</p>
          </div>
        }
      >
        <Stats
          items={[
            { label: "Case inquiry date", value: shortDate(o.office.inquiry), note: "Received before it? You can ask USCIS" },
            { label: "Shorter offices", value: String(standing.faster), note: `Of ${standing.total} field offices` },
            { label: "Longer offices", value: String(standing.slower), note: `Of ${standing.total} field offices` },
            { label: "Middle of the list", value: formatTime(standing.middle), note: officeName(standing.middle.name), href: officePath(standing.middle.name) },
          ]}
        />
      </ToolHero>

      <section className={section}>
        <div className={`${container} grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12`}>
          <div className="min-w-0">
            <h2 className="text-h2 text-midnight">Check your case</h2>
            <p className="mt-3 max-w-2xl text-body text-slate">
              Add the date USCIS received your case to see whether it is past the case inquiry date for {o.name}.
            </p>
            <div className="mt-6">
              <TimeCheck
                forms={[timeCheckForm(o.p, { category: o.category.code, office: o.office.code })]}
                checked={longDate(PT_CHECKED)}
                link="none"
              />
            </div>

            <h2 className="mt-14 text-h2 text-midnight">Form {f.form} times at this office</h2>
            <p className="mt-3 max-w-2xl text-body text-slate">
              The time is how long it took USCIS to finish 80% of those cases. The case inquiry date is USCIS&apos;s own cutoff: if
              your receipt date is before it, you can ask USCIS about your case.
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
              <p className="mt-4 max-w-2xl text-small text-slate">
                USCIS reports one time for all field offices together in the other categories, so those lines are the same for
                every office.
              </p>
            )}

            <h2 className="mt-14 text-h2 text-midnight">How {o.name} compares</h2>
            <p className="mt-3 max-w-2xl text-body text-slate">{standingText(o)}</p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                { label: "Shortest time", office: standing.fastest },
                { label: "Middle of the list", office: standing.middle },
                { label: "Longest time", office: standing.slowest },
              ].map((r) => (
                <li key={r.label} className={panel}>
                  <p className="text-small text-slate">{r.label}</p>
                  <p className="mt-1 text-h3 text-midnight tabular-nums">{formatTime(r.office)}</p>
                  {r.office.name === o.office.name ? (
                    <p className="flex min-h-11 items-center text-small font-semibold text-midnight">{o.name} (this office)</p>
                  ) : (
                    <Link href={officePath(r.office.name)} className={`link-draw inline-flex min-h-11 items-center rounded text-small font-semibold text-blue ${focusRing}`}>
                      {officeName(r.office.name)}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-small text-slate">
              You can&apos;t choose your office: USCIS assigns it, usually based on where you live.
            </p>

            <h2 className="mt-14 text-h2 text-midnight">If you&apos;re past the time</h2>
            <ol className={`mt-6 ${panel}`}>
              {[
                "Find the received date on your receipt notice (Form I-797C).",
                inquiryText(o),
                "If you're outside the normal time, you can send USCIS a case inquiry. See [how to contact USCIS about a delayed case](/answers/contact-uscis-about-delayed-case).",
              ].map((step, i, list) => (
                <li key={step} className="relative flex gap-5 pb-6 last:pb-0">
                  {i < list.length - 1 && <span aria-hidden className="absolute top-9 bottom-0 left-[17px] w-0.5 bg-border" />}
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ice text-small font-semibold text-blue tabular-nums">
                    {i + 1}
                  </span>
                  <span className="pt-1.5 text-body text-midnight">
                    <RichText text={step} />
                  </span>
                </li>
              ))}
            </ol>

            <h2 className="mt-14 text-h2 text-midnight">Common questions</h2>
            <Questions className="mt-6" items={questions} />

            {otherForms.length > 0 && (
              <>
                <h2 className="mt-14 text-h2 text-midnight">Other forms at {o.name}</h2>
                <LinkRows
                  compact
                  className="mt-6"
                  items={otherForms.map((x) => ({
                    href: `/processing-times/${x.p.form.slug}/${x.slug}`,
                    title: `Form ${x.p.form.form}: ${x.p.form.label}`,
                    note: formatTime(x.office),
                  }))}
                />
              </>
            )}

            {sameState.length > 0 && (
              <>
                <h2 className="mt-14 text-h2 text-midnight">
                  Form {f.form} at other {o.state} offices
                </h2>
                <LinkRows
                  compact
                  className="mt-6"
                  items={sameState.map((x) => ({ href: `/processing-times/${f.slug}/${x.slug}`, title: x.name, note: formatTime(x.office) }))}
                />
              </>
            )}

            <LinkRows
              compact
              className="mt-14"
              items={[
                { href: `/processing-times/${f.slug}`, title: `Form ${f.form} processing time at every office` },
                { href: `/forms/${f.slug}`, title: `Form ${f.form}: fee, documents and steps` },
              ]}
            />

            <SourceNote
              className="mt-14"
              sources={[
                { label: "USCIS: Check case processing times", href: USCIS_PROCESSING_TIMES },
                { label: `USCIS: Form ${f.form}, ${f.title}`, href: officialFormUrl(f) },
                { label: "USCIS: e-Request (case inquiries)", href: E_REQUEST },
              ]}
            />
            <p className="mt-4 flex items-start gap-2 text-small text-slate">
              <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
              General information, not legal advice. USCIS notices and uscis.gov are the official source.
            </p>
          </div>

          <aside className="lg:pt-1">
            <div className="lg:sticky lg:top-28">
              <TrackCard title={`Waiting on Form ${f.form}?`} />
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
