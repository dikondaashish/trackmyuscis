import { LinkRows } from "@/components/ui/LinkRows";
import { PageIntro } from "@/components/ui/PageIntro";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { FORMS, USCIS_ALL_FORMS } from "@/lib/content";
import { readContainer, section } from "@/lib/ui";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, itemListSchema, pageMetadata, webPageSchema } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "USCIS Forms Explained: I-485, I-130, N-400",
  description: "What each common USCIS form is for, who files it and the steps most cases go through after filing, explained in plain English.",
  path: "/forms",
});

export default function FormsPage() {
  return (
    <>
      <JsonLd data={[webPageSchema({ name: "USCIS forms explained", description: "What each common USCIS form is for and the steps after filing.", path: "/forms", type: "CollectionPage" }), breadcrumbSchema([{ name: "Forms", path: "/forms" }]), itemListSchema("USCIS forms", FORMS.map((f) => ({ name: `Form ${f.form}: ${f.title}`, path: `/forms/${f.slug}` })))]} />
      <PageIntro
        title="USCIS forms"
        description="What each common form is for and the steps most cases go through. Tracking details vary by form and filing method."
        width={readContainer}
      />
      <section className={section}>
        <div className={readContainer}>
          <LinkRows
            items={FORMS.map((f) => ({
              href: `/forms/${f.slug}`,
              title: (
                <>
                  {f.form} <span className="font-normal text-slate">{f.label}</span>
                </>
              ),
              note: f.title,
            }))}
          />
          <ExternalLink href={USCIS_ALL_FORMS} className="mt-8">
            Browse every form on uscis.gov
          </ExternalLink>
        </div>
      </section>
    </>
  );
}
