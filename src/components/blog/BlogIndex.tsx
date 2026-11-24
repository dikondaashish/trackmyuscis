"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { field, focusRing } from "@/lib/ui";
import { BlogCard, type BlogCardData } from "./BlogCard";

/**
 * Every post after the featured one: topic chips and a search box, filtered in the browser.
 * Nothing typed here leaves the page.
 */
export function BlogIndex({ posts, topics }: { posts: (BlogCardData & { text: string })[]; topics: string[] }) {
  const [topic, setTopic] = useState("All");
  const [query, setQuery] = useState("");
  const present = topics.filter((t) => posts.some((p) => p.topic === t));

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => (topic === "All" || p.topic === topic) && (!q || p.text.includes(q)));
  }, [posts, topic, query]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label="Filter by topic" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0">
          {["All", ...present].map((t) => {
            const on = t === topic;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTopic(t)}
                aria-pressed={on}
                className={`min-h-11 shrink-0 cursor-pointer rounded-full border px-4 text-small font-semibold whitespace-nowrap transition-colors duration-200 ${focusRing} ${
                  on ? "border-midnight bg-midnight text-white" : "border-border bg-white text-midnight hover:border-blue"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
        <label className="relative block sm:w-72">
          <span className="sr-only">Search the blog</span>
          <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts"
            className={`${field} pl-10`}
          />
        </label>
      </div>

      <p aria-live="polite" className="sr-only">
        {shown.length} {shown.length === 1 ? "post" : "posts"}
      </p>
      {shown.length === 0 ? (
        <p className="mt-10 rounded-xl border border-border bg-white px-5 py-10 text-center text-body text-slate">
          No posts match. Try another word or topic.
        </p>
      ) : (
        <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <BlogCard key={p.slug} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}
