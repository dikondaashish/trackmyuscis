"use client";

import { useEffect, useState } from "react";

/**
 * The sticky header bar. At the top of the page it sits flat on the page with no border;
 * once the page scrolls, a hairline border and a light blur separate it from the content.
 */
export function HeaderShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 4);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      data-scrolled={scrolled}
      className="sticky top-0 z-40 border-b border-transparent bg-white transition-[border-color,background-color] duration-200 data-[scrolled=true]:border-border data-[scrolled=true]:bg-white/85 data-[scrolled=true]:backdrop-blur-md print:static"
    >
      {children}
    </header>
  );
}
