"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { FormMessage } from "@/components/auth/FormMessage";
import { Spinner } from "@/components/ui/Spinner";
import { appBtnPrimary, appBtnSecondary, appField, appFieldLabel } from "@/lib/ui";

const MIN = "1900-01-01";

/** Today as YYYY-MM-DD in the browser's time zone, the latest date allowed. Only call it in event handlers. */
function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Optional date of birth. Private to the owner; can be cleared at any time. */
export function DateOfBirthForm({ userId, dateOfBirth }: { userId: string; dateOfBirth: string | null }) {
  const router = useRouter();
  const ids = { input: useId(), hint: useId() };
  const [value, setValue] = useState(dateOfBirth ?? "");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "error" | "success"; text: string } | null>(null);
  const unchanged = value === (dateOfBirth ?? "");

  async function save(next: string | null) {
    if (next && (next < MIN || next > today())) {
      return setMessage({ tone: "error", text: "Enter a real date of birth, between 1900 and today." });
    }
    setBusy(true);
    setMessage(null);
    const { error } = await createClient().from("profiles").update({ date_of_birth: next }).eq("user_id", userId);
    setBusy(false);
    if (error) return setMessage({ tone: "error", text: "We couldn't save your date of birth. Please try again." });
    setValue(next ?? "");
    setMessage({ tone: "success", text: next ? "Saved." : "Removed." });
    router.refresh();
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void save(value || null);
      }}
      className="flex flex-col gap-3.5"
    >
      <div className="max-w-xs">
        <label htmlFor={ids.input} className={appFieldLabel}>
          Date of birth <span className="font-normal text-slate">(optional)</span>
        </label>
        <input
          id={ids.input}
          type="date"
          value={value}
          min={MIN}
          onChange={(e) => {
            setValue(e.target.value);
            setMessage(null);
          }}
          autoComplete="bday"
          disabled={busy}
          aria-describedby={ids.hint}
          className={`${appField} mt-1.5`}
        />
        <p id={ids.hint} className="mt-1.5 text-caption text-slate">
          Private. Only you can see it, and you can remove it any time.
        </p>
      </div>
      {message && <FormMessage tone={message.tone}>{message.text}</FormMessage>}
      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={busy || unchanged} className={appBtnPrimary}>
          {busy ? (
            <>
              <Spinner />
              Saving…
            </>
          ) : (
            "Save date of birth"
          )}
        </button>
        {dateOfBirth && (
          <button type="button" onClick={() => void save(null)} disabled={busy} className={appBtnSecondary}>
            Remove
          </button>
        )}
      </div>
    </form>
  );
}
