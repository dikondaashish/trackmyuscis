"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { ArrowRight, CornerDownLeft, Search, X } from "lucide-react";
import type { SearchEntry } from "@/lib/search";
import { matchSearch, prepareIndex } from "@/lib/search-match";

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue";

const BROWSE = [
  { href: "/status-explained", label: "Case statuses", note: "What each USCIS status means" },
  { href: "/processing-times", label: "Processing times", note: "How long your form usually takes" },
  { href: "/forms", label: "USCIS forms", note: "Fees, documents and steps" },
  { href: "/answers", label: "USCIS answers", note: "Quick answers to common questions" },
];

/** Loaded once per visit, the first time search opens (the JSON is built at deploy time). */
let indexPromise: Promise<SearchEntry[]> | null = null;
const loadIndex = () =>
  (indexPromise ??= fetch("/search-index.json")
    .then((r) => (r.ok ? (r.json() as Promise<SearchEntry[]>) : Promise.reject(new Error("search index"))))
    .catch((e) => {
      indexPromise = null;
      throw e;
    }));

const noSubscribe = () => () => {};
/** "⌘K" on Apple devices, "Ctrl K" elsewhere; nothing during the server render. */
const useShortcut = () =>
  useSyncExternalStore(
    noSubscribe,
    () => (/Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘K" : "Ctrl K"),
    () => null,
  );

/**
 * Header search: a "Search ⌘K" pill (an icon below 1280px) that opens a quick-search box
 * from anywhere. Arrow keys move through results and Enter opens one. Matching runs in the
 * browser; nothing typed is sent anywhere or put in the address bar.
 */
export function QuickSearch() {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [active, setActive] = useState(0);
  const shortcut = useShortcut();

  const openSearch = () => {
    setOpen(true);
    setFailed(false);
    loadIndex().then(setIndex, () => setFailed(true));
  };
  const openRef = useRef(openSearch);
  useEffect(() => {
    openRef.current = openSearch;
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openRef.current();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      inputRef.current?.focus();
    }
    if (!open && d.open) d.close();
  }, [open]);

  const prepared = useMemo(() => (index ? prepareIndex(index) : []), [index]);
  const { words, results, looksLikeReceipt } = matchSearch(prepared, query, 8);
  const items: { href: string; title: string; text: string; kind?: string }[] = looksLikeReceipt
    ? [{ href: "/#track", title: "Check a receipt number", text: "Search covers this site's pages, not cases." }]
    : words.length === 0
      ? BROWSE.map((b) => ({ href: b.href, title: b.label, text: b.note }))
      : results.map((r) => ({ href: r.href, title: r.title, text: r.text, kind: r.kind }));
  const activeIndex = Math.min(active, Math.max(items.length - 1, 0));

  const close = () => {
    setOpen(false);
    setQuery("");
    setActive(0);
  };
  const go = (href: string) => {
    close();
    router.push(href);
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (!items.length) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const next = (activeIndex + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
      setActive(next);
      document.getElementById(`${listId}-${next}`)?.scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(items[activeIndex].href);
    }
  };

  const status =
    words.length === 0
      ? "Popular pages"
      : looksLikeReceipt
        ? "That looks like a receipt number"
        : !index
          ? failed
            ? "Search didn't load. Check your connection and try again."
            : "Loading…"
          : results.length === 0
            ? "Nothing matches. Try one or two plain words."
            : `${results.length} ${results.length === 1 ? "result" : "results"}`;

  return (
    <>
      <button
        type="button"
        onClick={openSearch}
        aria-label="Search"
        aria-keyshortcuts="Meta+K Control+K"
        className={`hidden size-11 cursor-pointer items-center justify-center rounded-[10px] text-slate transition-colors duration-200 hover:bg-cloud hover:text-midnight sm:inline-flex xl:w-auto xl:min-w-44 xl:justify-start xl:gap-2 xl:border xl:border-border xl:bg-white xl:px-3 xl:hover:border-blue/40 xl:hover:bg-white ${focus}`}
      >
        <Search aria-hidden className="size-5 xl:size-4" />
        <span className="hidden text-small xl:inline">Search</span>
        {shortcut && (
          <kbd className="ml-auto hidden rounded-md border border-border bg-cloud px-1.5 font-sans text-caption text-slate xl:inline">
            {shortcut}
          </kbd>
        )}
      </button>

      <dialog
        ref={dialogRef}
        onClose={close}
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
        aria-label="Search TrackMyUSCIS"
        className="modal mx-auto mt-[12vh] w-[calc(100%-2rem)] max-w-xl overflow-hidden rounded-xl border border-border bg-white p-0 text-midnight shadow-[0_24px_64px_-24px_rgba(16,34,61,0.35)]"
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search aria-hidden className="size-5 shrink-0 text-slate" />
          <label htmlFor={inputId} className="sr-only">
            Search TrackMyUSCIS
          </label>
          <input
            ref={inputRef}
            id={inputId}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onInputKey}
            placeholder="Search statuses, forms, answers…"
            autoComplete="off"
            spellCheck={false}
            role="combobox"
            aria-expanded={items.length > 0}
            aria-controls={listId}
            aria-activedescendant={items.length ? `${listId}-${activeIndex}` : undefined}
            className="h-14 min-w-0 flex-1 bg-transparent text-body text-midnight placeholder:text-slate/70 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          <button
            type="button"
            onClick={close}
            aria-label="Close search"
            className={`-mr-2 inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate transition-colors duration-200 hover:bg-cloud hover:text-midnight ${focus}`}
          >
            <X aria-hidden className="size-5" />
          </button>
        </div>

        <p aria-live="polite" className="px-4 pt-3 pb-1 text-caption font-medium text-slate">
          {status}
        </p>
        <ul id={listId} role="listbox" aria-label="Results" className="max-h-[min(24rem,55vh)] overflow-y-auto px-2 pb-2">
          {items.map((item, i) => (
            <li key={`${item.href}:${item.title}`} id={`${listId}-${i}`} role="option" aria-selected={i === activeIndex}>
              <Link
                href={item.href}
                tabIndex={-1}
                onClick={close}
                onMouseMove={() => setActive(i)}
                className={`flex min-h-11 items-start gap-3 rounded-[10px] px-3 py-2.5 ${i === activeIndex ? "bg-ice" : ""}`}
              >
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-small font-semibold text-midnight">{item.title}</span>
                    {item.kind && (
                      <span className="shrink-0 rounded-full border border-border bg-white px-2 text-caption text-slate">{item.kind}</span>
                    )}
                  </span>
                  <span className="mt-0.5 line-clamp-1 text-small text-slate">{item.text}</span>
                </span>
                {i === activeIndex ? (
                  <CornerDownLeft aria-hidden className="mt-1 size-4 shrink-0 text-blue" />
                ) : (
                  <ArrowRight aria-hidden className="mt-1 size-4 shrink-0 text-slate/50" />
                )}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between border-t border-border bg-cloud px-4 py-2.5 text-caption text-slate">
          <span className="hidden sm:inline">
            <kbd className="font-sans">↑</kbd> <kbd className="font-sans">↓</kbd> to move, <kbd className="font-sans">Enter</kbd> to open,{" "}
            <kbd className="font-sans">Esc</kbd> to close
          </span>
          <Link href="/search" onClick={close} className={`rounded font-medium text-blue hover:underline ${focus}`}>
            Open full search
          </Link>
        </div>
      </dialog>
    </>
  );
}
