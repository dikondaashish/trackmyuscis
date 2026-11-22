import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import { FaqList } from "@/components/FaqList";
import { HeroTracker } from "@/components/HeroTracker";
import { FlowLines } from "@/components/ui/FlowLines";
import { LinkRows } from "@/components/ui/LinkRows";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { RichText } from "@/components/ui/RichText";
import { ANSWERS } from "@/lib/answers";
import { FORMS, USCIS_CASE_STATUS } from "@/lib/content";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, webApplicationSchema, webPageSchema } from "@/lib/seo";
import { cardLink, container, display, lead, rowArrow, section, textLink } from "@/lib/ui";

export const metadata = pageMetadata({
  title: "TrackMyUSCIS: USCIS Case Tracker and Status Meanings",
  description:
    "Free and independent: check your USCIS receipt number, see what each case status means in plain English and find the official processing time for your form.",
  path: "/",
  absoluteTitle: true,
});

/** The questions people search most; each links to a full answer page. */
const TOP_ANSWERS = [
  "how-to-check-uscis-case-status",
  "what-is-a-uscis-receipt-number",
  "how-long-does-uscis-take",
  "why-has-my-uscis-case-status-not-changed",
  "what-is-a-request-for-evidence",
  "uscis-case-approved-what-next",
].map((slug) => ANSWERS.find((a) => a.slug === slug)!);


/**
 * Four sections, one job each: check a receipt number, pick your form, read the answer to
 * your question, then the few things people ask about us. Everything else is one click away
 * in the header.
 */
export default function Home() {
  return (
    <>
      <JsonLd
        data={[
          webApplicationSchema,
          webPageSchema({ name: "TrackMyUSCIS: free USCIS case tracker", description: "Check a USCIS receipt number, understand case statuses and find official processing times.", path: "/" }),
        ]}
      />
      {/* 1. Hero: one job, check a receipt number */}
      <section id="track" aria-labelledby="hero-title" className="relative isolate scroll-mt-20 overflow-hidden bg-cloud lg:scroll-mt-22">
        <FlowLines tone="light" className="absolute inset-0 -z-10 hidden h-full w-full sm:block" />
        <div
          className={`${container} grid items-center gap-14 pt-14 pb-20 sm:pt-20 lg:grid-cols-2 lg:gap-16 lg:pt-24 lg:pb-28`}
        >
          <HeroTracker
            intro={
              <>
                <h1 id="hero-title" className={display}>
                  <span className="block">Track your USCIS case.</span>
                  <span className="block text-blue">Know your next step.</span>
                </h1>
                <p className={`mt-6 max-w-xl ${lead}`}>
                  Enter your receipt number to confirm it and see which USCIS office has your case. Then read what each
                  status means and what usually comes next.
                </p>
              </>
            }
            note={
              <p className="mt-6 flex max-w-xl items-start gap-2 text-small text-slate">
                <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
                <span>
                  <RichText
                    text={`Live status isn't shown here yet. For your latest status, use the [official USCIS case status page](${USCIS_CASE_STATUS}).`}
                  />
                </span>
              </p>
            }
          />
        </div>
      </section>

      {/* 2. Forms: one small card each */}
      <section id="case-types" aria-labelledby="case-types-title" className={`bg-white ${section}`}>
        <div className={container}>
          <SectionIntro
            id="case-types-title"
            title="Find your form"
            description="See the steps most cases go through, from receipt notice to decision."
          />
          <ul className="mt-12 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {FORMS.map((f) => (
              <li key={f.slug}>
                <Link href={`/forms/${f.slug}`} className={`group flex items-center justify-between gap-4 p-5 sm:p-6 ${cardLink}`}>
                  <span className="min-w-0">
                    <span className="block text-title text-midnight transition-colors duration-200 group-hover:text-blue">
                      {f.form}
                    </span>
                    <span className="mt-0.5 block text-body text-slate">{f.label}</span>
                  </span>
                  <ArrowRight aria-hidden className={rowArrow} />
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/status-explained" className={`mt-6 ${textLink}`}>
            What each case status means
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
      </section>

      {/* 3. The questions people search for */}
      <section id="answers" aria-labelledby="answers-title" className={`bg-cloud ${section}`}>
        <div className={`${container} grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-20`}>
          <div>
            <SectionIntro
              id="answers-title"
              title="Answers to common USCIS questions"
              description="Each one is checked against uscis.gov and links to the official source."
            />
            <Link href="/answers" className={`mt-6 ${textLink}`}>
              See all answers
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
          <LinkRows items={TOP_ANSWERS.map((a) => ({ href: `/answers/${a.slug}`, title: a.question }))} />
        </div>
      </section>

      {/* 4. About us, in the questions people ask */}
      <section id="faq" aria-labelledby="faq-title" className={`scroll-mt-20 lg:scroll-mt-22 bg-white ${section}`}>
        <div className={`${container} grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-20`}>
          <SectionIntro id="faq-title" title="About TrackMyUSCIS" />
          <FaqList />
        </div>
      </section>
    </>
  );
}
