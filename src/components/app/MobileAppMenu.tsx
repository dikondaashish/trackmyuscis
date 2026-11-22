"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import type { Account } from "@/lib/account";
import { focusRing } from "@/lib/ui";
import { AppNav } from "./AppNav";
import { AccountCard, Avatar } from "./AccountCard";

/** Phones and tablets: a menu button in the top bar that opens the same navigation as the sidebar. */
export function MobileAppMenu({ account }: { account: Account }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="app-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-[10px] pl-1 pr-2 text-slate hover:bg-cloud ${focusRing}`}
      >
        <Avatar initials={account.initials} size="sm" />
        {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
      </button>
      <div
        id="app-menu"
        hidden={!open}
        className="menu-in fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto border-t border-border bg-white px-4 pt-4 pb-6"
      >
        <div className="flex min-h-full flex-col justify-between gap-8">
          <AppNav onNavigate={() => setOpen(false)} />
          <div className="border-t border-border pt-4">
            <AccountCard account={account} />
          </div>
        </div>
      </div>
    </>
  );
}
