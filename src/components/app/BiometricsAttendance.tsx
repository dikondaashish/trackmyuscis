"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { FormMessage } from "@/components/auth/FormMessage";
import { Spinner } from "@/components/ui/Spinner";
import { appBtnPrimary, appBtnSecondary, appField, appFieldLabel, appPanel, focusRing } from "@/lib/ui";

const longDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
const show = (iso: string) => longDate.format(Date.parse(`${iso}T00:00:00Z`));

/** Today in the person's own time zone, as YYYY-MM-DD (for the date field's max). */
function localToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const linkButton = `min-h-8 cursor-pointer rounded px-1 text-small font-medium text-blue underline-offset-2 hover:underline disabled:opacity-60 ${focusRing}`;

/**
 * "Did you go to your biometrics appointment?" Shown while USCIS says one is scheduled (or
 * once the person has answered). Saves the date straight to Supabase; row-level security
 * limits it to the owner and the database stamps when it was confirmed.
 */
export function BiometricsAttendance({
  caseId,
  saved,
  scheduledOn,
  asking,
}: {
  caseId: string;
  /** YYYY-MM-DD already confirmed, or null. */
  saved: string | null;
  /** YYYY-MM-DD of USCIS's "scheduled" notice, the earliest the person could have gone. */
  scheduledOn: string | null;
  /** USCIS says an appointment is scheduled and the case is still open. */
  asking: boolean;
}) {
  const router = useRouter();
  const ids = { title: useId(), date: useId(), msg: useId() };
  const [editing, setEditing] = useState(false);
  const [date, setDate] = useState(saved ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(value: string | null) {
    setError(null);
    if (value !== null) {
      const today = localToday();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value > today) return setError("Choose the date you went, today or earlier.");
      if (scheduledOn && value < scheduledOn) return setError(`Choose a date on or after ${show(scheduledOn)}, when USCIS sent the notice.`);
    }
    setBusy(true);
    const { error } = await createClient().from("cases").update({ biometrics_attended_date: value }).eq("id", caseId);
    setBusy(false);
    if (error) return setError("We couldn't save that. Please try again.");
    setEditing(false);
    setDate(value ?? "");
    router.refresh();
  }

  if (!saved && !asking) return null;

  return (
    <section id="biometrics" aria-labelledby={ids.title} className={`${appPanel} jump-target`}>
      <h2 id={ids.title} className="text-caption font-medium text-slate">
        Biometrics appointment
      </h2>

      {saved && !editing ? (
        <>
          <p className="mt-1.5 flex items-center gap-2 text-small font-medium text-midnight">
            <CalendarCheck aria-hidden className="size-4 shrink-0 text-teal" />
            Completed {show(saved)}
            <span className="font-normal text-slate">· confirmed by you</span>
          </p>
          <div className="-ml-1 mt-1 flex flex-wrap gap-x-3">
            <button type="button" disabled={busy} onClick={() => setEditing(true)} className={linkButton}>
              Change date
            </button>
            <button type="button" disabled={busy} onClick={() => void save(null)} className={linkButton}>
              {busy ? "Saving…" : "Undo"}
            </button>
          </div>
        </>
      ) : !editing ? (
        <>
          <p className="mt-1.5 text-small font-semibold text-midnight">Have you been to your biometrics appointment?</p>
          <p className="mt-0.5 max-w-prose text-small text-slate">
            USCIS sent an appointment notice{scheduledOn ? ` on ${show(scheduledOn)}` : ""}. Tell us the day you went to keep your
            case timeline complete.
          </p>
          <div className="mt-3 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
            <button type="button" onClick={() => setEditing(true)} className={appBtnPrimary}>
              Yes, I went
            </button>
            <span className="text-caption text-slate">Not yet? Leave this until you&apos;ve been.</span>
          </div>
        </>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void save(date);
          }}
          noValidate
          className="mt-2 max-w-sm"
        >
          <label htmlFor={ids.date} className={appFieldLabel}>
            Date you completed biometrics
          </label>
          <input
            id={ids.date}
            type="date"
            required
            autoFocus
            min={scheduledOn ?? undefined}
            max={localToday()}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={busy}
            aria-invalid={!!error || undefined}
            aria-describedby={error ? ids.msg : undefined}
            className={`${appField} mt-1.5 cursor-pointer tabular-nums`}
          />
          <div className="mt-3 flex flex-col-reverse gap-2 sm:flex-row">
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setEditing(false);
                setDate(saved ?? "");
                setError(null);
              }}
              className={appBtnSecondary}
            >
              Cancel
            </button>
            <button type="submit" disabled={busy || !date} className={appBtnPrimary}>
              {busy ? (
                <>
                  <Spinner />
                  Saving…
                </>
              ) : (
                "Confirm attendance"
              )}
            </button>
          </div>
        </form>
      )}

      {error && (
        <div className="mt-3">
          <FormMessage tone="error" id={ids.msg}>
            {error}
          </FormMessage>
        </div>
      )}
      <p className="mt-3 text-caption text-slate">
        This is your own record. It doesn&apos;t change your USCIS status or confirm USCIS has your biometrics.
      </p>
    </section>
  );
}
