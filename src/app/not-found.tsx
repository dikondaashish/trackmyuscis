import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageIntro } from "@/components/ui/PageIntro";
import { btnPrimary, focusRing, readContainer, section } from "@/lib/ui";

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
          <ul className="divide-y divide-border border-y border-border">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={`group flex min-h-11 items-center justify-between gap-4 rounded py-5 ${focusRing}`}>
                  <span className="text-title font-semibold text-midnight transition-colors duration-200 group-hover:text-blue">{l.label}</span>
                  <ArrowRight
                    aria-hidden
                    className="size-5 shrink-0 text-slate transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:text-blue motion-reduce:transition-none"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
