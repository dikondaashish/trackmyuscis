import { ArrowUpRight } from "lucide-react";
import { focusRing } from "@/lib/ui";

/**
 * The official pages a page's facts were checked against. Opens each in a new tab.
 * `compact` is the dashboard size.
 */
export function OfficialSources({
  sources,
  className = "",
  id,
  compact = false,
}: {
  sources: { label: string; href: string }[];
  className?: string;
  id?: string;
  compact?: boolean;
}) {
  return (
    <section id={id} className={className}>
      <h2 className={`font-semibold text-midnight ${compact ? "text-small" : "text-title"}`}>Official sources</h2>
      <ul className={compact ? "mt-1" : "mt-2"}>
        {sources.map((src) => (
          <li key={src.href}>
            <a
              href={src.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group inline-flex items-center gap-1.5 rounded font-medium text-blue ${compact ? "min-h-9 text-small" : "min-h-11 text-body"} ${focusRing}`}
            >
              {src.label}
              <ArrowUpRight aria-hidden className={`shrink-0 ${compact ? "size-3.5" : "size-4"}`} />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
