"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Clock, FileText, LayoutList, LifeBuoy, Settings } from "lucide-react";
import { focusRing } from "@/lib/ui";

const MAIN = [
  { href: "/dashboard", label: "Cases", icon: LayoutList, match: (p: string) => p === "/dashboard" || p.startsWith("/dashboard/cases") },
];

const BOTTOM = [
  { href: "/dashboard/settings", label: "Settings", icon: Settings, match: (p: string) => p.startsWith("/dashboard/settings") },
];

const GUIDES = [
  { href: "/status-explained", label: "Case statuses", icon: BookOpen },
  { href: "/processing-times", label: "Processing times", icon: Clock },
  { href: "/forms", label: "USCIS forms", icon: FileText },
];

type NavLink = (typeof MAIN)[number];

function NavList({ links, pathname, onNavigate }: { links: NavLink[]; pathname: string; onNavigate?: () => void }) {
  return (
    <ul className="flex flex-col gap-0.5">
      {links.map(({ href, label, icon: Icon, match }) => {
        const active = match(pathname);
        return (
          <li key={href}>
            <Link
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`${item} ${active ? "bg-ice text-midnight" : "text-slate hover:bg-cloud hover:text-midnight"}`}
            >
              <Icon aria-hidden className={`size-4 ${active ? "text-blue" : ""}`} />
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

const item = `flex min-h-11 items-center gap-3 rounded-[10px] px-3 text-small font-medium transition-colors duration-200 ${focusRing}`;

/** The app's navigation, with the current page highlighted. */
export function AppNav({ onNavigate }: { onNavigate?: () => void }) {
  return <AppNavView pathname={usePathname()} onNavigate={onNavigate} />;
}

/** The app's navigation: the account pages, then the site's reference pages. */
export function AppNavView({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav aria-label="Dashboard" className="flex flex-col gap-6">
      <NavList links={MAIN} pathname={pathname} onNavigate={onNavigate} />
      <div>
        <p className="px-3 text-caption font-semibold text-slate">Guides</p>
        <ul className="mt-1 flex flex-col gap-0.5">
          {GUIDES.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link href={href} onClick={onNavigate} className={`${item} text-slate hover:bg-cloud hover:text-midnight`}>
                <Icon aria-hidden className="size-4" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

/** Settings, kept at the bottom of the sidebar above the account. */
export function AppNavBottom({ onNavigate }: { onNavigate?: () => void }) {
  return <AppNavBottomView pathname={usePathname()} onNavigate={onNavigate} />;
}

export function AppNavBottomView({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav aria-label="Account">
      <NavList links={BOTTOM} pathname={pathname} onNavigate={onNavigate} />
    </nav>
  );
}

/** Help, in the top right of the app's top bar. */
export function HelpLink() {
  return (
    <Link
      href="/help"
      className={`flex min-h-11 items-center gap-2 rounded-[10px] px-3 text-small font-medium text-slate transition-colors duration-200 hover:bg-cloud hover:text-midnight ${focusRing}`}
    >
      <LifeBuoy aria-hidden className="size-4" />
      Help
    </Link>
  );
}
