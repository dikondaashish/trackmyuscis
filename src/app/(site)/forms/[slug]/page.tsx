import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema, longDate, pageMetadata, webPageSchema } from "@/lib/seo";
import { DocumentChecklist } from "@/components/DocumentChecklist";
import { Journey } from "@/components/Journey";
import { TrackCard } from "@/components/TrackCard";
import { Questions } from "@/components/ui/Questions";
import { SectionTabs } from "@/components/ui/SectionTabs";
import { SourceNote } from "@/components/ui/SourceNote";
import { Stats, ToolHero, type Stat } from "@/components/ui/ToolHero";
import { RichText } from "@/components/ui/RichText";
import { notFound } from "next/navigation";
import { LinkRows } from "@/components/ui/LinkRows";
import { getAnswer } from "@/lib/answers";
import { FORM_RELATED, FORMS, FORMS_UPDATED, getForm, getGuide, officialFormUrl, USCIS_FEE_SCHEDULE, type UscisForm } from "@/lib/content";
import { FEE_SCHEDULE_EDITION, FORM_FACTS, FORM_FACTS_CHECKED, feeSentence } from "@/lib/form-facts";
import { postsForForm } from "@/lib/related";
import { btnSecondary, container, panel, section } from "@/lib/ui";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { getPtForm, ptShortAnswer, rangeText } from "@/lib/processing-times";

/** Section headings: they stop below the sticky header and section bar when jumped to. */
const heading = "jump-target scroll-mt-36 text-h2 text-midnight";

const titleCase = (s: string) => s.replace(/\b[a-z]/g, (c) => c.toUpperCase());

/** Title of an answer or guide page from its path. */
function relatedTitle(path: string) {
  const slug = path.split("/").pop() ?? "";
  return path.startsWith("/answers/") ? getAnswer(slug)?.question : getGuide(slug)?.title;
}

/** Every known page is prerendered; unknown ones return a real 404, so navigation may wait on the server. */
export const instant = false;

export function generateStaticParams() {
  return FORMS.map((f) => ({ slug: f.slug }));
}

/** Date shown on the page: the newer of the notes check and the fee and document check. */
const updated = FORMS_UPDATED > FORM_FACTS_CHECKED ? FORMS_UPDATED : FORM_FACTS_CHECKED;

/** What the page covers, named the way people search: "Fee, Documents and Steps". */
function covers(slug: string) {
  const facts = FORM_FACTS[slug];
  if (!facts) return "Steps After Filing";
  return facts.documents?.items.length ? "Fee, Documents and Steps" : "Fee, How to File and Steps";
}

/** The questions people search about a form, answered from the facts on the page. */
function faq(f: UscisForm) {
  const facts = FORM_FACTS[f.slug];
  const pt = getPtForm(f.slug);
  const fee = feeSentence(f.slug);
  return [
    ...(facts
      ? [
          {
            q: `How much does Form ${f.form} cost?`,
            a: fee
              ? `The general filing fee for Form ${f.form} is ${fee}, on the USCIS Fee Schedule dated ${FEE_SCHEDULE_EDITION}.${facts.feeNote ? ` ${facts.feeNote}` : ""}`
              : `The fee depends on what you are asking for. On the USCIS Fee Schedule dated ${FEE_SCHEDULE_EDITION}: ${facts.fees.map((r) => `${r.label.toLowerCase()}, ${r.amount}`).join("; ")}.${facts.feeNote ? ` ${facts.feeNote}` : ""}`,
          },
        ]
      : []),
    ...(pt ? [{ q: `How long does Form ${f.form} take?`, a: ptShortAnswer(pt) }] : []),
    ...(facts ? [{ q: `Who files Form ${f.form}?`, a: facts.who }] : []),
    ...(facts
      ? [
          {
            q: `Which edition of Form ${f.form} does USCIS accept?`,
            a: `The edition dated ${facts.edition} (month/day/year), as listed on uscis.gov on ${longDate(FORM_FACTS_CHECKED)}.${facts.editionNote ? ` ${facts.editionNote}` : ""} The edition date is printed at the bottom of every page of the form.`,
          },
        ]
      : []),
  ];
}

export async function generateMetadata({ params }: PageProps<"/forms/[slug]">): Promise<Metadata> {
  const f = getForm((await params).slug);
  if (!f) return {};
  const fee = feeSentence(f.slug);
  const options = [
    ...(fee ? [`${f.about} Fee: ${fee}. What to send, how to file and the steps after.`, `${f.about} Fee: ${fee}, plus how to file.`] : []),
    `${f.about} The current fee, how to file and the steps most cases go through.`,
    `${f.about} Fees, filing and the steps after.`,
    f.about,
  ];
  return pageMetadata({
    title: `Form ${f.form} (${titleCase(f.label)}): ${covers(f.slug)}`,
    description: options.find((d) => d.length <= 160) ?? f.about,
    path: `/forms/${f.slug}`,
  });
}

export default async function FormPage({ params }: PageProps<"/forms/[slug]">) {
  const f = getForm((await params).slug);
  if (!f) notFound();
  const related = (FORM_RELATED[f.slug] ?? []).flatMap((path) => {
    const title = relatedTitle(path);
    return title ? [{ path, title }] : [];
  });

  const facts = FORM_FACTS[f.slug];
  const pt = getPtForm(f.slug);
  const questions = faq(f);
  const posts = postsForForm(f.slug);
  const tabs = [
    { id: "know", label: "What to know" },
    ...(facts ? [{ id: "fee", label: "Fee" }] : []),
    ...(facts?.documents ? [{ id: "documents", label: "Documents" }] : []),
    { id: "steps", label: "Steps" },
    ...(pt ? [{ id: "time", label: "Processing time" }] : []),
    ...(questions.length > 0 ? [{ id: "faq", label: "Questions" }] : []),
    ...(related.length + posts.length > 0 ? [{ id: "questions", label: "Related" }] : []),
  ];
  // The fees most people pay (extras such as "+ $600" are in the table below).
  const main = facts?.fees.filter((r) => /^filed (on paper|online)$/i.test(r.label));
  const amounts = (main?.length ? main : (facts?.fees ?? [])).map((r) => r.amount).filter((a) => /^\$[\d,]+$/.test(a));
  const dollars = (a: string) => Number(a.replace(/[^\d]/g, ""));
  const sorted = [...amounts].sort((x, y) => dollars(x) - dollars(y));
  const stats: Stat[] = [
    ...(sorted.length > 0
      ? [
          {
            label: "Filing fee",
            value: sorted.length > 1 && sorted[0] !== sorted[sorted.length - 1] ? `${sorted[0]} to ${sorted[sorted.length - 1]}` : sorted[0],
            note: feeSentence(f.slug) ? "Online or on paper" : "Depends on what you ask for",
            href: "#fee",
          },
        ]
      : []),
    ...(pt ? [{ label: "Processing time", value: rangeText(pt), note: "80% of cases finished within", href: `/processing-times/${f.slug}` }] : []),
    { label: "Steps after filing", value: String(f.milestones.length), note: `${f.milestones[0]} to ${f.milestones[f.milestones.length - 1].toLowerCase()}`, href: "#steps" },
    ...(facts ? [{ label: "Form edition", value: facts.edition, note: "The edition USCIS accepts" }] : []),
  ];

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ name: `Form ${f.form}: ${f.title}`, description: f.about, path: `/forms/${f.slug}`, dateModified: updated }),
          ...(questions.length > 0 ? [faqSchema(questions)] : []),
          breadcrumbSchema([
            { name: "Forms", path: "/forms" },
            { name: `Form ${f.form}`, path: `/forms/${f.slug}` },
          ]),
        ]}
      />
      <ToolHero
        title={`Form ${f.form}: ${f.label}`}
        description={f.about}
        back={{ href: "/forms", label: "All forms" }}
        meta={
          <>
            <p>Official name: {f.title}</p>
            <p className="mt-1">Updated {longDate(updated)} · Checked against uscis.gov</p>
          </>
        }
      >
        <Stats items={stats} />
      </ToolHero>
      <SectionTabs label={`Form ${f.form} sections`} items={tabs} />

      <section className={section}>
        <div className={`${container} grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12`}>
          <div className="min-w-0">
            <h2 id="know" className={heading}>What to know</h2>
            {facts && (
              <div className={`mt-6 ${panel} border-blue/15 bg-ice`}>
                <h3 className="text-small font-semibold text-blue">Who files it</h3>
                <p className="mt-2 max-w-2xl text-lead text-midnight">{facts.who}</p>
              </div>
            )}
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {f.sections.map((s) => (
                <div key={s.heading} className={panel}>
                  <h3 className="text-title font-semibold text-midnight">{s.heading}</h3>
                  <p className="mt-2 text-body text-slate">
                    <RichText text={s.body} />
                  </p>
                </div>
              ))}
            </div>

            {facts && (
              <>
                <h2 id="fee" className={`mt-14 ${heading}`}>Filing fee</h2>
                <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                  {facts.fees.map((r) => (
                    <div key={r.label} className={`flex flex-col-reverse justify-end ${panel}`}>
                      <dt className="mt-1 text-body text-slate">{r.label}</dt>
                      <dd className="text-h2 text-midnight tabular-nums">{r.amount}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 max-w-2xl text-small text-slate">
                  {facts.feeNote ? `${facts.feeNote} ` : ""}Read from the USCIS Fee Schedule (edition {FEE_SCHEDULE_EDITION}) on{" "}
                  {longDate(FORM_FACTS_CHECKED)}. USCIS rejects a filing with the wrong fee, so confirm it on the day you file.
                </p>
              </>
            )}

            {facts?.documents && (
              <>
                <h2 id="documents" className={`mt-14 ${heading}`}>What to send with it</h2>
                <p className="mt-3 max-w-2xl text-body text-slate">
                  {facts.documents.intro}
                  {facts.documents.items.length > 0 ? " Tick each one off as you gather it." : ""}
                </p>
                {facts.documents.items.length > 0 && (
                  <div className="mt-6">
                    <DocumentChecklist slug={f.slug} items={facts.documents.items} />
                  </div>
                )}
                <p className="mt-4 max-w-2xl text-small text-slate">
                  A summary, not the full list: the form instructions say exactly what your case needs. Your ticks are saved in this
                  browser only. The current edition of Form {f.form} is dated {facts.edition}.
                  {facts.editionNote ? ` ${facts.editionNote}` : ""}
                </p>
              </>
            )}

            <h2 id="steps" className={`mt-14 ${heading}`}>Steps most cases go through</h2>
            <div className="mt-6">
              <Journey steps={f.milestones} />
            </div>
            <p className="mt-4 max-w-xl text-small text-slate">
              Every case is different. Your official USCIS notices always come first.
            </p>

            {pt && (
              <>
                <h2 id="time" className={`mt-14 ${heading}`}>How long it takes</h2>
                <div className={`mt-6 grid items-center gap-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-8 ${panel}`}>
                  <div>
                    <p className="text-small text-slate">80% of cases finished within</p>
                    <p className="mt-1 text-h2 text-midnight tabular-nums">{rangeText(pt)}</p>
                  </div>
                  <div className="sm:border-l sm:border-border sm:pl-8">
                    <p className="text-body text-slate">{ptShortAnswer(pt)}</p>
                    <Link href={`/processing-times/${f.slug}`} className={`mt-4 ${btnSecondary}`}>
                      Check your office and date
                      <ArrowRight aria-hidden className="size-4 shrink-0" />
                    </Link>
                  </div>
                </div>
              </>
            )}

            {questions.length > 0 && (
              <>
                <h2 id="faq" className={`mt-14 ${heading}`}>Common questions</h2>
                <Questions className="mt-6" items={questions} />
              </>
            )}

            {related.length + posts.length > 0 && (
              <>
                <h2 id="questions" className={`mt-14 ${heading}`}>More on {f.form} cases</h2>
                <LinkRows
                  compact
                  className="mt-6"
                  items={[...posts.map((b) => ({ href: `/blog/${b.slug}`, title: b.title })), ...related.map((r) => ({ href: r.path, title: r.title }))]}
                />
              </>
            )}

            <SourceNote
              className="mt-14"
              sources={[
                { label: `USCIS: Form ${f.form}, ${f.title}`, href: officialFormUrl(f) },
                ...(facts ? [{ label: "USCIS: Fee Schedule (Form G-1055)", href: USCIS_FEE_SCHEDULE }] : []),
                ...(facts?.documents?.source ? [facts.documents.source] : []),
                ...(f.sources ?? []),
              ]}
            />
          </div>

          <aside className="lg:pt-1">
            <div className="lg:sticky lg:top-36">
              <TrackCard
                title={`Filed Form ${f.form}?`}
                text="Enter your receipt number to see which office has it, then save it to follow its status."
              />
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
