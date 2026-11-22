import { ChevronDown } from "lucide-react";
import { FAQ } from "@/lib/content";
import { rowPad, rows } from "@/lib/ui";

export function FaqList() {
  return (
    <div className={rows}>
      {FAQ.map((item) => (
        <details key={item.q} className="disclosure group">
          <summary
            className={`flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 ${rowPad} py-4 text-left text-title font-semibold text-midnight transition-colors duration-200 hover:bg-cloud group-open:hover:bg-white focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue`}
          >
            {item.q}
            <ChevronDown aria-hidden className="faq-chevron size-5 shrink-0 text-slate transition-transform duration-200" />
          </summary>
          <p className={`max-w-2xl ${rowPad} pb-6 text-body text-slate`}>{item.a}</p>
        </details>
      ))}
    </div>
  );
}
