import Image from "next/image";
import Link from "next/link";
import { HeaderShell } from "@/components/HeaderShell";
import { MobileMenu } from "@/components/MobileMenu";
import { PrimaryNav } from "@/components/PrimaryNav";
import { QuickSearch } from "@/components/QuickSearch";
import { AccountMenu, HeaderAction, SignInLink, SiteAccountProvider } from "@/components/SiteAccount";
import { HEADER_NAV } from "@/lib/nav";

const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue";

/**
 * 64px bar: logo left, menus centred on the page (a three-column grid from 1024px),
 * search, account and the one blue button right.
 */
export function SiteHeader() {
  return (
    <HeaderShell>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-5 sm:px-8 lg:grid lg:grid-cols-[1fr_auto_1fr]">
        <Link
          href="/"
          aria-label="TrackMyUSCIS home"
          className={`flex min-h-11 shrink-0 items-center justify-self-start rounded-md ${focusRing}`}
        >
          <Image
            src="/brand/logo-primary.svg"
            alt="TrackMyUSCIS"
            width={1180}
            height={196}
            preload
            className="h-7 w-auto min-[390px]:h-8"
          />
        </Link>

        <PrimaryNav entries={HEADER_NAV} />

        <SiteAccountProvider>
          <div className="flex items-center gap-1.5 justify-self-end sm:gap-2">
            <QuickSearch />
            <SignInLink
              className={`hidden min-h-11 items-center whitespace-nowrap rounded-lg px-3 text-small font-medium text-slate transition-colors duration-200 hover:text-midnight lg:inline-flex ${focusRing}`}
            />
            <HeaderAction
              className={`inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-[10px] bg-blue px-3 text-small font-semibold text-white transition-[background-color,scale] duration-200 hover:bg-midnight active:scale-[0.98] sm:px-4 ${focusRing}`}
            />
            <AccountMenu />
            <MobileMenu entries={HEADER_NAV} />
          </div>
        </SiteAccountProvider>
      </div>
    </HeaderShell>
  );
}
