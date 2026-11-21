"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { isCurrent, PRIMARY_NAV, SECONDARY_NAV } from "@/lib/site";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex size-11 cursor-pointer items-center justify-center rounded-[10px] text-midnight transition-colors duration-200 hover:bg-ice focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
      >
        {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-border bg-white shadow-[0_16px_32px_-16px_rgba(16,34,61,0.2)]"
      >
        <nav aria-label="Mobile" className="mx-auto max-w-7xl px-2 py-3 sm:px-5">
          <Link
            href="/search"
            onClick={() => setOpen(false)}
            aria-current={pathname === "/search" ? "page" : undefined}
            className="mx-3 mb-2 flex h-12 items-center gap-3 rounded-[10px] border border-border px-4 text-body text-slate transition-colors duration-200 hover:border-blue sm:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
          >
            <Search aria-hidden className="size-5" />
            Search the site
          </Link>
          <ul className="flex flex-col">
            {PRIMARY_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
                  className="flex min-h-12 items-center rounded-lg px-3 text-body text-midnight transition-colors duration-200 hover:bg-ice aria-[current=page]:bg-ice aria-[current=page]:font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="mt-2 flex flex-col border-t border-border pt-2">
            {SECONDARY_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
                  className="flex min-h-11 items-center rounded-lg px-3 text-small text-slate transition-colors duration-200 hover:bg-ice hover:text-midnight aria-[current=page]:font-semibold aria-[current=page]:text-midnight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
