"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { focusRing } from "@/lib/ui";

/** Copies the post's address. Uses the phone's share sheet where there is one. */
export function CopyLink({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    if (typeof navigator.share === "function" && window.matchMedia("(pointer: coarse)").matches) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // Cancelled or blocked: fall back to copying.
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link", url);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void share()}
      className={`inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-white px-3.5 text-small font-semibold text-midnight transition-colors duration-200 hover:border-blue ${focusRing}`}
    >
      {copied ? <Check aria-hidden className="size-4 text-teal" /> : <Link2 aria-hidden className="size-4 text-blue" />}
      <span aria-live="polite">{copied ? "Link copied" : "Share"}</span>
    </button>
  );
}
