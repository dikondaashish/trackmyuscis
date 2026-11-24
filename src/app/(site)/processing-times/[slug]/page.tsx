import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Info } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { OfficeTimes } from "@/components/OfficeTimes";
import { OfficialSources } from "@/components/OfficialSources";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { LinkRows } from "@/components/ui/LinkRows";
import { PageIntro } from "@/components/ui/PageIntro";
import { RichText } from "@/components/ui/RichText";
import { officialFormUrl, USCIS_PROCESSING_TIMES } from "@/lib/content";
import {
  dependsOnLabel,
  formatTime,
  getPtForm,
  noteText,
  officeHref,
  ptDescription,
  ptShortAnswer,
  officeLabel,
  officeName,
  PT_CHECKED,
  PT_LATEST,
  PT_FORMS,
  range,
  splitCategories,
  type PtForm,
} from "@/lib/processing-times";
import { postsForForm } from "@/lib/related";
import { breadcrumbSchema, faqSchema, longDate, pageMetadata, webPageSchema } from "@/lib/seo";
import { btnPrimary, container, focusRing, panel, rowPad, rows, section } from "@/lib/ui";

/** Every known form is prerendered; unknown ones return a real 404. */
export const instant = false;

export function generateStaticParams() {
  return PT_FORMS.map((p) => ({ slug: p.form.slug }));
}

const E_REQUEST = "https://egov.uscis.gov/e-request/";
const monthYear = (iso: string) => longDate(iso).replace(/ \d+,/, "");

/** "2024-01-21" → "Jan 21, 2024"; no date → a dash. */
const shortDate = (iso?: string) =>
  iso
    ? new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })
    : "–";

/** USCIS's notes for a form, each once, with the offices it was shown for. */
function UscisNotes({ p }: { p: PtForm }) {
  const byNote = new Map<number, Set<string>>();
  for (const c of p.categories)
    for (const o of c.offices) if (o.note !== undefined) byNote.set(o.note, (byNote.get(o.note) ?? new Set()).add(officeName(o.name)));
  if (!byNote.size) return null;
  const offices = new Set(p.categories.flatMap((c) => c.offices.map((o) => o.name)));
  return (
    <div className="mt-8">
      <h3 className="text-title font-semibold text-midnight">Notes from USCIS</h3>
      <ul className="mt-3 space-y-3">
        {[...byNote].map(([i, who]) => (
          <li key={i} className="text-small text-slate">
            {offices.size > 1 && <span className="font-semibold text-midnight">{[...who].join(", ")}: </span>}
            {noteText(i)}
          </li>
        ))}
      </ul>
    </div>
  );
}

const HEAD_TIME = "80% done within";
const HEAD_INQUIRY = "Case inquiry date";

function faq(p: PtForm) {
  const f = p.form;
  const { fastest, slowest, count } = range(p);
  const items = [{ q: `How long does Form ${f.form} take right now?`, a: ptShortAnswer(p) }];
  if (count > 1 && dependsOnLabel(p) === "office") {
    items.push({
      q: `Which USCIS office is fastest for Form ${f.form}?`,
      a: `On ${longDate(PT_CHECKED)}, the shortest time was ${formatTime(fastest)} at ${officeName(fastest.name)} and the longest was ${formatTime(slowest)} at ${officeName(slowest.name)}. You can't choose your office: USCIS assigns it, usually based on where you live.`,
    });
  }
  items.push(
    {
      q: `Why is my Form ${f.form} taking longer than the posted time?`,
      a: "The posted time is when 80% of recent cases were finished, so about 1 in 5 cases take longer. USCIS says each case is unique. A request for evidence or a transfer to another office can add time.",
    },
    {
      q: `What can I do if my ${f.form} is past the processing time?`,
      a: "USCIS lists a case inquiry date for each category and office. If your receipt date is before it, your case is outside the normal processing time and you can send USCIS a case inquiry online through e-Request or call the USCIS Contact Center.",
    },
    {
      q: "How often do these times change?",
      a: "USCIS updates its processing times regularly. We read every office again each month and change the date at the top of this page.",
    },
  );
  return items;
}

export async function generateMetadata({ params }: PageProps<"/processing-times/[slug]">): Promise<Metadata> {
  const p = getPtForm((await params).slug);
  if (!p) return {};
  const f = p.form;
  const by = dependsOnLabel(p);
  const byTitle = by === "office" ? " by Office" : by === "nothing" ? "" : " by Category";
  return pageMetadata({
    title: `${f.form} Processing Time (${monthYear(PT_CHECKED)})${byTitle}`,
    description: ptDescription(p),
    path: `/processing-times/${f.slug}`,
    type: "article",
  });
}

export default async function FormProcessingTimePage({ params }: PageProps<"/processing-times/[slug]">) {
  const p = getPtForm((await params).slug);
  if (!p) notFound();
  const f = p.form;
  const path = `/processing-times/${f.slug}`;
  const { single, multi } = splitCategories(p);
  const singleOffices = new Set(single.map((c) => c.offices[0].name));
  const answer = ptShortAnswer(p);
  const questions = faq(p);
  const others = PT_FORMS.filter((o) => o.form.slug !== f.slug);
  const posts = postsForForm(f.slug);
  const multiHeading = (name: string) => (p.categories.length > 1 ? name : `Form ${f.form} by office`);

  const toc = [
    { id: "times", label: ({ category: "Times by category", office: "Times by office", nothing: "The current time" } as Record<string, string>)[dependsOnLabel(p)] ?? "Times by category and office" },
    { id: "meaning", label: "What the number means" },
    { id: "past", label: "If you're past the time" },
    { id: "faq", label: "Common questions" },
    { id: "sources", label: "Official sources" },
  ];

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({
            name: `Form ${f.form} processing time`,
            description: answer,
            path,
            speakable: ["#short-answer"],
            dateModified: PT_CHECKED,
          }),
          faqSchema(questions),
          breadcrumbSchema([
            { name: "Processing times", path: "/processing-times" },
            { name: `Form ${f.form}`, path },
          ]),
        ]}
      />
      <PageIntro
        title={`Form ${f.form} processing time`}
        description={`How long USCIS is taking to decide Form ${f.form} (${f.label.toLowerCase()}), from the official USCIS tool.`}
        back={{ href: "/processing-times", label: "All processing times" }}
      >
        <p className="text-small text-slate">Checked {longDate(PT_CHECKED)} · Every office read from uscis.gov</p>
      </PageIntro>

      <section className={section}>
        <div className={`${container} grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-12`}>
          <div className="min-w-0 max-w-3xl">
            <div id="short-answer" className="rounded-xl border border-blue/15 bg-ice p-5 sm:p-6">
              <h2 className="text-small font-semibold text-blue">Short answer</h2>
              <p className="mt-2 text-lead text-midnight">{answer}</p>
            </div>

            <h2 id="times" className="jump-target mt-12 scroll-mt-28 text-h3 font-semibold text-midnight">
              {toc[0].label}
            </h2>
            <p className="mt-3 text-body text-slate">
              Find the category and office on your receipt notice (Form I-797C). The time is how long it took USCIS to finish 80% of
              those cases. The case inquiry date is USCIS&apos;s own cutoff: if your receipt date is before it, you can ask USCIS
              about your case.
            </p>

            {single.length > 0 && (
              <div className="mt-6">
                <OfficeTimes
                  caption={
                    singleOffices.size === 1
                      ? `Form ${f.form} at ${officeName([...singleOffices][0])}`
                      : `Form ${f.form} by category`
                  }
                  head={["Category", HEAD_TIME, HEAD_INQUIRY]}
                  rows={single.map((c) => ({
                    key: c.code,
                    label: c.name,
                    sub: singleOffices.size === 1 ? undefined : officeLabel(c.offices[0]),
                    cells: [formatTime(c.offices[0]), shortDate(c.offices[0].inquiry)],
                  }))}
                />
              </div>
            )}

            {multi.map((c) => (
              <div key={c.code} className="mt-10">
                {(p.categories.length > 1 || multi.length > 1) && (
                  <h3 className="mb-4 text-title font-semibold text-midnight">{multiHeading(c.name)}</h3>
                )}
                <OfficeTimes
                  filter={c.offices.length > 8}
                  caption={`${c.name}: ${c.offices.length} offices`}
                  head={["Office", HEAD_TIME, HEAD_INQUIRY]}
                  rows={[...c.offices]
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((o) => ({ key: o.code, label: officeLabel(o), cells: [formatTime(o), shortDate(o.inquiry)], href: officeHref(f.slug, o.name) }))}
                />
              </div>
            ))}
            <UscisNotes p={p} />
            <p className="mt-6 text-small text-slate">
              <RichText
                text={`Source: [USCIS processing times](${USCIS_PROCESSING_TIMES}), read for every office on ${longDate(PT_CHECKED)}.${PT_LATEST.published ? ` USCIS last updated them on ${PT_LATEST.published}` : ""}${PT_LATEST.period ? `, using cases completed ${PT_LATEST.period.replace(/^Processing Time Data from /, "")}.` : PT_LATEST.published ? "." : ""}`}
              />
            </p>

            <h2 id="meaning" className="jump-target mt-12 scroll-mt-28 text-h3 font-semibold text-midnight">
              What the number means
            </h2>
            <ul className={`mt-6 ${rows}`}>
              {[
                {
                  title: "It's the 80% mark, not a promise",
                  body: "USCIS bases the time on how long it took to finish 80% of decided cases over the past six months. About 1 in 5 cases took longer.",
                },
                {
                  title: "Your office and category matter",
                  body: "The same form can take very different times in different places. Use the line that matches your receipt notice.",
                },
                {
                  title: "Cases generally go in order",
                  body: "USCIS says it generally processes cases in the order it receives them, but each case is unique and some take longer.",
                },
              ].map((t) => (
                <li key={t.title} className={`${rowPad} py-5`}>
                  <h3 className="text-title font-semibold text-midnight">{t.title}</h3>
                  <p className="mt-1 text-body text-slate">{t.body}</p>
                </li>
              ))}
            </ul>

            <h2 id="past" className="jump-target mt-12 scroll-mt-28 text-h3 font-semibold text-midnight">
              If you&apos;re past the time
            </h2>
            <ol className={`mt-6 ${panel}`}>
              {[
                "Find the received date on your receipt notice (Form I-797C).",
                `Compare it with the case inquiry date for your category and office above, or on the [official tool](${USCIS_PROCESSING_TIMES}). If your received date is earlier, your case is outside the normal processing time.`,
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

            <h2 id="faq" className="jump-target mt-12 scroll-mt-28 text-h3 font-semibold text-midnight">
              Common questions
            </h2>
            <div className={`mt-6 ${rows}`}>
              {questions.map((q) => (
                <div key={q.q} className={`${rowPad} py-5`}>
                  <h3 className="text-title font-semibold text-midnight">{q.q}</h3>
                  <p className="mt-1 text-body text-slate">{q.a}</p>
                </div>
              ))}
            </div>

            <OfficialSources
              id="sources"
              className="mt-12 scroll-mt-28"
              sources={[
                { label: "USCIS: Check case processing times", href: USCIS_PROCESSING_TIMES },
                { label: `USCIS: Form ${f.form}, ${f.title}`, href: officialFormUrl(f) },
                { label: "USCIS: e-Request (case inquiries)", href: E_REQUEST },
              ]}
            />

            <p className="mt-8 flex items-start gap-2 text-small text-slate">
              <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
              General information, not legal advice. USCIS notices and uscis.gov are the official source.
            </p>

            {posts.length > 0 && (
              <div className="mt-12">
                <h2 className="text-h3 font-semibold text-midnight">More on Form {f.form}</h2>
                <LinkRows compact className="mt-5" items={posts.map((b) => ({ href: `/blog/${b.slug}`, title: b.title }))} />
              </div>
            )}

            <div className="mt-12">
              <h2 className="text-h3 font-semibold text-midnight">Other processing times</h2>
              <LinkRows
                compact
                className="mt-5"
                items={others.map((o) => ({ href: `/processing-times/${o.form.slug}`, title: `Form ${o.form.form}: ${o.form.label}` }))}
              />
            </div>
          </div>

          <aside className="no-print lg:pt-1">
            <div className="lg:sticky lg:top-28">
              <nav aria-label="On this page" className="hidden lg:block">
                <p className="text-small font-semibold text-midnight">On this page</p>
                <ul className="mt-2 border-l border-border">
                  {toc.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className={`-ml-px flex min-h-11 items-center border-l border-transparent py-1 pl-4 text-small text-slate transition-colors duration-200 hover:border-blue hover:text-midnight ${focusRing}`}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className={`flex flex-col items-stretch gap-3 lg:mt-8 ${panel} sm:p-6`}>
                <p className="text-title text-midnight">Have a receipt number?</p>
                <p className="-mt-2 mb-1 text-small text-slate">Confirm it and see which USCIS office has your case.</p>
                <Link href="/#track" className={btnPrimary}>
                  Track Case
                </Link>
                <Link
                  href={`/forms/${f.slug}`}
                  className={`link-draw inline-flex min-h-11 items-center rounded text-small font-semibold text-blue ${focusRing}`}
                >
                  Form {f.form}: fee, documents and steps
                </Link>
                <ExternalLink href={USCIS_PROCESSING_TIMES}>Official processing times</ExternalLink>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
