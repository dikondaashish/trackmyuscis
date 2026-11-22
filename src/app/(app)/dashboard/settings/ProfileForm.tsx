"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { FormMessage } from "@/components/auth/FormMessage";
import { appBtnPrimary, appField, appFieldLabel } from "@/lib/ui";
import { Spinner } from "@/components/ui/Spinner";

/** First and last name. Saved to the profile row; row-level security limits it to the owner. */
export function ProfileForm({ userId, firstName, lastName }: { userId: string; firstName: string; lastName: string }) {
  const router = useRouter();
  const ids = { first: useId(), last: useId() };
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "error" | "success"; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setBusy(true);
    setMessage(null);
    const { error } = await createClient()
      .from("profiles")
      .update({
        first_name: String(data.get("first") ?? "").trim() || null,
        last_name: String(data.get("last") ?? "").trim() || null,
      })
      .eq("user_id", userId);
    setBusy(false);
    if (error) return setMessage({ tone: "error", text: "We couldn't save your name. Please try again." });
    setMessage({ tone: "success", text: "Saved." });
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3.5">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={ids.first} className={appFieldLabel}>
            First name
          </label>
          <input id={ids.first} name="first" defaultValue={firstName} autoComplete="given-name" maxLength={80} disabled={busy} className={`${appField} mt-1.5`} />
        </div>
        <div>
          <label htmlFor={ids.last} className={appFieldLabel}>
            Last name
          </label>
          <input id={ids.last} name="last" defaultValue={lastName} autoComplete="family-name" maxLength={80} disabled={busy} className={`${appField} mt-1.5`} />
        </div>
      </div>
      {message && <FormMessage tone={message.tone}>{message.text}</FormMessage>}
      <div>
        <button type="submit" disabled={busy} className={appBtnPrimary}>
          {busy ? (
            <>
              <Spinner />
              Saving…
            </>
          ) : "Save name"}
        </button>
      </div>
    </form>
  );
}
