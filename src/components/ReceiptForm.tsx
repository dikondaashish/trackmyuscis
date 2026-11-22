"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CircleAlert, CircleCheck } from "lucide-react";
import { USCIS_CASE_STATUS } from "@/lib/content";
import { checkReceipt, type ReceiptCheck } from "@/lib/receipt";
import { btnPrimary, focusRing } from "@/lib/ui";

const nextLink = `inline-flex min-h-11 items-center gap-1.5 rounded text-small font-semibold text-blue ${focusRing}`;

export function ReceiptForm({ onResult }: { onResult?: (result: ReceiptCheck | null) => void }) {
  const inputId = useId();
  const helpId = useId();
  const messageId = useId();
  const [value, setValue] = useState("");
  const [result, setLocal] = useState<ReceiptCheck | null>(null);

  function setResult(next: ReceiptCheck | null) {
    setLocal(next);
    onResult?.(next);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setResult(checkReceipt(value));
  }

  const invalid = result?.ok === false;

  return (
    <form onSubmit={onSubmit} noValidate>
      <label htmlFor={inputId} className="block text-small font-semibold text-midnight">
        USCIS Receipt Number
      </label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input
          id={inputId}
          name="receipt"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (result) setResult(null);
          }}
          placeholder="e.g. IOE0912345678"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          maxLength={20}
          aria-invalid={invalid || undefined}
          aria-describedby={`${helpId} ${messageId}`}
          className="h-14 w-full min-w-0 rounded-[10px] border border-border bg-white px-4 text-body tabular-nums tracking-wide uppercase text-midnight placeholder:normal-case placeholder:tracking-normal placeholder:text-slate/70 transition-[border-color,box-shadow] duration-200 focus:border-blue focus:outline-none focus:ring-4 focus:ring-blue/15 aria-invalid:border-red aria-invalid:ring-red/10"
        />
        <button
          type="submit"
          className={`${btnPrimary} h-14 shrink-0 px-7`}
        >
          Track Case
          <ArrowRight aria-hidden className="size-4" />
        </button>
      </div>
      <p id={helpId} className="mt-2 text-small text-slate">
        3 letters and 10 digits, found at the top of your USCIS receipt notice (Form I‑797C).
      </p>

      <div id={messageId} aria-live="polite" className="text-small">
        {result?.ok === false && (
          <p key={result.error} className="swap mt-3 flex items-start gap-2 text-red">
            <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
            {result.error}
          </p>
        )}
        {result?.ok === true && (
          <div key={result.receipt} className="swap mt-3 rounded-[10px] bg-teal/10 px-4 py-4 text-midnight">
            <p className="flex items-start gap-2">
              <CircleCheck aria-hidden className="pop mt-0.5 size-4 shrink-0 text-teal" style={{ animationDelay: "200ms" }} />
              <span>
                <span className="font-semibold">{result.receipt}</span> is a valid receipt number from{" "}
                {result.office ?? `the ${result.prefix} office`}. Check its current status on the official USCIS
                page.
              </span>
            </p>
            <div className="mt-3 ml-6 flex flex-wrap items-center gap-x-6 gap-y-1">
              <a
                href={USCIS_CASE_STATUS}
                target="_blank"
                rel="noopener noreferrer"
                className={`${btnPrimary} min-h-11 px-5 text-small`}
              >
                Check status on uscis.gov
                <ArrowUpRight aria-hidden className="size-4" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              <Link href="/status-explained" className={nextLink}>
                What each status means
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
