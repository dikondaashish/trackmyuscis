"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { bestMatch, menuIsCurrent, type NavEntry } from "@/lib/site";

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue";
const trigger = `inline-flex min-h-11 cursor-pointer items-center gap-1 whitespace-nowrap rounded-lg px-2.5 text-small text-slate transition-colors duration-200 hover:bg-ice hover:text-midnight data-[active=true]:font-semibold data-[active=true]:text-midnight xl:px-3 ${focus}`;

/**
 * Desktop header: plain links and dropdown menus. A menu opens on click or keyboard,
 * and on hover for a mouse; it closes on Escape, an outside click or a page change.
 */
export function PrimaryNav({ entries }: { entries: NavEntry[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** True while the open menu was opened by hovering; a click then keeps it open instead of closing it. */
  const byHover = useRef(false);

  // Close on page change.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(null);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const btn = navRef.current?.querySelector<HTMLButtonElement>(`button[data-menu="${open}"]`);
      setOpen(null);
      btn?.focus();
    };
    const onDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };
  const hoverOpen = (label: string) => (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    cancelClose();
    if (open !== label) byHover.current = true;
    setOpen(label);
  };
  const hoverClose = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !byHover.current) return;
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(null), 150);
  };

  return (
    <nav ref={navRef} aria-label="Primary" className="hidden items-center lg:flex">
      <ul className="flex items-center gap-0.5">
        {entries.map((entry) => {
          const active = menuIsCurrent(pathname, entry);
          if (entry.kind === "link") {
            return (
              <li key={entry.label}>
                <Link
                  href={entry.href}
                  data-active={active}
                  aria-current={active ? "page" : undefined}
                  className={trigger}
                >
                  {entry.label}
                </Link>
              </li>
            );
          }
          const isOpen = open === entry.label;
          const match = bestMatch(pathname, [...entry.items, ...(entry.footer ? [entry.footer] : [])]);
          const panelId = `menu-${entry.label.toLowerCase().replace(/\s+/g, "-")}`;
          return (
            <li
              key={entry.label}
              className="relative"
              onPointerEnter={hoverOpen(entry.label)}
              onPointerLeave={hoverClose}
            >
              <button
                type="button"
                data-menu={entry.label}
                data-active={active}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => {
                  if (isOpen && byHover.current) {
                    byHover.current = false; // pinned by the click
                    return;
                  }
                  byHover.current = false;
                  setOpen(isOpen ? null : entry.label);
                }}
                className={`${trigger} ${isOpen ? "bg-ice text-midnight" : ""}`}
              >
                {entry.label}
                <ChevronDown
                  aria-hidden
                  className={`size-4 transition-transform duration-200 motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              <div id={panelId} hidden={!isOpen} className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2">
                <div
                  className={`rounded-xl border border-border bg-white p-2 shadow-[0_24px_48px_-24px_rgba(16,34,61,0.25)] ${entry.columns === 2 ? "w-[30rem]" : "w-80"}`}
                >
                  <ul className={entry.columns === 2 ? "grid grid-cols-2 gap-1" : "flex flex-col gap-1"}>
                    {entry.items.map((item) => {
                      const current = item.href === match;
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            aria-current={current ? "page" : undefined}
                            onClick={() => setOpen(null)}
                            className={`flex min-h-11 flex-col justify-center rounded-[10px] px-3 py-2.5 transition-colors duration-200 hover:bg-cloud aria-[current=page]:bg-ice ${focus}`}
                          >
                            <span className="text-small font-semibold text-midnight">{item.label}</span>
                            {item.note && <span className="text-small text-slate">{item.note}</span>}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                  {entry.footer && (
                    <div className="mt-2 border-t border-border pt-2">
                      <Link
                        href={entry.footer.href}
                        aria-current={entry.footer.href === match ? "page" : undefined}
                        onClick={() => setOpen(null)}
                        className={`group flex min-h-11 items-center justify-between rounded-[10px] px-3 text-small font-semibold text-blue transition-colors duration-200 hover:bg-cloud ${focus}`}
                      >
                        {entry.footer.label}
                        <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
