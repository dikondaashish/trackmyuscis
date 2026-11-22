"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { usernameProblem, USERNAME_MAX } from "@/lib/username";
import { FormMessage } from "@/components/auth/FormMessage";
import { btnPrimary, field, fieldLabel } from "@/lib/ui";
import { Spinner } from "@/components/ui/Spinner";

/** Change the username. The database checks the same rules and that nobody else has it. */
export function UsernameForm({ userId, username }: { userId: string; username: string }) {
  const router = useRouter();
  const ids = { input: useId(), hint: useId() };
  const [value, setValue] = useState(username);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "error" | "success"; text: string } | null>(null);
  const unchanged = value.trim() === username;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next = value.trim();
    const problem = usernameProblem(next);
    if (problem) return setMessage({ tone: "error", text: problem });
    setBusy(true);
    setMessage(null);
    const { error } = await createClient().from("profiles").update({ username: next }).eq("user_id", userId);
    setBusy(false);
    if (error) {
      const text =
        error.code === "23505"
          ? "That username is taken. Please try another."
          : error.code === "23514"
            ? "That username isn't allowed. Please try another."
            : "We couldn't save your username. Please try again.";
      return setMessage({ tone: "error", text });
    }
    setValue(next);
    setMessage({ tone: "success", text: "Saved." });
    router.refresh();
  }

  const error = message?.tone === "error";
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor={ids.input} className={fieldLabel}>
          Your username
        </label>
        <div className="relative mt-2">
          <span aria-hidden className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-body text-slate">
            u/
          </span>
          <input
            id={ids.input}
            value={value}
            onChange={(e) => {
              setValue(e.target.value.replace(/\s/g, ""));
              setMessage(null);
            }}
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            maxLength={USERNAME_MAX}
            required
            disabled={busy}
            aria-invalid={error || undefined}
            aria-describedby={ids.hint}
            className={`${field} pl-9 disabled:opacity-60`}
          />
        </div>
        <p id={ids.hint} className="mt-2 text-small text-slate">
          3 to 24 letters, numbers, - or _. Your first one was picked at random so it doesn&apos;t reveal your name.
        </p>
      </div>
      {message && <FormMessage tone={message.tone}>{message.text}</FormMessage>}
      <div>
        <button type="submit" disabled={busy || unchanged} className={`${btnPrimary} disabled:opacity-60`}>
          {busy ? (
            <>
              <Spinner />
              Saving…
            </>
          ) : "Save username"}
        </button>
      </div>
    </form>
  );
}
