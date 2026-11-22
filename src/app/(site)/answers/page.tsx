import { JsonLd } from "@/components/JsonLd";
import { LinkRows } from "@/components/ui/LinkRows";
import { PageIntro } from "@/components/ui/PageIntro";
import { ANSWERS, ANSWERS_UPDATED, TOPICS } from "@/lib/answers";
import { breadcrumbSchema, itemListSchema, pageMetadata, webPageSchema } from "@/lib/seo";
import { focusRing, readContainer, section } from "@/lib/ui";

export const metadata = pageMetadata({
  title: "USCIS Questions Answered in Plain English",
  description:
    "Short, plain-English answers to common USCIS questions: receipt numbers, case status, notices, biometrics, RFEs, processing times and delayed cases.",
  path: "/answers",
});

const topicId = (topic: string) => topic.toLowerCase().replace(/[^a-z0-9]+/g, "-");

/** Every question with its short answer, grouped by topic. One list, no cards. */
export default function AnswersPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ name: "USCIS questions answered", description: "Short answers to common USCIS questions.", path: "/answers", type: "CollectionPage", dateModified: ANSWERS_UPDATED }),
          breadcrumbSchema([{ name: "Answers", path: "/answers" }]),
          itemListSchema("USCIS questions", ANSWERS.map((a) => ({ name: a.question, path: `/answers/${a.slug}` }))),
        ]}
      />
      <PageIntro
        title="USCIS questions, answered"
        description="Each answer is checked against uscis.gov and links to the official source."
        width={readContainer}
      >
        <nav aria-label="Topics" className="no-print">
          <ul className="flex flex-wrap gap-2">
            {TOPICS.map((topic) => (
              <li key={topic}>
                <a
                  href={`#${topicId(topic)}`}
                  className={`inline-flex min-h-11 items-center rounded-full border border-border bg-white px-4 text-small font-medium text-midnight transition-colors duration-200 hover:border-blue hover:text-blue ${focusRing}`}
                >
                  {topic}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageIntro>
      <section className={section}>
        <div className={readContainer}>
          <div>
            {TOPICS.map((topic, i) => (
              <div key={topic} id={topicId(topic)} className={`scroll-mt-28 ${i ? "mt-12" : ""}`}>
                <h2 className="text-h3 text-midnight">{topic}</h2>
                <LinkRows
                  className="mt-5"
                  items={ANSWERS.filter((a) => a.topic === topic).map((a) => ({ href: `/answers/${a.slug}`, title: a.question, note: a.short }))}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
