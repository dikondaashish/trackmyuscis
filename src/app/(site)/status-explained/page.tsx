import { PageIntro } from "@/components/ui/PageIntro";
import { StatusFinder } from "@/components/StatusFinder";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { STATUSES, USCIS_CASE_STATUS } from "@/lib/content";
import { readContainer, section } from "@/lib/ui";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, definedTermSetSchema, pageMetadata, webPageSchema } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "USCIS Case Status Meanings in Plain English",
  description: "Plain-English meanings for every common USCIS case status, from Case Was Received to Case Was Approved, and what usually happens next.",
  path: "/status-explained",
});

export default function StatusExplainedPage() {
  return (
    <>
      <JsonLd data={[webPageSchema({ name: "USCIS case statuses explained", description: "Plain-English meanings for common USCIS case statuses.", path: "/status-explained" }), breadcrumbSchema([{ name: "Case statuses", path: "/status-explained" }]), definedTermSetSchema("USCIS case statuses", "/status-explained", STATUSES.map((s) => ({ name: s.name, description: s.meaning })))]} />
      <PageIntro
        title="What each USCIS case status means"
        description="The statuses USCIS shows most often, in plain language. The wording on your account can differ slightly."
        width={readContainer}
      />
      <section className={section}>
        <div className={readContainer}>
          <StatusFinder statuses={STATUSES} />
          <ExternalLink href={USCIS_CASE_STATUS} className="mt-10">
            Check your status on uscis.gov
          </ExternalLink>
        </div>
      </section>
    </>
  );
}
