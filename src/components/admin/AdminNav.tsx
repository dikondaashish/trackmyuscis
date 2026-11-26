"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { focusRing } from "@/lib/ui";

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/lawyers", label: "Lawyers" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/cases", label: "Case checks" },
  { href: "/admin/accounts", label: "Accounts" },
];

/** The links, marking the current section. Used as the Suspense fallback with no path. */
export function AdminNavView({ pathname }: { pathname: string }) {
  return (
    <nav aria-label="Admin" className="flex gap-1">
      {LINKS.map((l) => {
        const current = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={current ? "page" : undefined}
            className={`inline-flex h-9 items-center rounded-md px-3 text-small font-medium transition-colors duration-200 ${current ? "bg-ice text-blue" : "text-slate hover:bg-cloud hover:text-midnight"} ${focusRing}`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminNav() {
  return <AdminNavView pathname={usePathname()} />;
}
