import { ArrowUpRight } from "lucide-react";
import { focusRing } from "@/lib/ui";

/** The official pages a page's facts were checked against. Opens each in a new tab. */
export function OfficialSources({ sources, className = "", id }: { sources: { label: string; href: string }[]; className?: string; id?: string }) {
  return (
    <section id={id} className={className}>
      <h2 className="text-title font-semibold text-midnight">Official sources</h2>
      <ul className="mt-2">
        {sources.map((src) => (
          <li key={src.href}>
            <a
              href={src.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group inline-flex min-h-11 items-center gap-1.5 rounded text-body font-medium text-blue ${focusRing}`}
            >
              {src.label}
              <ArrowUpRight aria-hidden className="size-4 shrink-0" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
