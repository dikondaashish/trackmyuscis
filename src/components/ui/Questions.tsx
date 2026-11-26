import { ChevronDown } from "lucide-react";
import { rowPad, rows } from "@/lib/ui";

/** Questions that open in place. Every answer stays in the HTML for search engines. */
export function Questions({ items, className = "" }: { items: { q: string; a: string }[]; className?: string }) {
  return (
    <div className={`${rows} ${className}`}>
      {items.map((item) => (
        <details key={item.q} className="disclosure group">
          <summary
            className={`flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 ${rowPad} py-4 text-left text-body font-semibold text-midnight transition-colors duration-200 hover:bg-cloud group-open:hover:bg-white focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue`}
          >
            <h3>{item.q}</h3>
            <ChevronDown aria-hidden className="faq-chevron size-5 shrink-0 text-slate transition-transform duration-200" />
          </summary>
          <p className={`max-w-2xl ${rowPad} pb-5 text-body text-slate`}>{item.a}</p>
        </details>
      ))}
    </div>
  );
}
