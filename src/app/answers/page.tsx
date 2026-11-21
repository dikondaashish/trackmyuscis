import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
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
              <div key={topic} id={topicId(topic)} className={i ? "mt-16" : ""}>
                <h2 className="text-h3 text-midnight">{topic}</h2>
                <ul className="mt-4 divide-y divide-border border-y border-border">
                  {ANSWERS.filter((a) => a.topic === topic).map((a) => (
                    <li key={a.slug}>
                      <Link
                        href={`/answers/${a.slug}`}
                        className={`group flex items-center justify-between gap-6 rounded-md py-5 ${focusRing}`}
                      >
                        <span>
                          <span className="block text-title font-semibold text-midnight transition-colors duration-200 group-hover:text-blue">
                            {a.question}
                          </span>
                          <span className="mt-1 block text-body text-slate">{a.short}</span>
                        </span>
                        <ArrowRight
                          aria-hidden
                          className="size-5 shrink-0 text-slate transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:text-blue motion-reduce:transition-none"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
