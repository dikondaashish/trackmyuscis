import { focusRing } from "@/lib/ui";

/**
 * Where a page's facts were checked: a quiet line of citations at the end of the page.
 * They are references, not the next step, so they are small text, never buttons.
 */
export function SourceNote({
  sources,
  className = "",
  id,
}: {
  sources: { label: string; href: string }[];
  className?: string;
  id?: string;
}) {
  if (sources.length === 0) return null;
  return (
    <section id={id} aria-label="Sources" className={`border-t border-border pt-5 text-small text-slate ${className}`}>
      <h2 className="font-semibold text-midnight">Checked against</h2>
      <ul className="mt-1 flex flex-col gap-x-5 sm:flex-row sm:flex-wrap">
        {sources.map((src) => (
          <li key={src.href}>
            <a
              href={src.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex min-h-11 items-center rounded underline decoration-border underline-offset-4 transition-colors duration-200 hover:text-midnight hover:decoration-slate sm:min-h-9 ${focusRing}`}
            >
              {src.label.replace(/^USCIS: /, "")}
              <span className="sr-only"> (uscis.gov, opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
