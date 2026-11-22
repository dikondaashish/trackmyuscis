"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { AccountLink } from "@/components/AccountLink";
import { bestMatch, isCurrent, menuIsCurrent, type MenuItem, type NavEntry } from "@/lib/site";

const row =
  "flex min-h-11 items-center rounded-lg px-3 text-body text-midnight transition-colors duration-200 hover:bg-ice focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue";

/** Phone and tablet menu: the same groups as the desktop header, each one a section that opens on tap. */
export function MobileMenu({ entries }: { entries: NavEntry[] }) {
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
        className="inline-flex size-10 cursor-pointer items-center justify-center rounded-[10px] text-midnight transition-colors duration-200 hover:bg-ice focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
      >
        {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="menu-in absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-b border-border bg-white shadow-[0_16px_32px_-16px_rgba(16,34,61,0.2)]"
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
          <ul className="stagger flex flex-col" style={{ "--stagger-base": "40ms" } as React.CSSProperties}>
            {entries.map((entry) => (
              <li key={entry.label}>
                {entry.kind === "link" ? (
                  <Link
                    href={entry.href}
                    onClick={() => setOpen(false)}
                    aria-current={isCurrent(pathname, entry.href) ? "page" : undefined}
                    className={`${row} aria-[current=page]:bg-ice aria-[current=page]:font-semibold`}
                  >
                    {entry.label}
                  </Link>
                ) : (
                  <details className="disclosure group" open={menuIsCurrent(pathname, entry) || undefined}>
                    <summary className={`${row} cursor-pointer list-none justify-between [&::-webkit-details-marker]:hidden`}>
                      {entry.label}
                      <ChevronDown
                        aria-hidden
                        className="size-5 text-slate transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
                      />
                    </summary>
                    <ul className={`mb-2 ml-3 border-l border-border pl-2 ${entry.columns === 2 ? "grid grid-cols-2" : "flex flex-col"}`}>
                      {([...entry.items, ...(entry.footer ? [entry.footer] : [])] as MenuItem[]).map((item, _i, all) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => setOpen(false)}
                            aria-current={item.href === bestMatch(pathname, all) ? "page" : undefined}
                            className="flex min-h-11 flex-col justify-center rounded-lg px-3 py-1.5 text-small text-slate transition-colors duration-200 hover:bg-ice hover:text-midnight aria-[current=page]:bg-ice aria-[current=page]:font-semibold aria-[current=page]:text-midnight focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue"
                          >
                            {item.note && entry.columns === 2 ? (
                              <>
                                <span className="font-semibold text-midnight">{item.label}</span>
                                <span>{item.note}</span>
                              </>
                            ) : (
                              item.label
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-2 border-t border-border px-3 pt-3 pb-1">
            <AccountLink
              onNavigate={() => setOpen(false)}
              className="flex h-12 w-full items-center justify-center rounded-[10px] border border-border text-body font-semibold text-midnight transition-colors duration-200 hover:border-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
            />
          </div>
        </nav>
      </div>
    </div>
  );
}
