import { ChevronDown } from "lucide-react";
import { FAQ } from "@/lib/content";
import { focusRing } from "@/lib/ui";

export function FaqList() {
  return (
    <div className="divide-y divide-border border-y border-border">
      {FAQ.map((item) => (
        <details key={item.q} className="group">
          <summary
            className={`flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 rounded py-4 text-left text-title font-semibold text-midnight transition-colors duration-200 hover:text-blue ${focusRing}`}
          >
            {item.q}
            <ChevronDown aria-hidden className="faq-chevron size-5 shrink-0 text-slate transition-transform duration-200" />
          </summary>
          <p className="max-w-2xl pb-6 text-body text-slate">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
