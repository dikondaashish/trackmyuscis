"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CircleCheck, ImagePlus, X } from "lucide-react";
import { FormMessage } from "@/components/auth/FormMessage";
import { Spinner } from "@/components/ui/Spinner";
import {
  BIO_MAX,
  CAREER_MAX,
  CONSULTATION_MODES,
  EDUCATION_MAX,
  PRACTICE_AREAS,
  US_STATES,
  validateApplication,
  type ApplicationErrors,
  type LawyerApplication,
} from "@/lib/directory";
import { squarePhoto } from "@/lib/square-photo";
import { btnPrimary, btnSecondary, field, fieldLabel, focusRing } from "@/lib/ui";
import { submitLawyerApplication } from "./actions";

const inlineLink = `rounded font-semibold text-blue underline-offset-2 hover:underline ${focusRing}`;
const optional = <span className="font-normal text-slate"> (optional)</span>;

const EMPTY: LawyerApplication = {
  role: "attorney",
  fullName: "",
  firmName: "",
  email: "",
  phone: "",
  website: "",
  barState: "",
  barNumber: "",
  officeStreet: "",
  officeCity: "",
  officeState: "",
  officeZip: "",
  languages: "English",
  practiceAreas: [],
  consultationModes: [],
  consultationPrice: "ask",
  consultationFee: "",
  licensedSince: "",
  education: "",
  career: "",
  bio: "",
  accurate: false,
  agreed: false,
};

type Errors = ApplicationErrors & { photo?: string };
type Key = keyof LawyerApplication | "photo";

/** Fields in page order, so the first one with a problem can take focus. */
const ORDER: Key[] = [
  "role", "fullName", "firmName", "email", "phone", "website", "barState", "barNumber", "licensedSince",
  "officeStreet", "officeCity", "officeState", "officeZip", "consultationModes", "consultationFee",
  "photo", "languages", "practiceAreas", "bio", "education", "career", "accurate", "agreed",
];

/** One group of fields with a heading, so the form reads as a few short steps. */
function Group({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border pt-8 first:border-0 first:pt-0">
      <h3 className="text-title text-midnight">{title}</h3>
      {note && <p className="mt-1 text-small text-slate">{note}</p>}
      <div className="mt-5 flex flex-col gap-5">{children}</div>
    </section>
  );
}

/**
 * The application to join the lawyer directory. Checked in the browser for quick feedback and
 * again on the server. On success the form is replaced by what happens next.
 */
export function JoinForm({ feeLine }: { feeLine: string }) {
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [a, setA] = useState<LawyerApplication>(EMPTY);
  const [photo, setPhoto] = useState<Blob | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [trap, setTrap] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => () => void (preview && URL.revokeObjectURL(preview)), [preview]);

  const set = <K extends keyof LawyerApplication>(key: K, value: LawyerApplication[K]) => {
    setA((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };
  const toggle = (key: "practiceAreas" | "consultationModes", value: string, on: boolean) =>
    set(key, on ? [...a[key], value] : a[key].filter((v) => v !== value));

  async function onPhoto(file: File | undefined) {
    setErrors((prev) => ({ ...prev, photo: undefined }));
    if (!file) return;
    try {
      const blob = await squarePhoto(file);
      setPhoto(blob);
      setPreview(URL.createObjectURL(blob));
    } catch {
      setErrors((prev) => ({ ...prev, photo: "We couldn't read that photo. Try a JPG or PNG." }));
    }
    if (fileRef.current) fileRef.current.value = "";
  }

  function showErrors(found: Errors, text: string) {
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
      const body = new FormData();
      body.set("application", JSON.stringify(a));
      body.set("trap", trap);
      if (photo) body.set("photo", new File([photo], "photo.jpg", { type: "image/jpeg" }));
      const result = await submitLawyerApplication(body);
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
          your profile is live. There is nothing to pay now. {feeLine}
        </p>
      </div>
    );
  }

  const attorney = a.role === "attorney";
  const err = (key: Key) =>
    errors[key] ? (
      <p id={id(`${key}-error`)} className="mt-2 text-small text-red">
        {errors[key]}
      </p>
    ) : null;
  const aria = (key: Key) => ({
    "data-field": key,
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? id(`${key}-error`) : undefined,
  });
  type TextKey = "fullName" | "firmName" | "email" | "phone" | "website" | "barNumber" | "officeStreet" | "officeCity" | "officeZip" | "languages" | "licensedSince" | "consultationFee";
  const text = (key: TextKey, label: React.ReactNode, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
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
  const box = (key: "bio" | "education" | "career", label: React.ReactNode, rows: number, placeholder: string, counter = false) => (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id(key)} className={fieldLabel}>
          {label}
        </label>
        {counter && (
          <span className={`text-small tabular-nums ${a[key].trim().length > BIO_MAX ? "text-red" : "text-slate"}`}>
            {a[key].trim().length} / {BIO_MAX}
          </span>
        )}
      </div>
      <textarea
        id={id(key)}
        name={key}
        rows={rows}
        value={a[key]}
        onChange={(e) => set(key, e.target.value)}
        disabled={busy}
        placeholder={placeholder}
        className={`mt-2 ${field.replace("h-11 ", "min-h-24 ")} py-3 disabled:opacity-60`}
        {...aria(key)}
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
  const check = (key: "practiceAreas" | "consultationModes", value: string, label: string, first: boolean) => (
    <label key={value} className="flex min-h-11 cursor-pointer items-center gap-3 text-body text-midnight">
      <input
        type="checkbox"
        name={key}
        value={value}
        checked={a[key].includes(value)}
        onChange={(e) => toggle(key, value, e.target.checked)}
        className="size-5 shrink-0 cursor-pointer accent-blue"
        {...(first ? { "data-field": key } : {})}
      />
      {label}
    </label>
  );

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="flex flex-col gap-8">
      {message && <FormMessage tone="error">{message}</FormMessage>}

      <Group title="Who you are">
        <fieldset disabled={busy}>
          <legend className="sr-only">I am</legend>
          <div className="grid gap-3 sm:grid-cols-2">
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
        <div className="grid gap-5 sm:grid-cols-2">
          {text("fullName", "Full name", { autoComplete: "name" })}
          {text("firmName", attorney ? "Firm name" : "Recognized organization", { autoComplete: "organization" })}
          {text("email", "Work email", { type: "email", autoComplete: "email", inputMode: "email" })}
          {text("phone", "Office phone", { type: "tel", autoComplete: "tel", inputMode: "tel" })}
          <div className="sm:col-span-2">{text("website", <>Website{optional}</>, { autoComplete: "url", inputMode: "url", placeholder: "e.g. www.firm.com" })}</div>
        </div>
      </Group>

      <Group
        title={attorney ? "Your license" : "Your accreditation"}
        note={attorney ? "We look you up on that state bar's website. Your bar number is never shown on your profile." : "We look you up on the Department of Justice roster."}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {attorney && state("barState", "State bar")}
          {attorney && text("barNumber", "Bar number", { autoComplete: "off" })}
          {text("licensedSince", <>{attorney ? "Year first licensed" : "Year first accredited"}{optional}</>, { inputMode: "numeric", placeholder: "e.g. 2012", maxLength: 4 })}
        </div>
      </Group>

      <Group title="Your office">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">{text("officeStreet", <>Street address{optional}</>, { autoComplete: "street-address", placeholder: "e.g. 1200 Main St, Suite 400" })}</div>
          {text("officeCity", "City", { autoComplete: "address-level2", placeholder: "e.g. Houston" })}
          {state("officeState", "State")}
          {text("officeZip", <>ZIP code{optional}</>, { autoComplete: "postal-code", inputMode: "numeric", maxLength: 10 })}
        </div>
      </Group>

      <Group title="Consultations" note="Shown as tags on the lawyer list, so people can see at a glance how to reach you.">
        <fieldset disabled={busy} {...(errors.consultationModes ? { "aria-describedby": id("consultationModes-error") } : {})}>
          <legend className={fieldLabel}>How you meet people</legend>
          <div className="mt-1 grid gap-x-6 sm:grid-cols-3">
            {CONSULTATION_MODES.map((m, i) => check("consultationModes", m.value, m.label, i === 0))}
          </div>
          {err("consultationModes")}
        </fieldset>
        <fieldset disabled={busy}>
          <legend className={fieldLabel}>First consultation</legend>
          <div className="mt-1 grid gap-x-6 sm:grid-cols-3">
            {(
              [
                ["free", "Free"],
                ["paid", "Paid"],
                ["ask", "Don't show a price"],
              ] as const
            ).map(([value, label]) => (
              <label key={value} className="flex min-h-11 cursor-pointer items-center gap-3 text-body text-midnight">
                <input
                  type="radio"
                  name="consultationPrice"
                  value={value}
                  checked={a.consultationPrice === value}
                  onChange={() => set("consultationPrice", value)}
                  className="size-5 shrink-0 cursor-pointer accent-blue"
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        {a.consultationPrice === "paid" && (
          <div className="sm:max-w-60">{text("consultationFee", "Fee in dollars", { inputMode: "numeric", placeholder: "e.g. 150" })}</div>
        )}
      </Group>

      <Group title="Your profile" note="What people see on your profile page.">
        <div>
          <p className={fieldLabel}>Photo{optional}</p>
          <div className="mt-2 flex items-center gap-4">
            <span className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-ice">
              {preview ? (
                <Image src={preview} alt="Your profile photo" fill unoptimized className="object-cover" />
              ) : (
                <ImagePlus aria-hidden className="size-6 text-slate" />
              )}
            </span>
            <div className="flex flex-wrap gap-2">
              <label className={`${btnSecondary} cursor-pointer has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-blue`}>
                {preview ? "Change photo" : "Add a photo"}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/heic"
                  disabled={busy}
                  onChange={(e) => onPhoto(e.target.files?.[0])}
                  className="sr-only"
                  data-field="photo"
                  aria-describedby={id("photo-note")}
                />
              </label>
              {preview && (
                <button
                  type="button"
                  onClick={() => {
                    setPhoto(null);
                    setPreview(null);
                  }}
                  className={`inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-lg px-3 text-small font-semibold text-slate hover:text-midnight ${focusRing}`}
                >
                  <X aria-hidden className="size-4" />
                  Remove
                </button>
              )}
            </div>
          </div>
          <p id={id("photo-note")} className="mt-2 text-small text-slate">A clear, recent headshot. We crop it to a square.</p>
          {err("photo")}
        </div>
        {text("languages", "Languages you work in", { placeholder: "e.g. English, Spanish, Hindi" })}
        <fieldset disabled={busy} {...(errors.practiceAreas ? { "aria-describedby": id("practiceAreas-error") } : {})}>
          <legend className={fieldLabel}>Cases you take</legend>
          <div className="mt-1 grid gap-x-6 sm:grid-cols-2">{PRACTICE_AREAS.map((p, i) => check("practiceAreas", p.value, p.label, i === 0))}</div>
          {err("practiceAreas")}
        </fieldset>
        {box("bio", "About your practice", 5, "Who you help and how. Plain facts only: no promises about results.", true)}
        {box("education", <>Education{optional}</>, 3, `One per line, up to ${EDUCATION_MAX}. e.g. J.D., University of Houston Law Center, 2012`)}
        {box("career", <>Career{optional}</>, 3, `One per line, up to ${CAREER_MAX}. e.g. Founded Lopez Immigration Law, 2018`)}
      </Group>

      {/* Hidden from people; simple bots fill every field. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Leave this empty
          <input tabIndex={-1} autoComplete="off" name="company_url" value={trap} onChange={(e) => setTrap(e.target.value)} />
        </label>
      </div>

      <div className="flex flex-col gap-1 border-t border-border pt-8">
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
