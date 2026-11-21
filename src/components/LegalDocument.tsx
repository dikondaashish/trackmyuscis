import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageIntro } from "@/components/ui/PageIntro";
import { Prose } from "@/components/ui/Prose";
import { LEGAL_DOCS, POLICY_ORDER, type LegalDoc } from "@/lib/legal";
import { docContainer, focusRing, section } from "@/lib/ui";

/**
 * A policy or long-form trust page: title and summary, then an "On this page" list
 * (sticky on desktop) beside short numbered sections at reading width, centred as one
 * 960px block so the page is balanced on wide screens.
 */
export function LegalDocument({ slug, doc }: { slug: string; doc: LegalDoc }) {
  const related = doc.policy ? POLICY_ORDER.filter((k) => k !== slug) : [];

  return (
    <>
      <PageIntro
        title={doc.title}
        description={doc.summary}
        back={doc.policy ? { href: "/legal", label: "Legal" } : undefined}
        width={docContainer}
      >
        {doc.updated && (
          <p className="text-small text-slate">
            Last updated {doc.updated}
          </p>
        )}
      </PageIntro>

      <section className={section}>
        <div className={`${docContainer} grid gap-12 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16`}>
          <nav aria-label="On this page" className="hidden lg:block">
            <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pb-4">
              <p className="text-small font-semibold text-midnight">On this page</p>
              <ul className="mt-2 border-l border-border">
                {doc.sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className={`-ml-px flex min-h-11 items-center border-l border-transparent py-1 pl-4 text-small text-slate transition-colors duration-200 hover:border-blue hover:text-midnight ${focusRing}`}
                    >
                      {s.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <article className="max-w-2xl">
            {doc.sections.map((s, i) => (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className={`scroll-mt-28 ${i ? "mt-12" : ""}`}>
                <h2 id={`${s.id}-h`} className="text-title font-semibold text-midnight">
                  {s.heading}
                </h2>
                <div className="mt-3">
                  <Prose blocks={s.body} />
                </div>
              </section>
            ))}

            {related.length > 0 && (
              <div className="mt-16 border-t border-border pt-10">
                <h2 className="text-title font-semibold text-midnight">Other policies</h2>
                <ul className="mt-4 grid gap-x-8 sm:grid-cols-2">
                  {related.map((k) => (
                    <li key={k}>
                      <Link
                        href={`/${k}`}
                        className={`group inline-flex min-h-11 items-center gap-1.5 rounded text-body font-medium text-blue ${focusRing}`}
                      >
                        {LEGAL_DOCS[k].title}
                        <ArrowRight
                          aria-hidden
                          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>
        </div>
      </section>
    </>
  );
}
