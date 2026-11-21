"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * "Sign in" for visitors, "Dashboard" once signed in. Checked in the browser from the
 * session cookie, so every page stays static.
 */
export function AccountLink({ className, onNavigate }: { className: string; onNavigate?: () => void }) {
  const pathname = usePathname();
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setSignedIn(!!session));
    return () => data.subscription.unsubscribe();
  }, []);

  const href = signedIn ? "/dashboard" : "/sign-in";
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={pathname === href ? "page" : undefined}
      // Hidden until the check finishes, so it never flips from "Sign in" to "Dashboard" in view.
      className={`${className} ${signedIn === null ? "invisible" : ""}`}
    >
      {signedIn ? "Dashboard" : "Sign in"}
    </Link>
  );
}
