"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "./Dialog";
import { WORK_PERMIT_WHY, WorkPermitForm } from "./WorkPermitCategory";
import { BIOMETRICS_NOTE, BiometricsDateForm, showIsoDate } from "./BiometricsAttendance";
import type { FilingCategory } from "@/lib/filing-category";
import { focusRing } from "@/lib/ui";

/** Small link-style button in a dashboard row, above the row's own link. */
const rowButton = `relative z-10 -ml-1 mr-2 inline-flex min-h-7 cursor-pointer items-center rounded px-1 text-caption font-medium text-blue underline-offset-2 hover:underline ${focusRing}`;

/**
 * Dashboard rows ask their open questions in a popup on the same page, so people don't
 * have to open the case. The case page keeps its own panels for the same questions.
 */
export function WorkPermitQuestion({ caseId, suggested }: { caseId: string; suggested: FilingCategory | null }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={rowButton}>
        Add work permit type
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} title="What is this work permit for?" description={WORK_PERMIT_WHY}>
        <WorkPermitForm
          caseId={caseId}
          saved={null}
          suggested={suggested}
          onSaved={() => {
            setOpen(false);
            router.refresh();
          }}
          secondary={{ label: "Cancel", onClick: () => setOpen(false) }}
        />
      </Dialog>
    </>
  );
}

export function BiometricsQuestion({ caseId, scheduledOn }: { caseId: string; scheduledOn: string | null }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={rowButton}>
        Confirm biometrics
      </button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Have you been to your biometrics appointment?"
        description={`USCIS sent an appointment notice${scheduledOn ? ` on ${showIsoDate(scheduledOn)}` : ""}. Choose the day you went.`}
      >
        <BiometricsDateForm
          caseId={caseId}
          saved={null}
          scheduledOn={scheduledOn}
          onCancel={() => setOpen(false)}
          onSaved={() => {
            setOpen(false);
            router.refresh();
          }}
        />
        <p className="mt-3 text-caption text-slate">{BIOMETRICS_NOTE}</p>
      </Dialog>
    </>
  );
}
