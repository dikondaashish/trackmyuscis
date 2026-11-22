"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { FormMessage } from "@/components/auth/FormMessage";
import { Spinner } from "@/components/ui/Spinner";
import { Avatar } from "@/components/app/AccountCard";
import { appBtnPrimary, appBtnSecondary, appField, appFieldLabel, appSectionTitle } from "@/lib/ui";

type Personal = {
  firstName: string;
  lastName: string;
  /** YYYY-MM-DD, or null when not added. */
  dateOfBirth: string | null;
  email: string;
  initials: string;
  photoUrl: string | null;
  premium: boolean;
};

const MIN_BIRTH = "1900-01-01";
const factLabel = "text-caption font-medium text-slate";

/** UTC so the server and browser render the same date. */
const longDate = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
const showDate = (iso: string) => longDate.format(Date.parse(`${iso}T00:00:00Z`));

/** Today as YYYY-MM-DD in the browser's time zone. Only call it in event handlers. */
function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * The personal profile: real name and date of birth, private to the owner. Laid out like the
 * community profile: view first, with an Edit button; editing happens in place.
 */
export function PersonalProfile({ userId, personal }: { userId: string; personal: Personal }) {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const fullName = [personal.firstName, personal.lastName].filter(Boolean).join(" ");
  const notSet = <span className="text-slate">Not added</span>;

  return (
    <section aria-labelledby="personal-title" className="rounded-xl border border-border bg-white p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 id="personal-title" className={appSectionTitle}>
            Personal profile
          </h2>
          <p className="mt-0.5 flex items-center gap-1.5 text-small text-slate">
            <Lock aria-hidden className="size-3.5 shrink-0" />
            Private. Only you see this; it&apos;s never shown in the community.
          </p>
        </div>
        {!editing && (
          <button
            type="button"
            onClick={() => {
              setSaved(false);
              setEditing(true);
            }}
            className={appBtnPrimary}
          >
            <Pencil aria-hidden className="size-3.5" />
            Edit profile
          </button>
        )}
      </div>

      {editing ? (
        <PersonalForm
          userId={userId}
          personal={personal}
          onDone={(didSave) => {
            setEditing(false);
            setSaved(didSave);
          }}
        />
      ) : (
        <div className="swap mt-4 rounded-lg bg-cloud p-4 sm:p-5">
          {saved && (
            <div className="mb-4">
              <FormMessage tone="success">Profile saved.</FormMessage>
            </div>
          )}
          <div className="flex flex-col items-center text-center">
            <Avatar initials={personal.initials} photoUrl={personal.photoUrl} premium={personal.premium} size="xl" />
            <p className="mt-3 text-body font-semibold text-midnight">{fullName || "Your name"}</p>
            <p className="max-w-full truncate text-small text-slate">{personal.email}</p>
          </div>
          <dl className="mt-5 grid gap-4 text-small sm:grid-cols-2">
            <div>
              <dt className={factLabel}>First name</dt>
              <dd className="mt-0.5 text-midnight">{personal.firstName || notSet}</dd>
            </div>
            <div>
              <dt className={factLabel}>Last name</dt>
              <dd className="mt-0.5 text-midnight">{personal.lastName || notSet}</dd>
            </div>
            <div>
              <dt className={factLabel}>Date of birth</dt>
              <dd className="mt-0.5 text-midnight">{personal.dateOfBirth ? showDate(personal.dateOfBirth) : notSet}</dd>
            </div>
            <div>
              <dt className={factLabel}>Email</dt>
              <dd className="mt-0.5 break-all text-midnight">{personal.email}</dd>
            </div>
          </dl>
          <p className="mt-5 border-t border-border pt-3 text-caption text-slate">
            We use your name to greet you in the dashboard.{" "}
            {personal.photoUrl ? "Your photo comes from your Google account." : "Your initials stand in for a photo."}
          </p>
        </div>
      )}
    </section>
  );
}

function PersonalForm({
  userId,
  personal,
  onDone,
}: {
  userId: string;
  personal: Personal;
  onDone: (saved: boolean) => void;
}) {
  const router = useRouter();
  const ids = { first: useId(), last: useId(), birth: useId(), birthHint: useId() };
  const [first, setFirst] = useState(personal.firstName);
  const [last, setLast] = useState(personal.lastName);
  const [birth, setBirth] = useState(personal.dateOfBirth ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (birth && (birth < MIN_BIRTH || birth > today())) {
      return setError("Enter a real date of birth, between 1900 and today.");
    }
    setBusy(true);
    const { error: saveError } = await createClient()
      .from("profiles")
      .update({
        first_name: first.trim() || null,
        last_name: last.trim() || null,
        date_of_birth: birth || null,
      })
      .eq("user_id", userId);
    setBusy(false);
    if (saveError) return setError("We couldn't save your profile. Please try again.");
    router.refresh();
    onDone(true);
  }

  return (
    <form onSubmit={onSubmit} noValidate className="swap mt-4 flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={ids.first} className={appFieldLabel}>
            First name
          </label>
          <input
            id={ids.first}
            value={first}
            onChange={(e) => setFirst(e.target.value)}
            autoComplete="given-name"
            maxLength={80}
            disabled={busy}
            autoFocus
            className={`${appField} mt-1.5`}
          />
        </div>
        <div>
          <label htmlFor={ids.last} className={appFieldLabel}>
            Last name
          </label>
          <input
            id={ids.last}
            value={last}
            onChange={(e) => setLast(e.target.value)}
            autoComplete="family-name"
            maxLength={80}
            disabled={busy}
            className={`${appField} mt-1.5`}
          />
        </div>
      </div>

      <div className="sm:max-w-[calc(50%-0.5rem)]">
        <label htmlFor={ids.birth} className={appFieldLabel}>
          Date of birth <span className="font-normal text-slate">(optional)</span>
        </label>
        <input
          id={ids.birth}
          type="date"
          value={birth}
          min={MIN_BIRTH}
          onFocus={(e) => (e.currentTarget.max = today())}
          onChange={(e) => setBirth(e.target.value)}
          autoComplete="bday"
          disabled={busy}
          aria-describedby={ids.birthHint}
          className={`${appField} mt-1.5`}
        />
        <p id={ids.birthHint} className="mt-1.5 text-caption text-slate">
          Google doesn&apos;t share it with us. Clear the field to remove it.
        </p>
      </div>

      {error && <FormMessage tone="error">{error}</FormMessage>}

      <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
        <button type="button" onClick={() => onDone(false)} disabled={busy} className={appBtnSecondary}>
          Cancel
        </button>
        <button type="submit" disabled={busy} className={appBtnPrimary}>
          {busy ? (
            <>
              <Spinner />
              Saving…
            </>
          ) : (
            "Save profile"
          )}
        </button>
      </div>
    </form>
  );
}
