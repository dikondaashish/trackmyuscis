import Link from "next/link";
import { STATUS_PAGES, statusHref } from "@/lib/statuses";
import { card, focusRing } from "@/lib/ui";

/** The USCIS status people usually see at a step, so each step leads to its own explanation. */
const STEP_STATUS: [RegExp, string][] = [
  [/received/i, "Case Was Received"],
  [/biometrics/i, "Biometrics Appointment Was Scheduled"],
  [/request for evidence|under review/i, "Case Is Being Actively Reviewed"],
  [/interview/i, "Interview Was Scheduled"],
  [/oath/i, "Oath Ceremony Notice Was Mailed"],
  [/produced|mailed/i, "New Card Is Being Produced"],
];

function statusFor(step: string) {
  const name = STEP_STATUS.find(([re]) => re.test(step))?.[1];
  return STATUS_PAGES.find((s) => s.name === name);
}

/**
 * The steps most cases go through, as a path: across the page on desktop, down it on phones.
 * These are typical steps, not this visitor's progress, so nothing is shown as "done".
 */
export function Journey({ steps }: { steps: string[] }) {
  return (
    <ol
      className={`${card} reveal grid gap-0 p-5 sm:p-6 lg:grid-cols-[repeat(var(--steps),minmax(0,1fr))] lg:gap-4`}
      style={{ "--steps": steps.length } as React.CSSProperties}
    >
      {steps.map((step, i) => {
        const status = statusFor(step);
        const last = i === steps.length - 1;
        return (
          <li key={step} className="relative flex gap-4 pb-6 last:pb-0 lg:block lg:pb-0">
            {/* The line to the next step: down the side on phones, across the top on desktop. */}
            {!last && (
              <>
                <span aria-hidden className="absolute top-9 bottom-0 left-[17px] w-0.5 bg-border lg:hidden" />
                <span aria-hidden className="absolute top-[17px] right-[-1rem] left-11 hidden h-0.5 bg-border lg:block" />
              </>
            )}
            <span className="relative flex size-9 shrink-0 items-center justify-center rounded-full bg-ice text-small font-semibold text-blue tabular-nums">
              {i + 1}
            </span>
            <div className="min-w-0 pt-1.5 lg:pt-4 lg:pr-2">
              <p className="text-body font-semibold text-midnight">{step}</p>
              {status && (
                <Link
                  href={statusHref(status)}
                  className={`link-draw inline-flex min-h-11 items-center rounded text-small font-medium text-blue ${focusRing}`}
                >
                  <span className="sr-only">Status at this step: </span>“{status.name}”
                </Link>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
