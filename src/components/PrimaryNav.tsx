"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isCurrent, PRIMARY_NAV } from "@/lib/site";

/** Desktop header links. The current section is marked for screen readers and shown in midnight. */
export function PrimaryNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary" className="hidden items-center lg:flex">
      <ul className="flex items-center gap-1">
        {PRIMARY_NAV.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
              className="inline-flex min-h-11 items-center whitespace-nowrap rounded-lg px-2.5 text-small text-slate transition-colors duration-200 hover:bg-ice hover:text-midnight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue aria-[current=page]:font-semibold aria-[current=page]:text-midnight xl:px-3"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
