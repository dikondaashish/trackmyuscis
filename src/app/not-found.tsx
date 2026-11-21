import type { Metadata } from "next";
import Link from "next/link";
import { LinkRows } from "@/components/ui/LinkRows";
import { PageIntro } from "@/components/ui/PageIntro";
import { btnPrimary, readContainer, section } from "@/lib/ui";

export const metadata: Metadata = {
  title: { absolute: "Page not found | TrackMyUSCIS" },
  description: "This page doesn't exist or has moved.",
};

const LINKS = [
  { href: "/status-explained", label: "What each USCIS case status means" },
  { href: "/processing-times", label: "USCIS processing times" },
  { href: "/answers", label: "USCIS questions, answered" },
  { href: "/forms", label: "USCIS forms" },
  { href: "/search", label: "Search the site" },
];

/** Real 404 (Next adds noindex). Says what happened and offers the pages people usually want. */
export default function NotFound() {
  return (
    <>
      <PageIntro
        title="Page not found"
        description="This page doesn't exist or has moved. Check the address, or start from one of the pages below."
        width={readContainer}
      >
        <Link href="/#track" className={btnPrimary}>
          Check a receipt number
        </Link>
      </PageIntro>
      <section className={section}>
        <div className={readContainer}>
          <LinkRows items={LINKS.map((l) => ({ href: l.href, title: l.label }))} />
        </div>
      </section>
    </>
  );
}
