import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SERVICE_CENTERS, type ReceiptCheck } from "@/lib/receipt";
import { focusRing } from "@/lib/ui";

/**
 * Hero card: how to read a receipt number. It starts with a sample number and, once the
 * visitor checks their own, shows theirs split the same way. Everything here matches the
 * answer pages (checked against uscis.gov).
 */
const SAMPLE = "IOE0912345678";

/** The prefixes people see most, in the order the answer page explains them. */
const PREFIXES = ["IOE", "EAC", "WAC", "LIN", "SRC", "MSC"];

export function HeroReceiptCard({ result }: { result?: Extract<ReceiptCheck, { ok: true }> | null }) {
  const receipt = result?.receipt ?? SAMPLE;
  const prefix = receipt.slice(0, 3);
  const parts = [
    {
      chars: prefix,
      label: "Office",
      note: result ? (result.office ?? "The office or system that received your case") : "The office or system that received your case",
    },
    { chars: receipt.slice(3, 5), label: "Year", note: "Usually the fiscal year USCIS received it" },
    { chars: receipt.slice(5), label: "Your case", note: "The rest of the number is unique to your case" },
  ];
  /** A prefix we know that isn't in the short list still gets its own row. */
  const rows = result && SERVICE_CENTERS[prefix] && !PREFIXES.includes(prefix) ? [prefix, ...PREFIXES] : PREFIXES;

  return (
    <div className="rounded-2xl border border-border bg-white p-5 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-title font-semibold text-midnight">
          {result ? "How to read your receipt number" : "How to read a receipt number"}
        </h2>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-caption font-medium ${
            result ? "bg-teal/10 text-teal" : "border border-border text-slate"
          }`}
        >
          {result ? "Your number" : "Sample number"}
        </span>
      </div>

      {/* Re-keyed so the tiles settle in again when the number changes. */}
      <dl key={receipt} className={`mt-6 grid gap-3 sm:grid-cols-[auto_auto_1fr] ${result ? "swap" : ""}`}>
        {parts.map((p, i) => (
          <div key={p.label} className="rounded-xl border border-border bg-cloud p-4">
            <dt className="text-small text-slate">{p.label}</dt>
            <dd className="mt-1">
              <span className={`block text-h3 tabular-nums ${i === 0 ? "text-blue" : "text-midnight"}`}>{p.chars}</span>
              <span className="mt-2 block max-w-[16rem] text-small text-slate">{p.note}</span>
            </dd>
          </div>
        ))}
      </dl>

      <h3 className="mt-8 text-small font-semibold text-midnight">What the three letters mean</h3>
      <dl className="mt-2 divide-y divide-border border-y border-border">
        {rows.map((code) => {
          const yours = result != null && code === prefix;
          return (
            <div
              key={code}
              className={`flex items-baseline gap-4 py-2.5 transition-colors duration-200 ${yours ? "-mx-3 rounded-lg bg-ice px-3" : ""}`}
            >
              <dt className={`w-10 shrink-0 text-small font-semibold tabular-nums ${yours ? "text-blue" : "text-midnight"}`}>
                {code}
              </dt>
              <dd className={`text-small ${yours ? "text-midnight" : "text-slate"}`}>
                {SERVICE_CENTERS[code]}
                {yours && <span className="sr-only"> (your office)</span>}
              </dd>
            </div>
          );
        })}
      </dl>

      <Link
        href="/answers/uscis-receipt-number-letters"
        className={`group mt-4 inline-flex min-h-11 items-center gap-1.5 rounded text-small font-semibold text-blue ${focusRing}`}
      >
        See every prefix
        <ArrowRight
          aria-hidden
          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
        />
      </Link>
    </div>
  );
}
