import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { rowArrow, rowLink, rows } from "@/lib/ui";

/**
 * The one list of links: a white panel, one row per page, with an optional line under
 * each title. `compact` is for short lists inside a longer page.
 */
export function LinkRows({
  items,
  compact = false,
  className = "",
}: {
  items: { href: string; title: React.ReactNode; note?: string }[];
  compact?: boolean;
  className?: string;
}) {
  return (
    <ul className={`${rows} ${className}`}>
      {items.map((item) => (
        <li key={item.href}>
          <Link href={item.href} className={`${rowLink} ${compact ? "min-h-14 py-4" : ""}`}>
            <span className="min-w-0">
              <span
                className={`block font-semibold text-midnight transition-colors duration-200 group-hover:text-blue ${compact ? "text-body" : "text-title"}`}
              >
                {item.title}
              </span>
              {item.note && <span className="mt-1 block text-body text-slate">{item.note}</span>}
            </span>
            <ArrowRight aria-hidden className={rowArrow} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
