"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { usernameProblem, USERNAME_MAX } from "@/lib/username";
import { FormMessage } from "@/components/auth/FormMessage";
import { appBtnPrimary, appField, appFieldLabel } from "@/lib/ui";
import { Spinner } from "@/components/ui/Spinner";

/** UTC so the server and browser render the same date. */
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

/** Change the username. The database checks the same rules, uniqueness and the 30-day limit. */
export function UsernameForm({
  userId,
  username,
  lockedUntil,
}: {
  userId: string;
  username: string;
  /** Set when the last change was under 30 days ago: the form is locked until then. */
  lockedUntil: string | null;
}) {
  const router = useRouter();
  const ids = { input: useId(), hint: useId() };
  const [value, setValue] = useState(username);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{
    tone: "error" | "success";
    text: string;
  } | null>(null);
  const unchanged = value.trim() === username;
  const locked = lockedUntil !== null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next = value.trim();
    const problem = usernameProblem(next);
    if (problem) return setMessage({ tone: "error", text: problem });
    setBusy(true);
    setMessage(null);
    const { error } = await createClient()
      .from("profiles")
      .update({ username: next })
      .eq("user_id", userId);
    setBusy(false);
    if (error) {
      const text =
        error.hint === "username_cooldown"
          ? "You can change your username once every 30 days."
          : error.code === "23505"
            ? "That username is taken. Please try another."
            : error.code === "23514"
              ? "That username isn't allowed. Please try another."
              : "We couldn't save your username. Please try again.";
      return setMessage({ tone: "error", text });
    }
    setValue(next);
    setMessage({
      tone: "success",
      text: "Saved. You can change it again in 30 days.",
    });
    router.refresh();
  }

  const error = message?.tone === "error";
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3.5">
      <div>
        <label htmlFor={ids.input} className={appFieldLabel}>
          Your username
        </label>
        <div className="relative mt-1.5">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-body text-slate sm:text-small"
          >
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
            disabled={busy || locked}
            aria-invalid={error || undefined}
            aria-describedby={ids.hint}
            className={`${appField} pl-8`}
          />
        </div>
        <p id={ids.hint} className="mt-1.5 text-caption text-slate">
          {locked
            ? `You can change it again on ${formatDate(lockedUntil)}. Usernames can change once every 30 days.`
            : "3 to 24 letters, numbers, - or _. You can change it once every 30 days."}
        </p>
      </div>
      {message && <FormMessage tone={message.tone}>{message.text}</FormMessage>}
      {!locked && (
        <div>
          <button
            type="submit"
            disabled={busy || unchanged}
            className={appBtnPrimary}
          >
            {busy ? (
              <>
                <Spinner />
                Saving…
              </>
            ) : (
              "Save username"
            )}
          </button>
        </div>
      )}
    </form>
  );
}
