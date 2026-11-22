import { ArrowUpRight } from "lucide-react";
import { GuideLinks, GuidePage } from "@/components/app/Guide";
import { FORMS, USCIS_ALL_FORMS } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { appBtnSecondary } from "@/lib/ui";

// The public /forms page is the indexed one.
export const metadata = pageMetadata({
  title: "USCIS forms",
  description: "What each common USCIS form is for and the steps after filing.",
  path: "/forms",
  noindex: true,
});

export default function DashboardFormsPage() {
  return (
    <GuidePage
      title="USCIS forms"
      description="What each common form is for and the steps most cases go through. Tracking details vary by form and filing method."
    >
      <GuideLinks items={FORMS.map((f) => ({ href: `/dashboard/forms/${f.slug}`, title: `${f.form} · ${f.label}`, note: f.title }))} />
      <a href={USCIS_ALL_FORMS} target="_blank" rel="noopener noreferrer" className={`mt-5 ${appBtnSecondary}`}>
        Browse every form on uscis.gov
        <ArrowUpRight aria-hidden className="size-3.5" />
        <span className="sr-only">(opens uscis.gov in a new tab)</span>
      </a>
    </GuidePage>
  );
}
