"use client";

import { useId, useSyncExternalStore } from "react";
import { Check } from "lucide-react";
import { card, focusRing, rowPad } from "@/lib/ui";

/** Ticks live in this browser only (localStorage); nothing is sent anywhere. */
const listeners = new Set<() => void>();
const subscribe = (fn: () => void) => {
  listeners.add(fn);
  window.addEventListener("storage", fn);
  return () => {
    listeners.delete(fn);
    window.removeEventListener("storage", fn);
  };
};
const read = (key: string) => {
  try {
    return localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
};
const write = (key: string, value: string) => {
  try {
    if (value) localStorage.setItem(key, value);
    else localStorage.removeItem(key);
  } catch {
    // Storage can be blocked; the ticks then last until the page is closed.
  }
  listeners.forEach((fn) => fn());
};

/**
 * What to send with a form, as a list the visitor can tick off while they gather papers.
 * Every item is in the HTML; the ticks are a convenience kept on this device.
 */
export function DocumentChecklist({ slug, items }: { slug: string; items: string[] }) {
  const key = `tmu:docs:${slug}`;
  const id = useId();
  const saved = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => "",
  );
  const done = new Set(saved.split(",").filter(Boolean).map(Number));
  const count = items.filter((_, i) => done.has(i)).length;

  function toggle(i: number) {
    const next = new Set(done);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    write(key, [...next].sort((a, b) => a - b).join(","));
  }

  return (
    <div className={`${card} reveal overflow-hidden`}>
      <div className={`flex items-center justify-between gap-4 border-b border-border bg-cloud ${rowPad} py-3`}>
        <p className="text-small font-semibold text-midnight tabular-nums" aria-live="polite">
          {count} of {items.length} ready
        </p>
        <div className="flex items-center gap-4">
          <div aria-hidden className="h-1.5 w-24 overflow-hidden rounded-full bg-border sm:w-40">
            <div
              className="h-full rounded-full bg-teal transition-[width] duration-300 motion-reduce:transition-none"
              style={{ width: `${(count / items.length) * 100}%` }}
            />
          </div>
          {count > 0 && (
            <button
              type="button"
              onClick={() => write(key, "")}
              className={`no-print inline-flex min-h-11 cursor-pointer items-center rounded text-small font-medium text-slate transition-colors duration-200 hover:text-midnight ${focusRing}`}
            >
              Clear
            </button>
          )}
        </div>
      </div>
      <ul className="divide-y divide-border">
        {items.map((item, i) => {
          const checked = done.has(i);
          return (
            <li key={item}>
              <label
                htmlFor={`${id}-${i}`}
                className={`flex cursor-pointer items-start gap-4 ${rowPad} py-4 transition-colors duration-200 hover:bg-cloud has-focus-visible:outline-2 has-focus-visible:-outline-offset-2 has-focus-visible:outline-blue`}
              >
                <input id={`${id}-${i}`} type="checkbox" checked={checked} onChange={() => toggle(i)} className="peer sr-only" />
                <span
                  aria-hidden
                  className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors duration-200 ${
                    checked ? "border-teal bg-teal text-white" : "border-slate/40 bg-white"
                  }`}
                >
                  {checked && <Check className="pop size-3.5" strokeWidth={3} />}
                </span>
                <span className={`text-body transition-colors duration-200 ${checked ? "text-slate" : "text-midnight"}`}>{item}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
