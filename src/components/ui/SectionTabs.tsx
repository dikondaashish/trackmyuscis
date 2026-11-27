"use client";

import { useEffect, useState } from "react";
import { container } from "@/lib/ui";

/**
 * The sections of a reference page as a bar that stays under the header. The section in
 * view is marked, so the page reads like a tool with parts instead of one long article.
 */
export function SectionTabs({ items, label }: { items: { id: string; label: string }[]; label: string }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const targets = items.flatMap((i) => document.getElementById(i.id) ?? []);
    // A section counts as current once its heading passes under the header and this bar.
    const observer = new IntersectionObserver(
      (entries) => {
        const seen = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (seen[0]) setActive(seen[0].target.id);
      },
      { rootMargin: "-128px 0px -60% 0px" },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label={label} className="no-print sticky top-16 z-30 border-b border-border bg-white/90 backdrop-blur-md">
      <ul className={`${container} flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}>
        {items.map((item) => {
          const current = item.id === active;
          return (
            <li key={item.id} className="shrink-0 first:-ml-3">
              <a
                href={`#${item.id}`}
                aria-current={current ? "location" : undefined}
                className={`relative flex min-h-12 items-center px-3 text-small font-medium whitespace-nowrap transition-colors duration-200 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue ${
                  current ? "text-midnight" : "text-slate hover:text-midnight"
                }`}
              >
                {item.label}
                <span
                  aria-hidden
                  className={`absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-blue transition-opacity duration-200 ${current ? "opacity-100" : "opacity-0"}`}
                />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
