import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FaqList } from "@/components/FaqList";
import { PageIntro } from "@/components/ui/PageIntro";
import { focusRing, readContainer, section, textLink } from "@/lib/ui";
import { COMPANY } from "@/lib/company";

const inlineLink = `rounded-sm font-medium text-blue underline decoration-blue/30 underline-offset-4 hover:decoration-blue ${focusRing}`;
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema, pageMetadata, webPageSchema } from "@/lib/seo";
import { FAQ } from "@/lib/content";

export const metadata = pageMetadata({
  title: "Help Center: Receipt Numbers and Cost",
  description: "Answers to the questions people ask most: what a USCIS receipt number is, what the receipt check does, what it costs and whether TrackMyUSCIS is part of USCIS.",
  path: "/help",
});

export default function HelpPage() {
  return (
    <>
      <JsonLd data={[webPageSchema({ name: "Help center", description: "Answers about receipt numbers, tracking and cost.", path: "/help" }), breadcrumbSchema([{ name: "Help center", path: "/help" }]), faqSchema(FAQ)]} />
      <PageIntro title="Help center" description="Answers to the questions people ask us most." width={readContainer} />
      <section className={section}>
        <div className={readContainer}>
          <div>
            <FaqList />
            <div className="mt-12 flex flex-col items-start gap-1">
              <Link href="/answers" className={textLink}>
                More USCIS questions answered
                <ArrowRight aria-hidden className="size-4" />
              </Link>
              <Link href="/status-explained" className={textLink}>
                What each case status means
                <ArrowRight aria-hidden className="size-4" />
              </Link>
              <Link href="/guides" className={textLink}>
                Read the immigration guides
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            </div>
            <p className="mt-10 border-t border-border pt-8 text-body text-slate">
              Still need help? Email{" "}
              <a href={`mailto:${COMPANY.email.support}`} className={`${inlineLink}`}>
                {COMPANY.email.support}
              </a>
              . We usually reply within two business days.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
