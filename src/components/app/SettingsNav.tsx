"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCard, Settings, UserRound } from "lucide-react";
import { appCard, focusRing } from "@/lib/ui";

const LINKS = [
  { href: "/dashboard/settings", label: "Profile", icon: UserRound },
  { href: "/dashboard/settings/subscription", label: "Subscription", icon: CreditCard },
  { href: "/dashboard/settings/account", label: "Account", icon: Settings },
];

/** The settings sections: a small card on the left from 1024px, a row of tabs above on phones. */
export function SettingsNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Settings" className={`${appCard} p-1 lg:sticky lg:top-6`}>
      <ul className="flex gap-0.5 overflow-x-auto lg:flex-col">
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <li key={href} className="shrink-0 lg:shrink">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex h-9 items-center gap-2 rounded-lg px-2.5 text-small whitespace-nowrap transition-colors duration-200 ${
                  active ? "bg-ice font-medium text-blue" : "text-slate hover:bg-cloud hover:text-midnight"
                } ${focusRing}`}
              >
                <Icon aria-hidden className="size-4" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
