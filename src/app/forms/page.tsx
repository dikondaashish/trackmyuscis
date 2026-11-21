import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageIntro } from "@/components/ui/PageIntro";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { FORMS, USCIS_ALL_FORMS } from "@/lib/content";
import { focusRing, readContainer, section } from "@/lib/ui";
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
          <ul className="divide-y divide-border border-y border-border">
            {FORMS.map((f) => (
              <li key={f.slug}>
                <Link href={`/forms/${f.slug}`} className={`group flex items-center justify-between gap-6 rounded-md py-5 ${focusRing}`}>
                  <span>
                    <span className="block text-title font-semibold text-midnight transition-colors duration-200 group-hover:text-blue">
                      {f.form} <span className="font-normal text-slate">{f.label}</span>
                    </span>
                    <span className="mt-1 block text-body text-slate">{f.title}</span>
                  </span>
                  <ArrowRight
                    aria-hidden
                    className="size-5 shrink-0 text-slate transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:text-blue motion-reduce:transition-none"
                  />
                </Link>
              </li>
            ))}
          </ul>
          <ExternalLink href={USCIS_ALL_FORMS} className="mt-12">
            Browse every form on uscis.gov
          </ExternalLink>
        </div>
      </section>
    </>
  );
}
