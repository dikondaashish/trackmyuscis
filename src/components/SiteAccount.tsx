"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useId, useRef, useState } from "react";
import { CircleHelp, LayoutGrid, LogOut, Settings } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { Avatar } from "@/components/app/AccountCard";
import { accountDisplay } from "@/lib/account-display";
import { createClient } from "@/lib/supabase/client";

/**
 * Who is signed in, for the site header. Read in the browser from the session cookie
 * (then the profile for the name), so every page stays static.
 */
type SiteAccount = { name: string | null; email: string; initials: string; photoUrl: string | null };
type State = { status: "loading" } | { status: "out" } | { status: "in"; account: SiteAccount };

const AccountContext = createContext<State>({ status: "loading" });
export const useSiteAccount = () => useContext(AccountContext);

function fromUser(user: User, profile: { first_name: string | null; last_name: string | null } | null): SiteAccount {
  const meta = user.user_metadata ?? {};
  const email = user.email ?? "";
  return {
    email,
    ...accountDisplay({
      firstName: profile?.first_name || meta.first_name || meta.given_name || null,
      lastName: profile?.last_name || meta.last_name || meta.family_name || null,
      fullName: meta.full_name,
      email,
      photo: meta.avatar_url ?? meta.picture,
    }),
  };
}

export function SiteAccountProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    const supabase = createClient();
    let current = 0;
    const load = async (user: User | null) => {
      const run = ++current;
      if (!user) return setState({ status: "out" });
      setState({ status: "in", account: fromUser(user, null) });
      const { data } = await supabase.from("profiles").select("first_name, last_name").eq("user_id", user.id).maybeSingle();
      if (run === current) setState({ status: "in", account: fromUser(user, data) });
    };
    // Fires once at start (INITIAL_SESSION) and on every sign-in or sign-out. Supabase asks
    // that no other Supabase call runs inside this callback, hence the timeout.
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => void load(session?.user ?? null), 0);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  return <AccountContext.Provider value={state}>{children}</AccountContext.Provider>;
}

/** The "Sign in" button for visitors (desktop). Hidden until the check finishes so it never flips in view. */
export function SignInLink({ className }: { className: string }) {
  const state = useSiteAccount();
  const pathname = usePathname();
  if (state.status === "in") return null;
  return (
    <Link
      href="/sign-in"
      aria-current={pathname === "/sign-in" ? "page" : undefined}
      className={`${className} ${state.status === "loading" ? "invisible" : ""}`}
    >
      Sign in
    </Link>
  );
}

/**
 * The header's blue button: "Dashboard" once signed in, otherwise "Sign up". Hidden until
 * the check finishes so a signed-in visitor never sees it flip.
 */
export function HeaderAction({ className }: { className: string }) {
  const state = useSiteAccount();
  const pathname = usePathname();
  if (state.status === "in")
    return (
      <Link href="/dashboard" className={className}>
        <LayoutGrid aria-hidden className="hidden size-4 sm:block" />
        Dashboard
      </Link>
    );
  return (
    <Link
      href="/sign-up"
      aria-current={pathname === "/sign-up" ? "page" : undefined}
      className={`${className} ${state.status === "loading" ? "invisible" : ""}`}
    >
      Sign up
    </Link>
  );
}

const LINKS = [
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/help", label: "Help & Support", icon: CircleHelp },
];

const focus = "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue";
const item = `flex min-h-11 w-full cursor-pointer items-center gap-3 px-4 text-small text-midnight transition-colors duration-200 hover:bg-cloud ${focus}`;
const signOut = `${item} text-red hover:bg-red/5`;

function Identity({ account }: { account: SiteAccount }) {
  return (
    <div className="min-w-0">
      <p className="truncate text-small font-semibold text-midnight">{account.name ?? "Your account"}</p>
      <p className="truncate text-small text-slate">{account.email}</p>
    </div>
  );
}

function SignOutForm({ className }: { className: string }) {
  return (
    <form action="/auth/sign-out" method="post">
      <button type="submit" className={className}>
        <LogOut aria-hidden className="size-4" />
        Sign out
      </button>
    </form>
  );
}

/** Desktop: the avatar button and its menu (name, email, Settings, Help, Sign out). */
export function AccountMenu() {
  const state = useSiteAccount();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  // Close on page change.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (state.status !== "in") return null;
  const { account } = state;

  return (
    <div ref={rootRef} className="relative hidden lg:block">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`Account menu for ${account.name ?? account.email}`}
        className="flex size-11 cursor-pointer items-center justify-center rounded-full transition-[scale] duration-200 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
      >
        <Avatar size="nav" initials={account.initials} photoUrl={account.photoUrl} />
      </button>

      <div
        id={menuId}
        hidden={!open}
        className="menu-in absolute top-full right-0 z-50 mt-2 w-72 overflow-hidden rounded-xl border border-border bg-white py-1.5 shadow-[0_24px_48px_-24px_rgba(16,34,61,0.25)]"
      >
        <div className="border-b border-border px-4 pt-2.5 pb-3">
          <Identity account={account} />
        </div>
        <ul className="py-1.5">
          {LINKS.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link href={href} onClick={() => setOpen(false)} className={item}>
                <Icon aria-hidden className="size-4 text-slate" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="border-t border-border pt-1.5">
          <SignOutForm className={signOut} />
        </div>
      </div>
    </div>
  );
}

/** Bottom of the phone menu: Sign in and Sign up for visitors, the account links once signed in. */
export function MobileAccount({ onNavigate }: { onNavigate: () => void }) {
  const state = useSiteAccount();
  if (state.status !== "in")
    return (
      <div className={`mt-2 grid grid-cols-2 gap-3 border-t border-border px-3 pt-3 pb-1 ${state.status === "loading" ? "invisible" : ""}`}>
        <Link
          href="/sign-in"
          onClick={onNavigate}
          className="flex h-12 items-center justify-center rounded-lg border border-border bg-white text-body font-semibold text-midnight transition-colors duration-200 hover:border-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
        >
          Sign in
        </Link>
        <Link
          href="/sign-up"
          onClick={onNavigate}
          className="flex h-12 items-center justify-center rounded-lg bg-blue text-body font-semibold text-white transition-colors duration-200 hover:bg-midnight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
        >
          Sign up
        </Link>
      </div>
    );

  const { account } = state;
  const row = "flex min-h-11 items-center gap-3 rounded-lg px-3 text-body transition-colors duration-200 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue";
  return (
    <div className="mt-2 border-t border-border pt-3 pb-1">
      <div className="flex items-center gap-3 px-3 pb-2">
        <Avatar size="nav" initials={account.initials} photoUrl={account.photoUrl} />
        <Identity account={account} />
      </div>
      <ul>
        {LINKS.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link href={href} onClick={onNavigate} className={`${row} text-midnight hover:bg-ice`}>
              <Icon aria-hidden className="size-5 text-slate" />
              {label}
            </Link>
          </li>
        ))}
        <li>
          <SignOutForm className={`${row} w-full cursor-pointer text-red hover:bg-red/5`} />
        </li>
      </ul>
    </div>
  );
}
