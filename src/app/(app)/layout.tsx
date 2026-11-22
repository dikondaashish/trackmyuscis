import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { getAccount } from "@/lib/account";
import { focusRing } from "@/lib/ui";
import { AppNav, AppNavView } from "@/components/app/AppNav";
import { AccountCard, AccountCardSkeleton } from "@/components/app/AccountCard";
import { MobileAppMenu } from "@/components/app/MobileAppMenu";

function Logo() {
  return (
    <Link href="/dashboard" aria-label="TrackMyUSCIS dashboard" className={`flex min-h-11 items-center rounded-md ${focusRing}`}>
      <Image src="/brand/logo-primary.svg" alt="TrackMyUSCIS" width={1180} height={196} className="h-7 w-auto" priority />
    </Link>
  );
}

async function SidebarAccount() {
  return <AccountCard account={await getAccount()} />;
}

async function MobileMenu() {
  return <MobileAppMenu account={await getAccount()} />;
}

/**
 * The signed-in app: no marketing header or footer. A fixed sidebar from 1024px (logo,
 * navigation, account), a top bar with a menu on smaller screens, and the page on cloud.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-1 bg-cloud">
      <a
        href="#main"
        className="skip-link rounded-[10px] bg-midnight px-4 py-3 text-small font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
      >
        Skip to main content
      </a>

      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-border bg-white px-4 py-5 lg:flex">
        <div className="px-2">
          <Logo />
        </div>
        <div className="mt-8 flex-1 overflow-y-auto">
          <Suspense fallback={<AppNavView pathname="" />}>
            <AppNav />
          </Suspense>
        </div>
        <div className="border-t border-border pt-4">
          <Suspense fallback={<AccountCardSkeleton />}>
            <SidebarAccount />
          </Suspense>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-white px-4 sm:px-6 lg:hidden">
          <Logo />
          <Suspense fallback={<span className="skeleton size-8 rounded-full" />}>
            <MobileMenu />
          </Suspense>
        </header>
        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}
