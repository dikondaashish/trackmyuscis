"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { CircleCheck, Star } from "lucide-react";
import { FormMessage } from "@/components/auth/FormMessage";
import { Spinner } from "@/components/ui/Spinner";
import { REVIEW_MAX, validateReview, type ReviewErrors, type ReviewInput } from "@/lib/reviews";
import { createClient } from "@/lib/supabase/client";
import { btnPrimary, btnSecondary, field, fieldLabel, focusRing } from "@/lib/ui";
import { submitLawyerReview } from "./actions";

const EMPTY: ReviewInput = { rating: 0, relationship: "", body: "", honest: false };

/**
 * "Write a review": a sign-in link for visitors, a short form for signed-in people. The page
 * itself is prerendered, so the account is checked here in the browser; the server checks again.
 */
export function ReviewForm({ slug, lawyerName }: { slug: string; lawyerName: string }) {
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const [account, setAccount] = useState<"loading" | "out" | "in">("loading");
  const [open, setOpen] = useState(false);
  const [r, setR] = useState<ReviewInput>(EMPTY);
  const [errors, setErrors] = useState<ReviewErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => setAccount(data.user ? "in" : "out"))
      .catch(() => setAccount("out"));
  }, []);

  const set = <K extends keyof ReviewInput>(key: K, value: ReviewInput[K]) => {
    setR((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const found = validateReview(r);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return setMessage("Please fix the fields marked below.");
    }
    setBusy(true);
    try {
      const result = await submitLawyerReview(slug, r);
      if (result.ok) return setDone(true);
      if (result.signIn) setAccount("out");
      setErrors(result.errors ?? {});
      setMessage(result.message);
    } catch {
      setMessage("We couldn't send your review. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  const next = encodeURIComponent(`/lawyers/${slug}#reviews`);

  if (done) {
    return (
      <p role="status" className="swap flex items-start gap-2 rounded-xl bg-teal/10 p-5 text-body text-midnight">
        <CircleCheck aria-hidden className="pop mt-0.5 size-5 shrink-0 text-teal" />
        Thank you. We check every review before it appears, and yours will show here once it has been checked.
      </p>
    );
  }
  if (account === "loading") return <div className="h-11" aria-hidden />;
  if (account === "out") {
    return (
      <p className="text-body text-slate">
        Worked with {lawyerName}?{" "}
        <Link href={`/sign-in?next=${next}`} className={`rounded font-semibold text-blue underline-offset-2 hover:underline ${focusRing}`}>
          Sign in to write a review
        </Link>
        . It&apos;s free.
      </p>
    );
  }
  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className={btnSecondary}>
        Write a review
      </button>
    );
  }

  const err = (key: keyof ReviewInput) =>
    errors[key] ? (
      <p id={id(`${key}-error`)} className="mt-2 text-small text-red">
        {errors[key]}
      </p>
    ) : null;

  return (
    <form onSubmit={onSubmit} noValidate className="swap flex flex-col gap-6 rounded-xl border border-border bg-white p-5 sm:p-6">
      <h3 className="text-title text-midnight">Your review of {lawyerName}</h3>
      {message && <FormMessage tone="error">{message}</FormMessage>}

      <fieldset disabled={busy} aria-describedby={errors.rating ? id("rating-error") : undefined}>
        <legend className={fieldLabel}>Your rating</legend>
        <div className="mt-2 flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="cursor-pointer rounded has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-blue">
              <input type="radio" name="rating" value={n} checked={r.rating === n} onChange={() => set("rating", n)} className="sr-only" />
              <span className="sr-only">
                {n} {n === 1 ? "star" : "stars"}
              </span>
              <Star aria-hidden className={`size-11 p-2 ${n <= r.rating ? "fill-blue text-blue" : "text-slate/50 hover:text-blue"}`} strokeWidth={1.5} />
            </label>
          ))}
        </div>
        {err("rating")}
      </fieldset>

      <fieldset disabled={busy} aria-describedby={errors.relationship ? id("relationship-error") : undefined}>
        <legend className={fieldLabel}>How you worked with them</legend>
        <div className="mt-1 grid gap-x-6 sm:grid-cols-2">
          {(
            [
              ["client", "I hired them"],
              ["consultation", "I had a consultation"],
            ] as const
          ).map(([value, label]) => (
            <label key={value} className="flex min-h-11 cursor-pointer items-center gap-3 text-body text-midnight">
              <input
                type="radio"
                name="relationship"
                value={value}
                checked={r.relationship === value}
                onChange={() => set("relationship", value)}
                className="size-5 shrink-0 cursor-pointer accent-blue"
              />
              {label}
            </label>
          ))}
        </div>
        {err("relationship")}
      </fieldset>

      <div>
        <div className="flex items-baseline justify-between gap-4">
          <label htmlFor={id("body")} className={fieldLabel}>
            Your experience
          </label>
          <span className={`text-small tabular-nums ${r.body.trim().length > REVIEW_MAX ? "text-red" : "text-slate"}`}>
            {r.body.trim().length} / {REVIEW_MAX}
          </span>
        </div>
        <textarea
          id={id("body")}
          rows={4}
          value={r.body}
          onChange={(e) => set("body", e.target.value)}
          disabled={busy}
          placeholder="What went well, what didn't. Please leave out receipt numbers and other personal details."
          aria-invalid={errors.body ? true : undefined}
          aria-describedby={errors.body ? id("body-error") : undefined}
          className={`mt-2 ${field.replace("h-11 ", "min-h-24 ")} py-3 disabled:opacity-60`}
        />
        {err("body")}
      </div>

      <div>
        <label className="flex min-h-11 cursor-pointer items-start gap-3 text-small text-slate">
          <input
            type="checkbox"
            checked={r.honest}
            onChange={(e) => set("honest", e.target.checked)}
            disabled={busy}
            aria-invalid={errors.honest ? true : undefined}
            aria-describedby={errors.honest ? id("honest-error") : undefined}
            className="mt-0.5 size-5 shrink-0 cursor-pointer accent-blue"
          />
          <span>
            This is my own experience. I don&apos;t work for this lawyer and wasn&apos;t paid or offered anything for this review. I
            agree to the <Link href="/advertising#reviews" className={`rounded font-semibold text-blue underline-offset-2 hover:underline ${focusRing}`}>review rules</Link>.
          </span>
        </label>
        {err("honest")}
      </div>

      <div>
        <button type="submit" disabled={busy} className={`${btnPrimary} disabled:opacity-60`}>
          {busy ? (
            <>
              <Spinner />
              Sending…
            </>
          ) : (
            "Send review"
          )}
        </button>
        <p className="mt-3 text-small text-slate">
          Shown with your first name and last initial. We check every review before it appears.
        </p>
      </div>
    </form>
  );
}
