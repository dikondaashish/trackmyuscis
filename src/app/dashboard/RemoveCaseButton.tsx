"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { focusRing } from "@/lib/ui";

const quiet = `inline-flex min-h-11 cursor-pointer items-center rounded px-2 text-small font-semibold ${focusRing}`;

/** Two taps to remove: "Remove", then "Yes, remove" (or "Keep"). */
export function RemoveCaseButton({ id, receipt }: { id: string; receipt: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  async function remove() {
    setBusy(true);
    const { error } = await createClient().from("cases").delete().eq("id", id);
    setBusy(false);
    if (!error) router.refresh();
  }

  if (!confirming) {
    return (
      <button type="button" onClick={() => setConfirming(true)} aria-label={`Remove ${receipt}`} className={`${quiet} text-slate hover:text-red`}>
        Remove
      </button>
    );
  }
  return (
    <span className="flex items-center gap-1">
      <button type="button" onClick={remove} disabled={busy} className={`${quiet} text-red`}>
        {busy ? "Removing…" : "Yes, remove"}
      </button>
      <button type="button" onClick={() => setConfirming(false)} disabled={busy} className={`${quiet} text-slate hover:text-midnight`}>
        Keep
      </button>
    </span>
  );
}
