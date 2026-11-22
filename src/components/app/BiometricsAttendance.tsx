"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { FormMessage } from "@/components/auth/FormMessage";
import { Spinner } from "@/components/ui/Spinner";
import { appBtnPrimary, appBtnSecondary, appField, appFieldLabel, appPanel, focusRing } from "@/lib/ui";

const longDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
export const showIsoDate = (iso: string) => longDate.format(Date.parse(`${iso}T00:00:00Z`));

export const BIOMETRICS_NOTE = "This is your own record. It doesn't change your USCIS status or confirm USCIS has your biometrics.";

/** Today in the person's own time zone, as YYYY-MM-DD (for the date field's max). */
function localToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Saves (or clears, with null) the date; returns a message to show, or null when saved. */
async function saveBiometricsDate(caseId: string, value: string | null, scheduledOn: string | null): Promise<string | null> {
  if (value !== null) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value > localToday()) return "Choose the date you went, today or earlier.";
    if (scheduledOn && value < scheduledOn) return `Choose a date on or after ${showIsoDate(scheduledOn)}, when USCIS sent the notice.`;
  }
  const { error } = await createClient().from("cases").update({ biometrics_attended_date: value }).eq("id", caseId);
  return error ? "We couldn't save that. Please try again." : null;
}

/**
 * The date field and Confirm attendance. Used in the case page panel and in the dashboard's
 * popup. Saves straight to Supabase; row-level security limits it to the owner and the
 * database stamps when it was confirmed. `focus` moves focus here when it appears in a page;
 * in a dialog the field is marked data-autofocus instead.
 */
export function BiometricsDateForm({
  caseId,
  saved,
  scheduledOn,
  onSaved,
  onCancel,
  focus = false,
}: {
  caseId: string;
  saved: string | null;
  scheduledOn: string | null;
  onSaved: () => void;
  onCancel: () => void;
  focus?: boolean;
}) {
  const ids = { date: useId(), msg: useId() };
  const [date, setDate] = useState(saved ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        setBusy(true);
        const message = await saveBiometricsDate(caseId, date, scheduledOn);
        setBusy(false);
        if (message) return setError(message);
        onSaved();
      }}
      noValidate
    >
      <label htmlFor={ids.date} className={appFieldLabel}>
        Date you completed biometrics
      </label>
      <input
        id={ids.date}
        type="date"
        required
        autoFocus={focus}
        data-autofocus={focus ? undefined : true}
        min={scheduledOn ?? undefined}
        // Today's limit is set when the field is used, in the person's own time zone (never
        // while the page is drawn, which would use the server's clock).
        onFocus={(e) => (e.currentTarget.max = localToday())}
        onPointerDown={(e) => (e.currentTarget.max = localToday())}
        value={date}
        onChange={(e) => setDate(e.target.value)}
        disabled={busy}
        aria-invalid={!!error || undefined}
        aria-describedby={error ? ids.msg : undefined}
        className={`${appField} mt-1.5 cursor-pointer tabular-nums`}
      />
      {error && (
        <div className="mt-3">
          <FormMessage tone="error" id={ids.msg}>
            {error}
          </FormMessage>
        </div>
      )}
      {/* Buttons sit left in the page panel (as before) and right in a dialog. */}
      <div className={`mt-3 flex flex-col-reverse gap-2 sm:flex-row ${focus ? "" : "sm:justify-end"}`}>
        <button type="button" disabled={busy} onClick={onCancel} className={appBtnSecondary}>
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
  );
}

const linkButton = `min-h-8 cursor-pointer rounded px-1 text-small font-medium text-blue underline-offset-2 hover:underline disabled:opacity-60 ${focusRing}`;

/**
 * Case page panel: "Have you been to your biometrics appointment?" Shown while USCIS says
 * one is scheduled (or once the person has answered).
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
  const titleId = useId();
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!saved && !asking) return null;

  return (
    <section id="biometrics" aria-labelledby={titleId} className={`${appPanel} jump-target`}>
      <h2 id={titleId} className="text-caption font-medium text-slate">
        Biometrics appointment
      </h2>

      {editing ? (
        <div className="mt-2 max-w-sm">
          <BiometricsDateForm
            caseId={caseId}
            saved={saved}
            scheduledOn={scheduledOn}
            focus
            onCancel={() => setEditing(false)}
            onSaved={() => {
              setEditing(false);
              router.refresh();
            }}
          />
        </div>
      ) : saved ? (
        <>
          <p className="mt-1.5 flex items-center gap-2 text-small font-medium text-midnight">
            <CalendarCheck aria-hidden className="size-4 shrink-0 text-teal" />
            Completed {showIsoDate(saved)}
            <span className="font-normal text-slate">· confirmed by you</span>
          </p>
          <div className="-ml-1 mt-1 flex flex-wrap gap-x-3">
            <button type="button" disabled={busy} onClick={() => setEditing(true)} className={linkButton}>
              Change date
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={async () => {
                setError(null);
                setBusy(true);
                const message = await saveBiometricsDate(caseId, null, scheduledOn);
                setBusy(false);
                if (message) return setError(message);
                router.refresh();
              }}
              className={linkButton}
            >
              {busy ? "Saving…" : "Undo"}
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="mt-1.5 text-small font-semibold text-midnight">Have you been to your biometrics appointment?</p>
          <p className="mt-0.5 max-w-prose text-small text-slate">
            USCIS sent an appointment notice{scheduledOn ? ` on ${showIsoDate(scheduledOn)}` : ""}. Tell us the day you went to keep
            your case timeline complete.
          </p>
          <div className="mt-3 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
            <button type="button" onClick={() => setEditing(true)} className={appBtnPrimary}>
              Yes, I went
            </button>
            <span className="text-caption text-slate">Not yet? Leave this until you&apos;ve been.</span>
          </div>
        </>
      )}

      {error && (
        <div className="mt-3">
          <FormMessage tone="error">{error}</FormMessage>
        </div>
      )}
      <p className="mt-3 text-caption text-slate">{BIOMETRICS_NOTE}</p>
    </section>
  );
}
