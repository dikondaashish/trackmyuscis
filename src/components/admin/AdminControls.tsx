"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/Spinner";
import type { AdminResult } from "@/app/(admin)/admin/actions";
import { CONSULTATION_MODES, PRACTICE_AREAS, US_STATES, type ApplicationErrors, type LawyerApplication } from "@/lib/directory";
import { squarePhoto } from "@/lib/square-photo";
import { appBtnDanger, appBtnPrimary, appBtnSecondary, appField, appFieldLabel } from "@/lib/ui";

type Tone = "primary" | "secondary" | "danger";
const TONE: Record<Tone, string> = { primary: appBtnPrimary, secondary: appBtnSecondary, danger: appBtnDanger };

function Feedback({ result }: { result: AdminResult | null }) {
  if (!result || (result.ok && !result.message)) return null;
  return (
    <p role={result.ok ? "status" : "alert"} className={`text-small ${result.ok ? "text-teal" : "text-red"}`}>
      {result.message}
    </p>
  );
}

/**
 * One admin action. `confirm` asks before running; `reason` also asks for a short reason,
 * passed to the action. The page refreshes afterwards so it shows the new state.
 */
export function AdminButton({
  action,
  label,
  tone = "secondary",
  confirm,
  reason,
  goTo,
}: {
  action: (reason?: string) => Promise<AdminResult>;
  label: string;
  tone?: Tone;
  confirm?: string;
  reason?: string;
  /** Where to go afterwards instead of refreshing (for example after deleting). */
  goTo?: string;
}) {
  const router = useRouter();
  const uid = useId();
  const [asking, setAsking] = useState(false);
  const [why, setWhy] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<AdminResult | null>(null);

  async function run() {
    setBusy(true);
    setResult(null);
    try {
      const r = await action(reason ? why : undefined);
      setResult(r);
      if (r.ok) {
        setAsking(false);
        setWhy("");
        if (goTo) router.push(goTo);
        else router.refresh();
      }
    } catch {
      setResult({ ok: false, message: "Something went wrong. Reload and try again." });
    } finally {
      setBusy(false);
    }
  }

  if (asking) {
    return (
      <div className="flex w-full flex-col gap-2 rounded-lg border border-border bg-cloud p-3">
        {confirm && <p className="text-small text-midnight">{confirm}</p>}
        {reason && (
          <>
            <label htmlFor={`${uid}-why`} className={appFieldLabel}>
              {reason}
            </label>
            <textarea id={`${uid}-why`} rows={2} value={why} onChange={(e) => setWhy(e.target.value)} className={`${appField} h-auto py-2`} />
          </>
        )}
        <div className="flex gap-2">
          <button type="button" onClick={run} disabled={busy} className={`${TONE[tone]} disabled:opacity-60`}>
            {busy && <Spinner className="size-3.5" />}
            {label}
          </button>
          <button type="button" onClick={() => setAsking(false)} disabled={busy} className={appBtnSecondary}>
            Cancel
          </button>
        </div>
        <Feedback result={result} />
      </div>
    );
  }
  return (
    <span className="inline-flex flex-col gap-1">
      <button type="button" onClick={() => (confirm || reason ? setAsking(true) : run())} disabled={busy} className={`${TONE[tone]} disabled:opacity-60`}>
        {busy && <Spinner className="size-3.5" />}
        {label}
      </button>
      <Feedback result={result} />
    </span>
  );
}

/** Private notes about an application (never shown publicly). */
export function NotesForm({ action, initial }: { action: (notes: string) => Promise<AdminResult>; initial: string }) {
  const uid = useId();
  const [notes, setNotes] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<AdminResult | null>(null);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setResult(null);
        const r = await action(notes).catch(() => ({ ok: false as const, message: "Something went wrong." }));
        setResult(r.ok ? { ok: true, message: "Saved." } : r);
        setBusy(false);
      }}
      className="flex flex-col gap-2"
    >
      <label htmlFor={`${uid}-notes`} className={appFieldLabel}>
        Private notes
      </label>
      <textarea id={`${uid}-notes`} rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className={`${appField} h-auto py-2`} />
      <div className="flex items-center gap-3">
        <button type="submit" disabled={busy} className={`${appBtnSecondary} disabled:opacity-60`}>
          {busy && <Spinner className="size-3.5" />}
          Save notes
        </button>
        <Feedback result={result} />
      </div>
    </form>
  );
}

/** Replace or remove a lawyer's photo. The new one is cropped in the browser like on the application form. */
export function PhotoForm({ action, photoUrl, name }: { action: (form: FormData) => Promise<AdminResult>; photoUrl: string | null; name: string }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<AdminResult | null>(null);

  async function send(file: File | null) {
    setBusy(true);
    setResult(null);
    try {
      const form = new FormData();
      if (file) form.set("photo", new File([await squarePhoto(file)], "photo.jpg", { type: "image/jpeg" }));
      const r = await action(form);
      setResult(r);
      if (r.ok) router.refresh();
    } catch {
      setResult({ ok: false, message: "We couldn't read that photo. Try a JPG or PNG." });
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <span className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-ice text-small text-slate">
        {photoUrl ? <Image src={photoUrl} alt={`Photo of ${name}`} fill sizes="80px" className="object-cover" /> : "No photo"}
      </span>
      <div className="flex flex-wrap items-center gap-2">
        <label className={`${appBtnSecondary} cursor-pointer has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-blue`}>
          {busy && <Spinner className="size-3.5" />}
          {photoUrl ? "Replace photo" : "Add photo"}
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic" disabled={busy} onChange={(e) => e.target.files?.[0] && send(e.target.files[0])} className="sr-only" />
        </label>
        {photoUrl && (
          <button type="button" disabled={busy} onClick={() => send(null)} className={`${appBtnSecondary} disabled:opacity-60`}>
            Remove photo
          </button>
        )}
        <Feedback result={result} />
      </div>
    </div>
  );
}

type TextField = { key: keyof LawyerApplication; label: string; type?: "text" | "textarea" | "state"; wide?: boolean; rows?: number };

const FIELDS: TextField[] = [
  { key: "fullName", label: "Full name" },
  { key: "firmName", label: "Firm or organization" },
  { key: "email", label: "Work email" },
  { key: "phone", label: "Office phone" },
  { key: "website", label: "Website", wide: true },
  { key: "barState", label: "State bar", type: "state" },
  { key: "barNumber", label: "Bar number" },
  { key: "licensedSince", label: "Year first licensed" },
  { key: "officeStreet", label: "Street address", wide: true },
  { key: "officeCity", label: "City" },
  { key: "officeState", label: "State", type: "state" },
  { key: "officeZip", label: "ZIP code" },
  { key: "languages", label: "Languages", wide: true },
  { key: "bio", label: "About", type: "textarea", wide: true, rows: 6 },
  { key: "education", label: "Education (one per line)", type: "textarea", wide: true, rows: 3 },
  { key: "career", label: "Career (one per line)", type: "textarea", wide: true, rows: 3 },
];

/** Edit a profile with the same rules as the application form. */
export function LawyerEditForm({ action, initial }: { action: (a: LawyerApplication) => Promise<AdminResult>; initial: LawyerApplication }) {
  const router = useRouter();
  const uid = useId();
  const [a, setA] = useState<LawyerApplication>(initial);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<AdminResult | null>(null);
  const errors: ApplicationErrors = result && !result.ok ? (result.errors ?? {}) : {};
  const set = <K extends keyof LawyerApplication>(key: K, value: LawyerApplication[K]) => setA((prev) => ({ ...prev, [key]: value }));
  const toggle = (key: "practiceAreas" | "consultationModes", value: string, on: boolean) =>
    set(key, on ? [...a[key], value] : a[key].filter((v) => v !== value));
  const err = (key: keyof LawyerApplication) => (errors[key] ? <p className="mt-1 text-small text-red">{errors[key]}</p> : null);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setResult(null);
        const r = await action(a).catch(() => ({ ok: false as const, message: "Something went wrong." }));
        setResult(r);
        setBusy(false);
        if (r.ok) router.refresh();
      }}
      noValidate
      className="flex flex-col gap-4"
    >
      <fieldset className="flex flex-wrap gap-x-6">
        <legend className={appFieldLabel}>Role</legend>
        {(
          [
            ["attorney", "Attorney"],
            ["accredited_representative", "Accredited representative"],
          ] as const
        ).map(([value, label]) => (
          <label key={value} className="flex min-h-9 items-center gap-2 text-small text-midnight">
            <input type="radio" checked={a.role === value} onChange={() => set("role", value)} className="size-4 accent-blue" />
            {label}
          </label>
        ))}
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-2">
        {FIELDS.filter((f) => a.role === "attorney" || (f.key !== "barState" && f.key !== "barNumber")).map((f) => {
          const id = `${uid}-${f.key}`;
          const value = String(a[f.key] ?? "");
          return (
            <div key={f.key} className={f.wide ? "sm:col-span-2" : ""}>
              <label htmlFor={id} className={appFieldLabel}>
                {f.label}
              </label>
              {f.type === "textarea" ? (
                <textarea id={id} rows={f.rows} value={value} onChange={(e) => set(f.key, e.target.value as never)} className={`mt-1.5 ${appField} h-auto py-2`} />
              ) : f.type === "state" ? (
                <select id={id} value={value} onChange={(e) => set(f.key, e.target.value as never)} className={`mt-1.5 ${appField} cursor-pointer`}>
                  <option value="">Choose a state</option>
                  {US_STATES.map(([code, name]) => (
                    <option key={code} value={code}>
                      {name}
                    </option>
                  ))}
                </select>
              ) : (
                <input id={id} value={value} onChange={(e) => set(f.key, e.target.value as never)} className={`mt-1.5 ${appField}`} />
              )}
              {err(f.key)}
            </div>
          );
        })}
      </div>
      <fieldset>
        <legend className={appFieldLabel}>Cases</legend>
        <div className="mt-1 grid gap-x-6 sm:grid-cols-2">
          {PRACTICE_AREAS.map((p) => (
            <label key={p.value} className="flex min-h-9 items-center gap-2 text-small text-midnight">
              <input type="checkbox" checked={a.practiceAreas.includes(p.value)} onChange={(e) => toggle("practiceAreas", p.value, e.target.checked)} className="size-4 accent-blue" />
              {p.label}
            </label>
          ))}
        </div>
        {err("practiceAreas")}
      </fieldset>
      <fieldset>
        <legend className={appFieldLabel}>Consultations</legend>
        <div className="mt-1 flex flex-wrap gap-x-6">
          {CONSULTATION_MODES.map((m) => (
            <label key={m.value} className="flex min-h-9 items-center gap-2 text-small text-midnight">
              <input type="checkbox" checked={a.consultationModes.includes(m.value)} onChange={(e) => toggle("consultationModes", m.value, e.target.checked)} className="size-4 accent-blue" />
              {m.label}
            </label>
          ))}
        </div>
        {err("consultationModes")}
        <div className="mt-2 flex flex-wrap items-center gap-x-6">
          {(
            [
              ["free", "Free first consultation"],
              ["paid", "Paid"],
              ["ask", "No price shown"],
            ] as const
          ).map(([value, label]) => (
            <label key={value} className="flex min-h-9 items-center gap-2 text-small text-midnight">
              <input type="radio" checked={a.consultationPrice === value} onChange={() => set("consultationPrice", value)} className="size-4 accent-blue" />
              {label}
            </label>
          ))}
          {a.consultationPrice === "paid" && (
            <label className="flex items-center gap-2 text-small text-midnight">
              $
              <input value={a.consultationFee} onChange={(e) => set("consultationFee", e.target.value)} inputMode="numeric" aria-label="Fee in dollars" className={`${appField} w-24`} />
            </label>
          )}
        </div>
        {err("consultationFee")}
      </fieldset>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={busy} className={`${appBtnPrimary} disabled:opacity-60`}>
          {busy && <Spinner className="size-3.5" />}
          Save profile
        </button>
        {result && (
          <p role={result.ok ? "status" : "alert"} className={`text-small ${result.ok ? "text-teal" : "text-red"}`}>
            {result.message ?? (result.ok ? "Saved." : "")}
          </p>
        )}
      </div>
    </form>
  );
}
