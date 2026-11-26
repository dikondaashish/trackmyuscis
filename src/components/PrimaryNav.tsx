"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { NAV_ICONS } from "@/components/NavIcons";
import { bestMatch, menuIsCurrent, type NavEntry } from "@/lib/site";

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue";
const trigger = `inline-flex min-h-11 cursor-pointer items-center gap-1 whitespace-nowrap rounded-lg px-3 text-small font-medium text-slate transition-colors duration-200 hover:bg-cloud hover:text-midnight data-[active=true]:text-midnight ${focus}`;

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
                className={`${trigger} ${isOpen ? "bg-cloud text-midnight" : ""}`}
              >
                {entry.label}
                <ChevronDown
                  aria-hidden
                  className={`size-4 transition-transform duration-200 motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              <div id={panelId} hidden={!isOpen} className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2">
                <div
                  className={`menu-in rounded-xl border border-border bg-white p-2 shadow-[0_24px_48px_-24px_rgba(16,34,61,0.25)] ${
                    entry.columns === 2 ? "w-[30rem]" : entry.featured ? "grid w-[38rem] grid-cols-[1fr_13rem] gap-2" : "w-80"
                  }`}
                >
                  <div>
                  <ul className={entry.columns === 2 ? "grid grid-cols-2 gap-1" : "flex flex-col gap-0.5"}>
                    {entry.items.map((item) => {
                      const current = item.href === match;
                      const Icon = item.icon ? NAV_ICONS[item.icon] : null;
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            aria-current={current ? "page" : undefined}
                            onClick={() => setOpen(null)}
                            className={`group flex min-h-11 items-center gap-3 rounded-[10px] px-3 py-2.5 transition-colors duration-200 hover:bg-cloud aria-[current=page]:bg-ice ${focus}`}
                          >
                            {Icon && (
                              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-ice text-blue transition-colors duration-200 group-hover:bg-blue group-hover:text-white group-aria-[current=page]:bg-white">
                                <Icon aria-hidden className="size-5" />
                              </span>
                            )}
                            <span className="flex min-w-0 flex-col">
                              <span className="text-small font-semibold text-midnight">{item.label}</span>
                              {item.note && <span className="text-small text-slate">{item.note}</span>}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                  </div>
                  {entry.featured && (
                    <Link
                      href={entry.featured.href}
                      onClick={() => setOpen(null)}
                      className={`group flex flex-col justify-between gap-4 rounded-[10px] bg-cloud p-3 transition-colors duration-200 hover:bg-ice ${focus}`}
                    >
                      <span>
                        {entry.featured.image && (
                          <span className="block aspect-video overflow-hidden rounded-lg bg-ice">
                            <Image
                              src={entry.featured.image.src}
                              alt={entry.featured.image.alt}
                              sizes="184px"
                              placeholder="blur"
                              className="size-full object-cover transition-[scale] duration-300 group-hover:scale-[1.03] motion-reduce:transition-none"
                            />
                          </span>
                        )}
                        <span className="mt-3 block px-1 text-caption font-medium text-teal">{entry.featured.label}</span>
                        <span className="mt-1 line-clamp-3 px-1 text-small font-semibold text-midnight">{entry.featured.title}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 px-1 pb-1 text-small font-semibold text-blue">
                        {entry.featured.cta}
                        <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none" />
                      </span>
                    </Link>
                  )}
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
