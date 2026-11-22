import { GuideLinks, GuidePage, guideSectionTitle } from "@/components/app/Guide";
import { ANSWERS, TOPICS } from "@/lib/answers";
import { pageMetadata } from "@/lib/seo";

// The public /answers page is the indexed one.
export const metadata = pageMetadata({
  title: "Common questions",
  description: "Short, plain-English answers to common USCIS questions.",
  path: "/answers",
  noindex: true,
});

export default function DashboardAnswersPage() {
  return (
    <GuidePage title="USCIS questions, answered" description="Each answer is checked against uscis.gov and links to the official source.">
      {TOPICS.map((topic, i) => (
        <section key={topic} aria-label={topic} className={i ? "mt-8" : ""}>
          <h2 className={guideSectionTitle}>{topic}</h2>
          <GuideLinks
            className="mt-2.5"
            items={ANSWERS.filter((a) => a.topic === topic).map((a) => ({ href: `/dashboard/answers/${a.slug}`, title: a.question, note: a.short }))}
          />
        </section>
      ))}
    </GuidePage>
  );
}
