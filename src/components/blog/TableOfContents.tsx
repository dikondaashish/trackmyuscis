"use client";

import { useEffect, useState } from "react";
import { focusRing } from "@/lib/ui";

/**
 * "On this page" for a blog post. Sticky beside the article on desktop. The section being read
 * is the last one whose top has reached its anchor position under the header; checked once per frame.
 */
export function TableOfContents({ items }: { items: { id: string; heading: string }[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = items[0]?.id ?? "";
      const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      for (const i of items) {
        const el = document.getElementById(i.id);
        // A section counts once its top reaches the spot a contents link scrolls it to.
        const line = el ? padding + (parseFloat(getComputedStyle(el).scrollMarginTop) || 0) + 32 : 0;
        if (el && el.getBoundingClientRect().top <= line) current = i.id;
      }
      // At the very bottom, the last section is the one being read even if it's short.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = items.at(-1)?.id ?? current;
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items]);

  return (
    <nav aria-label="On this page">
      <p className="text-small font-semibold text-midnight">On this page</p>
      <ol className="mt-3 border-l border-border">
        {items.map((i) => {
          const on = i.id === active;
          return (
            <li key={i.id}>
              <a
                href={`#${i.id}`}
                aria-current={on ? "location" : undefined}
                className={`-ml-px flex min-h-9 items-center border-l-2 py-1.5 pl-4 text-small transition-colors duration-200 ${focusRing} ${
                  on ? "border-blue font-medium text-blue" : "border-transparent text-slate hover:border-border hover:text-midnight"
                }`}
              >
                {i.heading}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
