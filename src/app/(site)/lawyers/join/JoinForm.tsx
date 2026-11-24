"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { CircleCheck } from "lucide-react";
import { FormMessage } from "@/components/auth/FormMessage";
import { Spinner } from "@/components/ui/Spinner";
import { BIO_MAX, PRACTICE_AREAS, US_STATES, validateApplication, type ApplicationErrors, type LawyerApplication } from "@/lib/directory";
import { btnPrimary, field, fieldLabel, focusRing } from "@/lib/ui";
import { submitLawyerApplication } from "./actions";

const inlineLink = `rounded font-semibold text-blue underline-offset-2 hover:underline ${focusRing}`;

const EMPTY: LawyerApplication = {
  role: "attorney",
  fullName: "",
  firmName: "",
  email: "",
  phone: "",
  website: "",
  barState: "",
  barNumber: "",
  officeCity: "",
  officeState: "",
  languages: "English",
  practiceAreas: [],
  freeConsultation: false,
  bio: "",
  accurate: false,
  agreed: false,
};

/** Fields in page order, so the first one with a problem can take focus. */
const ORDER: (keyof LawyerApplication)[] = [
  "role", "fullName", "firmName", "email", "phone", "website", "barState", "barNumber",
  "officeCity", "officeState", "languages", "practiceAreas", "bio", "accurate", "agreed",
];

/**
 * The application to join the lawyer directory. Checked in the browser for quick feedback and
 * again on the server. On success the form is replaced by what happens next.
 */
export function JoinForm({ feeLine }: { feeLine: string }) {
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const formRef = useRef<HTMLFormElement>(null);
  const [a, setA] = useState<LawyerApplication>(EMPTY);
  const [trap, setTrap] = useState("");
  const [errors, setErrors] = useState<ApplicationErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const set = <K extends keyof LawyerApplication>(key: K, value: LawyerApplication[K]) => {
    setA((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  function showErrors(found: ApplicationErrors, text: string) {
    setErrors(found);
    setMessage(text);
    const first = ORDER.find((k) => found[k]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const found = validateApplication(a);
    if (Object.keys(found).length > 0) return showErrors(found, "Please fix the fields marked below.");
    setBusy(true);
    try {
      const result = await submitLawyerApplication(a, trap);
      if (result.ok) return setDone(true);
      showErrors(result.errors ?? {}, result.message);
    } catch {
      setMessage("We couldn't send your application. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div role="status" className="swap rounded-xl border border-teal/20 bg-teal/10 p-6 sm:p-8">
        <p className="flex items-center gap-2 text-title font-semibold text-midnight">
          <CircleCheck aria-hidden className="pop size-5 shrink-0 text-teal" />
          Application received
        </p>
        <p className="mt-3 text-body text-midnight">
          Thank you. We&apos;ll check your license and email you at <strong className="font-semibold">{a.email.trim()}</strong> when
          it&apos;s done. There is nothing to pay now. {feeLine}
        </p>
      </div>
    );
  }

  const attorney = a.role === "attorney";
  const err = (key: keyof LawyerApplication) =>
    errors[key] ? (
      <p id={id(`${key}-error`)} className="mt-2 text-small text-red">
        {errors[key]}
      </p>
    ) : null;
  const aria = (key: keyof LawyerApplication) => ({
    "data-field": key,
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? id(`${key}-error`) : undefined,
  });
  const text = (key: "fullName" | "firmName" | "email" | "phone" | "website" | "barNumber" | "officeCity" | "languages", label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div className="min-w-0">
      <label htmlFor={id(key)} className={fieldLabel}>
        {label}
      </label>
      <input
        id={id(key)}
        name={key}
        value={a[key]}
        onChange={(e) => set(key, e.target.value)}
        disabled={busy}
        className={`mt-2 ${field} disabled:opacity-60`}
        {...aria(key)}
        {...props}
      />
      {err(key)}
    </div>
  );
  const state = (key: "barState" | "officeState", label: string) => (
    <div className="min-w-0">
      <label htmlFor={id(key)} className={fieldLabel}>
        {label}
      </label>
      <select
        id={id(key)}
        name={key}
        value={a[key]}
        onChange={(e) => set(key, e.target.value)}
        disabled={busy}
        className={`mt-2 ${field} cursor-pointer disabled:opacity-60`}
        {...aria(key)}
      >
        <option value="">Choose a state</option>
        {US_STATES.map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
      {err(key)}
    </div>
  );

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="flex flex-col gap-8">
      {message && <FormMessage tone="error">{message}</FormMessage>}

      <fieldset disabled={busy}>
        <legend className={fieldLabel}>I am</legend>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {(
            [
              ["attorney", "An attorney", "Licensed by a U.S. state bar"],
              ["accredited_representative", "An accredited representative", "Accredited by the Department of Justice"],
            ] as const
          ).map(([value, label, note], i) => (
            <label
              key={value}
              className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-lg border bg-white p-4 transition-colors duration-200 ${a.role === value ? "border-blue" : "border-border hover:border-blue/50"}`}
            >
              <input
                type="radio"
                name="role"
                value={value}
                checked={a.role === value}
                onChange={() => set("role", value)}
                className="mt-0.5 size-5 shrink-0 cursor-pointer accent-blue"
                {...(i === 0 ? { "data-field": "role" } : {})}
              />
              <span>
                <span className="block text-body font-semibold text-midnight">{label}</span>
                <span className="block text-small text-slate">{note}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        {text("fullName", "Full name", { autoComplete: "name", required: true })}
        {text("firmName", attorney ? "Firm name" : "Recognized organization", { autoComplete: "organization", required: true })}
        {text("email", "Work email", { type: "email", autoComplete: "email", inputMode: "email", required: true })}
        {text("phone", "Office phone", { type: "tel", autoComplete: "tel", inputMode: "tel", required: true })}
        <div className="sm:col-span-2">{text("website", "Website (optional)", { autoComplete: "url", inputMode: "url", placeholder: "e.g. www.firm.com" })}</div>
      </div>

      {attorney && (
        <div>
          <div className="grid gap-4 sm:grid-cols-2">
            {state("barState", "State bar")}
            {text("barNumber", "Bar number", { required: true, autoComplete: "off" })}
          </div>
          <p className="mt-2 text-small text-slate">We look you up on that state bar&apos;s website. If you have more than one license, give one in good standing.</p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {text("officeCity", "Office city", { autoComplete: "address-level2", required: true, placeholder: "e.g. Houston" })}
        {state("officeState", "Office state")}
        <div className="sm:col-span-2">{text("languages", "Languages you work in", { required: true, placeholder: "e.g. English, Spanish, Hindi" })}</div>
      </div>

      <fieldset disabled={busy} {...(errors.practiceAreas ? { "aria-describedby": id("practiceAreas-error") } : {})}>
        <legend className={fieldLabel}>Cases you take</legend>
        <div className="mt-2 grid gap-x-6 sm:grid-cols-2">
          {PRACTICE_AREAS.map((p, i) => (
            <label key={p.value} className="flex min-h-11 cursor-pointer items-center gap-3 text-body text-midnight">
              <input
                type="checkbox"
                name="practiceAreas"
                value={p.value}
                checked={a.practiceAreas.includes(p.value)}
                onChange={(e) => set("practiceAreas", e.target.checked ? [...a.practiceAreas, p.value] : a.practiceAreas.filter((v) => v !== p.value))}
                className="size-5 shrink-0 cursor-pointer accent-blue"
                {...(i === 0 ? { "data-field": "practiceAreas" } : {})}
              />
              {p.label}
            </label>
          ))}
        </div>
        {err("practiceAreas")}
        <label className="mt-2 flex min-h-11 cursor-pointer items-center gap-3 border-t border-border pt-2 text-body text-midnight">
          <input
            type="checkbox"
            name="freeConsultation"
            checked={a.freeConsultation}
            onChange={(e) => set("freeConsultation", e.target.checked)}
            className="size-5 shrink-0 cursor-pointer accent-blue"
          />
          I offer a free first consultation
        </label>
      </fieldset>

      <div>
        <div className="flex items-baseline justify-between gap-4">
          <label htmlFor={id("bio")} className={fieldLabel}>
            About your practice
          </label>
          <span className={`text-small tabular-nums ${a.bio.trim().length > BIO_MAX ? "text-red" : "text-slate"}`}>
            {a.bio.trim().length} / {BIO_MAX}
          </span>
        </div>
        <textarea
          id={id("bio")}
          name="bio"
          rows={4}
          value={a.bio}
          onChange={(e) => set("bio", e.target.value)}
          disabled={busy}
          placeholder="Who you help and how. Plain facts only: no promises about results."
          className={`mt-2 ${field.replace("h-11 ", "min-h-28 ")} py-3 disabled:opacity-60`}
          {...aria("bio")}
        />
        {err("bio")}
      </div>

      {/* Hidden from people; simple bots fill every field. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Leave this empty
          <input tabIndex={-1} autoComplete="off" name="company_url" value={trap} onChange={(e) => setTrap(e.target.value)} />
        </label>
      </div>

      <div className="flex flex-col gap-1">
        <label className="flex min-h-11 cursor-pointer items-start gap-3 text-small text-slate">
          <input
            type="checkbox"
            checked={a.accurate}
            onChange={(e) => set("accurate", e.target.checked)}
            disabled={busy}
            className="mt-0.5 size-5 shrink-0 cursor-pointer accent-blue"
            {...aria("accurate")}
          />
          <span>This information is accurate, I am in good standing and I may submit it for this practice.</span>
        </label>
        {err("accurate")}
        <label className="flex min-h-11 cursor-pointer items-start gap-3 text-small text-slate">
          <input
            type="checkbox"
            checked={a.agreed}
            onChange={(e) => set("agreed", e.target.checked)}
            disabled={busy}
            className="mt-0.5 size-5 shrink-0 cursor-pointer accent-blue"
            {...aria("agreed")}
          />
          <span>
            I agree to the <Link href="/terms" className={inlineLink}>Terms of Service</Link> and the{" "}
            <Link href="/advertising" className={inlineLink}>directory rules</Link>, and I have read the{" "}
            <Link href="/privacy" className={inlineLink}>Privacy Policy</Link>.
          </span>
        </label>
        {err("agreed")}
      </div>

      <div>
        <button type="submit" disabled={busy} className={`${btnPrimary} w-full sm:w-auto disabled:opacity-60`}>
          {busy ? (
            <>
              <Spinner />
              Sending…
            </>
          ) : (
            "Send application"
          )}
        </button>
        <p className="mt-3 text-small text-slate">Applying is free. We don&apos;t ask for a card.</p>
      </div>
    </form>
  );
}
