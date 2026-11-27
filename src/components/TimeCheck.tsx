"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { TimeCheckForm } from "@/lib/processing-times";
import { card, field, fieldLabel, textLink } from "@/lib/ui";

const DAY = 86_400_000;
const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
const monthYear = (d: Date) => d.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });

/** "7 months and 12 days", counted on the calendar. */
function waited(from: Date, to: Date) {
  let months = (to.getUTCFullYear() - from.getUTCFullYear()) * 12 + to.getUTCMonth() - from.getUTCMonth();
  if (to.getUTCDate() < from.getUTCDate()) months -= 1;
  const anchor = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth() + months, from.getUTCDate()));
  const days = Math.max(0, Math.round((to.getTime() - anchor.getTime()) / DAY));
  const parts = [
    ...(months > 0 ? [`${months} month${months === 1 ? "" : "s"}`] : []),
    ...(days > 0 || months === 0 ? [`${days} day${days === 1 ? "" : "s"}`] : []),
  ];
  return parts.join(" and ");
}

type Verdict =
  | { kind: "future" }
  | { kind: "ok"; waited: string; share: number; by: string; past: boolean | null };

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  const id = useId();
  return (
    <div className="min-w-0">
      <label htmlFor={id} className={fieldLabel}>
        {label}
      </label>
      <div className="relative mt-2">
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={`${field} cursor-pointer appearance-none pr-11`}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-slate" />
      </div>
    </div>
  );
}

/**
 * Find the official time for a form, category and office, and (with the date USCIS received
 * the case) see whether the case is past USCIS's own case inquiry date. Everything is worked
 * out in the browser from the snapshot on the page; the date is never sent anywhere.
 */
export function TimeCheck({
  forms,
  checked,
  link = "office",
}: {
  forms: TimeCheckForm[];
  checked: string;
  /** Where the result leads: the form's full table, the office's own page, or nowhere. */
  link?: "form" | "office" | "none";
}) {
  const dateId = useId();
  const helpId = useId();
  const [formSlug, setFormSlug] = useState(forms[0].slug);
  const [categoryCode, setCategoryCode] = useState(forms[0].categories[0].code);
  const [officeCode, setOfficeCode] = useState(forms[0].categories[0].offices[0].code);
  const [date, setDate] = useState("");
  const [verdict, setVerdict] = useState<Verdict | null>(null);

  const form = forms.find((f) => f.slug === formSlug) ?? forms[0];
  const category = form.categories.find((c) => c.code === categoryCode) ?? form.categories[0];
  const office = category.offices.find((o) => o.code === officeCode) ?? category.offices[0];

  function judge(value: string, line: typeof office) {
    if (!value) return setVerdict(null);
    const received = new Date(`${value}T00:00:00Z`);
    const now = new Date();
    const today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    if (Number.isNaN(received.getTime()) || received.getUTCFullYear() < 1990) return setVerdict(null);
    if (received > today) return setVerdict({ kind: "future" });
    const posted = line.months * 30.44 * DAY;
    setVerdict({
      kind: "ok",
      waited: waited(received, today),
      share: Math.min(1, (today.getTime() - received.getTime()) / posted),
      by: monthYear(new Date(received.getTime() + posted)),
      past: line.inquiry ? value < line.inquiry : null,
    });
  }

  function pick(next: { form?: string; category?: string; office?: string }) {
    const f = forms.find((x) => x.slug === (next.form ?? formSlug)) ?? forms[0];
    const c = f.categories.find((x) => x.code === (next.category ?? categoryCode)) ?? f.categories[0];
    const o = c.offices.find((x) => x.code === (next.office ?? officeCode)) ?? c.offices[0];
    setFormSlug(f.slug);
    setCategoryCode(c.code);
    setOfficeCode(o.code);
    judge(date, o);
  }

  const inquiry = office.inquiry ? fmt(new Date(`${office.inquiry}T00:00:00Z`)) : null;

  return (
    <div className={`${card} reveal grid overflow-hidden lg:grid-cols-2`}>
      <div className="grid content-start gap-4 p-5 sm:p-6">
        {forms.length > 1 && (
          <Select
            label="Form"
            value={form.slug}
            onChange={(v) => pick({ form: v, category: "", office: "" })}
            options={forms.map((f) => ({ value: f.slug, label: `${f.code}: ${f.label}` }))}
          />
        )}
        {form.categories.length > 1 && (
          <Select
            label="Category"
            value={category.code}
            onChange={(v) => pick({ category: v, office: "" })}
            options={form.categories.map((c) => ({ value: c.code, label: c.name }))}
          />
        )}
        {category.offices.length > 1 && (
          <Select
            label="Office"
            value={office.code}
            onChange={(v) => pick({ office: v })}
            options={category.offices.map((o) => ({ value: o.code, label: o.label }))}
          />
        )}
        <div>
          <label htmlFor={dateId} className={fieldLabel}>
            Date USCIS received your case
          </label>
          <input
            id={dateId}
            type="date"
            value={date}
            min="1990-01-01"
            onChange={(e) => {
              setDate(e.target.value);
              judge(e.target.value, office);
            }}
            aria-describedby={helpId}
            className={`${field} mt-2`}
          />
          <p id={helpId} className="mt-2 text-small text-slate">
            The received date on your receipt notice (Form I-797C). It stays in your browser.
          </p>
        </div>
      </div>

      <div aria-live="polite" className="border-t border-border bg-cloud p-5 sm:p-6 lg:border-t-0 lg:border-l">
        <p className="text-small text-slate">80% of cases finished within</p>
        <p key={`${form.slug}-${category.code}-${office.code}`} className="swap mt-1 text-display text-midnight tabular-nums">
          {office.time}
        </p>
        <p className="mt-2 text-small text-slate">
          Form {form.code}
          {form.categories.length > 1 ? ` · ${category.name}` : ""} · {office.label}
        </p>
        <p className="mt-1 text-small text-slate">
          {inquiry ? `Case inquiry date: ${inquiry}. ` : ""}Read from USCIS on {checked}.
        </p>

        {verdict?.kind === "future" && <p className="mt-5 text-small text-red">That date is in the future. Check the year.</p>}

        {verdict?.kind === "ok" && (
          <div key={`${date}-${office.code}`} className="swap mt-5 border-t border-border pt-5">
            {verdict.past !== null && (
              <StatusBadge tone={verdict.past ? "warning" : "success"}>
                {verdict.past ? "Outside the normal time" : "Within the normal time"}
              </StatusBadge>
            )}
            <p className="mt-3 text-body font-semibold text-midnight">You have waited {verdict.waited}.</p>
            <div aria-hidden className="mt-3 h-2 overflow-hidden rounded-full bg-border">
              <div className="grow-x h-full origin-left rounded-full bg-teal" style={{ width: `${Math.max(2, verdict.share * 100)}%` }} />
            </div>
            <p className="mt-3 text-small text-slate">
              {verdict.past === true &&
                `USCIS received your case before its case inquiry date (${inquiry}), so you can ask USCIS about it.`}
              {verdict.past === false &&
                `USCIS takes questions about cases received before ${inquiry}. Yours came in after that, so it is still inside the normal time.`}
              {verdict.past === null && "USCIS lists no case inquiry date for this line."}{" "}
              Counting the posted time from your date gives about {verdict.by}. That is the 80% mark, not a promise.
            </p>
            {verdict.past && (
              <Link href="/answers/contact-uscis-about-delayed-case" className={`mt-1 text-small ${textLink}`}>
                How to ask USCIS about a delayed case
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            )}
          </div>
        )}

        {(link === "form" || (link === "office" && office.href)) && (
          <Link href={link === "form" ? `/processing-times/${form.slug}` : office.href!} className={`mt-3 text-small ${textLink}`}>
            {link === "form" ? `Every Form ${form.code} office and category` : `Form ${form.code} at ${office.label}`}
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
