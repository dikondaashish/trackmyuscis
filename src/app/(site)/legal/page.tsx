import { LinkRows } from "@/components/ui/LinkRows";
import { PageIntro } from "@/components/ui/PageIntro";
import { COMPANY, LEGAL_UPDATED } from "@/lib/company";
import { LEGAL_DOCS, POLICY_ORDER } from "@/lib/legal";
import { focusRing, readContainer, section } from "@/lib/ui";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, pageMetadata, webPageSchema } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Legal: Terms, Privacy and Policies",
  description: `Every policy that applies to ${COMPANY.product} in one place: Terms of Service, Privacy Policy, cookies, your privacy choices, security and accessibility.`,
  path: "/legal",
});

/** Every policy in one list, GOV.UK style: title, one line, arrow. */
export default function LegalPage() {
  return (
    <>
      <JsonLd data={[webPageSchema({ name: "Legal", description: "Every TrackMyUSCIS policy in one place.", path: "/legal", type: "CollectionPage" }), breadcrumbSchema([{ name: "Legal", path: "/legal" }])]} />
      <PageIntro
        title="Legal"
        description={`These policies explain how ${COMPANY.product} works and how we handle your information.`}
        width={readContainer}
      >
        <p className="text-small text-slate">Last updated {LEGAL_UPDATED}</p>
      </PageIntro>
      <section className={section}>
        <div className={readContainer}>
          <LinkRows items={POLICY_ORDER.map((key) => ({ href: `/${key}`, title: LEGAL_DOCS[key].title, note: LEGAL_DOCS[key].summary }))} />
          <p className="mt-8 text-body text-slate">
            Questions about these policies? Email{" "}
            <a
              href={`mailto:${COMPANY.email.legal}`}
              className={`rounded-sm font-medium text-blue underline decoration-blue/30 underline-offset-4 hover:decoration-blue ${focusRing}`}
            >
              {COMPANY.email.legal}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
