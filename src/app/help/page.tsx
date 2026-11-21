import { FaqList } from "@/components/FaqList";
import { LinkRows } from "@/components/ui/LinkRows";
import { PageIntro } from "@/components/ui/PageIntro";
import { focusRing, readContainer, section } from "@/lib/ui";
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
            <h2 className="mt-16 text-h3 text-midnight">Keep reading</h2>
            <LinkRows
              compact
              className="mt-5"
              items={[
                { href: "/answers", title: "More USCIS questions answered" },
                { href: "/status-explained", title: "What each case status means" },
                { href: "/guides", title: "Read the immigration guides" },
              ]}
            />
            <p className="mt-8 text-body text-slate">
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
