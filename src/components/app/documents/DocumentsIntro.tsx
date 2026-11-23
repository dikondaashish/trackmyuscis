"use client";

import { useEffect, useState } from "react";
import { Bell, BookUser, Check, CloudUpload, FileText, Lock, Mail, ScanText, Sparkles } from "lucide-react";
import { Dialog } from "@/components/app/Dialog";
import { appBtnPrimary, appCard, focusRing } from "@/lib/ui";
import { SetupForm } from "./PasscodeScreens";

/** The four things Documents does, shown as steps beside a looping picture of each. */
const STEPS = [
  {
    icon: CloudUpload,
    title: "Upload a photo or PDF",
    text: "Passport, green card, work permit, I-797 notices and more.",
  },
  {
    icon: ScanText,
    title: "We read the details",
    text: "AI finds the document type and its expiry date. You can change anything.",
  },
  {
    icon: Lock,
    title: "Locked with your passcode",
    text: "Only you can open it, even on a shared computer or phone.",
  },
  {
    icon: Bell,
    title: "Reminded before it expires",
    text: "An email 60 days before, then again as the date gets closer.",
  },
] as const;

const STEP_MS = 3600;

/**
 * What a new person sees before they have a passcode: what Documents is for, a short looping
 * picture of how it works, and one button that opens the passcode setup.
 */
export function DocumentsIntro({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [settingUp, setSettingUp] = useState(false);

  useEffect(() => {
    // People who ask for less motion pick a step themselves; nothing moves on its own.
    if (paused || settingUp || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => setStep((s) => (s + 1) % STEPS.length), STEP_MS);
    return () => window.clearTimeout(t);
  }, [step, paused, settingUp]);

  return (
    <section aria-labelledby="intro-title" className={`${appCard} enter enter-delay mt-5 overflow-hidden`}>
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <div className="flex flex-col p-5 sm:p-7">
          <h2 id="intro-title" className="text-title text-midnight">
            Keep your documents safe, and never miss an expiry date
          </h2>
          <p className="mt-1.5 text-small text-slate">
            Save your immigration documents in one private place. We read the dates for you and email you before
            anything runs out.
          </p>

          <ol
            className="mt-5 flex flex-col gap-1"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {STEPS.map((s, i) => {
              const active = i === step;
              const Icon = s.icon;
              return (
                <li key={s.title}>
                  <button
                    type="button"
                    onClick={() => setStep(i)}
                    onFocus={() => setPaused(true)}
                    onBlur={() => setPaused(false)}
                    aria-current={active ? "step" : undefined}
                    className={`flex w-full cursor-pointer items-start gap-3 rounded-lg p-2.5 text-left transition-colors duration-200 ${focusRing} ${
                      active ? "bg-ice" : "hover:bg-cloud"
                    }`}
                  >
                    <span
                      className={`flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ${
                        active ? "bg-blue text-white" : "bg-cloud text-slate"
                      }`}
                    >
                      <Icon aria-hidden className="size-4" />
                    </span>
                    <span className="min-w-0">
                      <span className={`block text-small font-semibold ${active ? "text-midnight" : "text-slate"}`}>
                        {s.title}
                      </span>
                      <span className="block text-small text-slate">{s.text}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <button type="button" onClick={() => setSettingUp(true)} className={appBtnPrimary}>
              Set up Documents
            </button>
            <p className="text-caption text-slate">Takes a minute. You&apos;ll choose a 6-digit passcode.</p>
          </div>
        </div>

        {/* The picture: one scene per step. Decorative; the steps say the same in words. */}
        <div aria-hidden className="relative order-first flex min-h-72 items-center justify-center border-b border-border bg-cloud p-6 pb-10 lg:order-last lg:min-h-80 lg:border-b-0 lg:border-l">
          <div key={step} className="swap w-full max-w-sm">
            {step === 0 && <UploadScene />}
            {step === 1 && <ReadScene />}
            {step === 2 && <LockScene />}
            {step === 3 && <ReminderScene />}
          </div>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
            {STEPS.map((s, i) => (
              <span
                key={s.title}
                className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${i === step ? "w-5 bg-blue" : "w-1.5 bg-border"}`}
              />
            ))}
          </div>
        </div>
      </div>

      <Dialog
        open={settingUp}
        onClose={() => setSettingUp(false)}
        title="Set a passcode for your documents"
        description="You'll enter it each time you open Documents, so nobody else using your device can see them."
      >
        <SetupForm onDone={onDone} onCancel={() => setSettingUp(false)} />
      </Dialog>
    </section>
  );
}

/** A file lands in the upload box and its upload bar fills. */
function UploadScene() {
  return (
    <div className="rounded-xl border-2 border-dashed border-blue/30 bg-white p-5 text-center">
      <span className="mx-auto flex size-10 items-center justify-center rounded-xl bg-ice text-blue">
        <CloudUpload className="size-5" />
      </span>
      <p className="mt-2 text-small font-medium text-midnight">Drop a file here</p>
      <p className="text-caption text-slate">PDF, JPG, PNG or WebP</p>
      <div className="pop mt-4 flex items-center gap-3 rounded-lg border border-border bg-white p-2.5 text-left shadow-[0_8px_24px_-16px_rgba(16,34,61,0.35)] [animation-delay:250ms]">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-red/10 text-red">
          <FileText className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-caption font-medium text-midnight">passport.pdf</p>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-border">
            <div className="progress-fill h-full w-full rounded-full bg-teal" />
          </div>
        </div>
        <span className="pop flex size-5 shrink-0 items-center justify-center rounded-full bg-teal text-white [animation-delay:1300ms]">
          <Check className="size-3" />
        </span>
      </div>
    </div>
  );
}

/** A line sweeps down a sample passport while the details it finds appear. */
function ReadScene() {
  const fields = [
    ["Type", "Passport"],
    ["Issued", "Mar 5, 2021"],
    ["Expires", "Mar 4, 2031"],
  ];
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-32 shrink-0 overflow-hidden rounded-lg border border-border bg-white p-3 [--scan-distance:150px]">
        <BookUser className="size-5 text-blue" />
        <div className="mt-3 space-y-1.5">
          {[80, 60, 90, 50, 70, 40].map((w) => (
            <div key={w} className="h-1.5 rounded-full bg-border" style={{ width: `${w}%` }} />
          ))}
        </div>
        <div className="doc-scan pointer-events-none absolute inset-x-0 top-0 h-6 border-b-2 border-blue bg-gradient-to-b from-transparent to-blue/15 opacity-0 motion-reduce:hidden" />
      </div>
      <div className="min-w-0 flex-1 rounded-lg border border-border bg-white p-3">
        <p className="flex items-center gap-1 text-caption font-medium text-blue">
          <Sparkles className="size-3.5" />
          Read by AI
        </p>
        <dl className="stagger mt-2 space-y-1.5 [--stagger-base:500ms]">
          {fields.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between gap-2">
              <dt className="text-caption text-slate">{k}</dt>
              <dd className={`text-caption font-semibold tabular-nums ${k === "Expires" ? "text-teal" : "text-midnight"}`}>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

/** Six passcode dots fill in and the lock closes. */
function LockScene() {
  return (
    <div className="rounded-xl border border-border bg-white p-5 text-center">
      <span className="pop mx-auto flex size-12 items-center justify-center rounded-xl bg-ice text-blue">
        <Lock className="size-6" />
      </span>
      <p className="mt-3 text-small font-medium text-midnight">Your documents are locked</p>
      <div className="fill-dots mt-3 flex justify-center gap-2">
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i} style={{ "--i": i } as React.CSSProperties} className="size-3 rounded-full border-2 border-blue bg-blue" />
        ))}
      </div>
      <p className="mt-3 text-caption text-slate">Only your passcode opens them</p>
    </div>
  );
}

/** A reminder email arrives. */
function ReminderScene() {
  return (
    <div className="relative">
      <span className="absolute -top-2 -right-2 flex size-8 items-center justify-center">
        <span className="ping absolute inline-flex size-full rounded-full bg-amber/30" />
        <span className="relative flex size-8 items-center justify-center rounded-full bg-amber text-white">
          <Bell className="size-4" />
        </span>
      </span>
      <div className="rounded-xl border border-border bg-white p-4 shadow-[0_8px_24px_-16px_rgba(16,34,61,0.35)]">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-ice text-blue">
            <Mail className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="text-caption font-semibold text-midnight">TrackMyUSCIS</p>
            <p className="text-caption text-slate">Expiry reminder</p>
          </div>
        </div>
        <p className="mt-3 text-small font-semibold text-midnight">Your passport expires in 60 days</p>
        <p className="mt-1 text-caption text-slate">Start your renewal early so there&apos;s no gap.</p>
        <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-amber/10 px-2 py-0.5 text-caption font-medium text-amber">
          60 days left
        </span>
      </div>
    </div>
  );
}
