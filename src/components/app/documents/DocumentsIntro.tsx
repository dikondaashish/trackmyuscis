"use client";

import { useState } from "react";
import { Bell, BookUser, Check, CloudUpload, FileText, Lock, ScanText, Sparkles } from "lucide-react";
import { Dialog } from "@/components/app/Dialog";
import { appBtnPrimary, appCard, focusRing } from "@/lib/ui";
import { SetupForm } from "./PasscodeScreens";

const STEPS = [
  { icon: CloudUpload, label: "Upload a photo or PDF" },
  { icon: ScanText, label: "AI reads the dates" },
  { icon: Lock, label: "Locked with your passcode" },
  { icon: Bell, label: "Reminded before it expires" },
] as const;

const STEP_MS = 4200;

/**
 * What a new person sees before they have a passcode: a short line, a looping product film of
 * how Documents works, and one button that opens the passcode setup.
 *
 * The film is one stage. The passport card, the glow and the layers for each scene stay mounted
 * and move between scenes with transitions, so it plays like one continuous shot. Each layer's
 * effects (typing, scan beam, lock closing, countdown) run while it has data-on="true". The
 * active step's timer bar drives the loop: when it finishes, the next scene starts. People who
 * ask for less motion get still scenes and pick them with the steps.
 */
export function DocumentsIntro({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [settingUp, setSettingUp] = useState(false);
  const paused = hovering || settingUp;

  return (
    <section aria-labelledby="intro-title" className={`${appCard} enter enter-delay mt-5 overflow-hidden`}>
      <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="flex flex-col justify-center p-5 sm:p-7">
          <h2 id="intro-title" className="text-h3 text-midnight">
            Your documents, safe and on time
          </h2>
          <p className="mt-2 text-small text-slate">Upload once. We read the expiry date and remind you before it runs out.</p>

          <ol className="mt-6 flex flex-col gap-1" onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
            {STEPS.map((s, i) => {
              const active = i === step;
              const Icon = s.icon;
              return (
                <li key={s.label}>
                  <button
                    type="button"
                    onClick={() => setStep(i)}
                    aria-current={active ? "step" : undefined}
                    className={`group relative flex w-full cursor-pointer items-center gap-3 overflow-hidden rounded-lg px-2.5 py-2.5 text-left transition-colors duration-200 ${focusRing} ${
                      active ? "bg-ice" : "hover:bg-cloud"
                    }`}
                  >
                    <span
                      className={`flex size-8 shrink-0 items-center justify-center rounded-lg transition-[background-color,color,scale] duration-300 ${
                        active ? "scale-105 bg-blue text-white" : "bg-cloud text-slate group-hover:text-midnight"
                      }`}
                    >
                      <Icon aria-hidden className="size-4" />
                    </span>
                    <span className={`text-small font-semibold transition-colors duration-200 ${active ? "text-midnight" : "text-slate"}`}>
                      {s.label}
                    </span>
                    {/* The timer: when it fills, the next scene plays. */}
                    {active && (
                      <span
                        key={step}
                        aria-hidden
                        onAnimationEnd={(e) => e.animationName === "timer" && setStep((step + 1) % STEPS.length)}
                        style={{ "--dur": `${STEP_MS}ms`, animationPlayState: paused ? "paused" : "running" } as React.CSSProperties}
                        className="step-timer absolute inset-x-0 bottom-0 h-0.5 bg-blue/60"
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
            <button type="button" onClick={() => setSettingUp(true)} className={appBtnPrimary}>
              Set up Documents
            </button>
            <p className="text-caption text-slate">Takes a minute.</p>
          </div>
        </div>

        <Stage step={step} />
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

/* Where the shared pieces sit in each scene (px on a 340 × 290 stage). */
const CARD = [
  "translate(0px, -18px) rotate(-3deg) scale(1)",
  "translate(-74px, 0px) rotate(0deg) scale(1)",
  "translate(0px, -10px) rotate(0deg) scale(0.94)",
  "translate(-40px, 30px) rotate(-5deg) scale(0.86)",
];
const GLOW = [
  "translate(0px, 10px) scale(1)",
  "translate(40px, 0px) scale(1.25)",
  "translate(0px, -10px) scale(0.9)",
  "translate(30px, -50px) scale(1.15)",
];
const ease = "cubic-bezier(0.22, 1, 0.36, 1)";

/** The film. Decorative: the steps say the same in words. */
function Stage({ step }: { step: number }) {
  const on = (i: number) => step === i;
  const layer = (i: number) =>
    `absolute transition-[opacity,translate,scale] duration-500 ${on(i) ? "opacity-100 translate-y-0 scale-100" : "pointer-events-none opacity-0"}`;

  return (
    <div
      aria-hidden
      className="relative order-first flex items-center justify-center overflow-hidden border-b border-border bg-cloud py-4 lg:order-last lg:border-b-0 lg:border-l"
    >
      {/* Dotted floor and a soft glow that follows the action. */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,var(--border)_1px,transparent_1px)] [background-size:18px_18px] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_75%)]" />

      <div className="relative h-[290px] w-[340px] shrink-0 origin-center scale-[0.86] min-[420px]:scale-100">
        <div
          className="absolute top-1/2 left-1/2 -mt-32 -ml-32 size-64 rounded-full bg-blue/15 blur-3xl transition-transform duration-1000"
          style={{ transform: GLOW[step], transitionTimingFunction: ease }}
        />

        {/* The passport card, in every scene. */}
        <div
          className="absolute top-1/2 left-1/2 -mt-[100px] -ml-[76px] h-[200px] w-[152px] transition-transform duration-700 motion-reduce:transition-none"
          style={{ transform: CARD[step], transitionTimingFunction: ease }}
        >
          <div className="relative h-full overflow-hidden rounded-xl border border-border bg-white p-3.5 shadow-[0_24px_48px_-24px_rgba(16,34,61,0.45)]">
            <div className="flex items-center gap-1.5">
              <span className="flex size-6 items-center justify-center rounded-md bg-ice text-blue">
                <BookUser className="size-3.5" />
              </span>
              <span className={`text-caption font-semibold text-midnight transition-opacity duration-300 ${step >= 1 ? "opacity-100" : "opacity-0"}`}>
                Passport
              </span>
            </div>
            <div className="mt-3 flex gap-2.5">
              <div className="h-14 w-11 rounded-md bg-gradient-to-b from-ice to-border" />
              <div className="flex-1 space-y-1.5 pt-1">
                <div className="h-1.5 w-full rounded-full bg-border" />
                <div className="h-1.5 w-3/4 rounded-full bg-border" />
                <div className="h-1.5 w-5/6 rounded-full bg-border" />
              </div>
            </div>
            <div className="mt-3 space-y-1.5">
              {[92, 70, 84, 56, 76].map((w) => (
                <div key={w} className="h-1.5 rounded-full bg-border" style={{ width: `${w}%` }} />
              ))}
            </div>
            {/* The expiry line lights up once it's read. */}
            <div
              className={`mt-2.5 h-2 rounded-full transition-[background-color,width] duration-500 ${step >= 1 ? "w-2/3 bg-teal/70" : "w-1/2 bg-border"}`}
            />

            {/* Scan beam while it's being read. */}
            <div data-on={on(1)} className={`absolute inset-0 transition-opacity duration-300 ${on(1) ? "opacity-100" : "opacity-0"}`}>
              <div className="fx-beam absolute inset-x-0 top-0 h-10 border-b-2 border-blue bg-gradient-to-b from-transparent to-blue/15 motion-reduce:hidden" />
            </div>

            {/* Frosted cover while it's locked. */}
            <div className={`absolute inset-0 bg-white/55 backdrop-blur-[3px] transition-opacity duration-500 ${on(2) ? "opacity-100" : "opacity-0"}`} />
          </div>
        </div>

        {/* 1 · Upload: the file uploads under the card. */}
        <div data-on={on(0)} className={`${layer(0)} bottom-3 left-1/2 -ml-[110px] w-[220px] ${on(0) ? "" : "translate-y-3"}`}>
          <div className="fx-rise flex items-center gap-2.5 rounded-xl border border-border bg-white p-2.5 shadow-[0_12px_32px_-18px_rgba(16,34,61,0.45)] [--d:200ms]">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-red/10 text-red">
              <FileText className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-caption font-medium text-midnight">passport.pdf</span>
                <span className="text-caption text-slate tabular-nums">2.4 MB</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-border">
                <div className="fx-fill h-full w-full rounded-full bg-gradient-to-r from-blue to-teal [--d:450ms]" />
              </div>
            </div>
            <span className="fx-pop flex size-5 shrink-0 items-center justify-center rounded-full bg-teal text-white [--d:1750ms]">
              <Check className="size-3" strokeWidth={3} />
            </span>
          </div>
        </div>

        {/* 2 · Read: what AI found, typed out beside the card. */}
        <div data-on={on(1)} className={`${layer(1)} top-1/2 left-1/2 -mt-[66px] ml-[14px] w-[156px] ${on(1) ? "" : "translate-x-4"}`}>
          <div className="rounded-xl border border-border bg-white p-3 shadow-[0_16px_40px_-20px_rgba(16,34,61,0.45)]">
            <p className="flex items-center gap-1 text-caption font-semibold text-blue">
              <Sparkles className="fx-spin size-3.5" />
              Read by AI
            </p>
            <dl className="mt-2.5 space-y-2">
              {[
                ["Type", "Passport", "text-midnight", 350],
                ["Issued", "Mar 5, 2021", "text-midnight", 850],
                ["Expires", "Mar 4, 2031", "text-teal", 1350],
              ].map(([k, v, tone, d]) => (
                <div key={k} className="fx-rise" style={{ "--d": `${Number(d) - 150}ms` } as React.CSSProperties}>
                  <dt className="text-caption text-slate">{k}</dt>
                  <dd className={`fx-type text-small font-semibold tabular-nums ${tone}`} style={{ "--d": `${d}ms` } as React.CSSProperties}>
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* 3 · Lock: the lock drops onto the card and closes; the passcode fills in. */}
        <div data-on={on(2)} className={`${layer(2)} inset-0 ${on(2) ? "" : "scale-95"}`}>
          <div className="absolute top-1/2 left-1/2 -mt-[52px] -ml-8 size-16">
            <span className="ping absolute inset-0 rounded-2xl bg-blue/25 motion-reduce:hidden" />
            <span className="fx-pop relative flex size-16 items-center justify-center rounded-2xl bg-blue text-white shadow-[0_16px_32px_-12px_rgba(40,90,199,0.7)] [--d:250ms]">
              <svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <path className="fx-shackle" d="M7 11V7a5 5 0 0 1 10 0v4" />
                <rect x="4" y="11" width="16" height="10" rx="2.5" fill="currentColor" stroke="none" />
                <circle cx="12" cy="16" r="1.6" className="fill-blue" stroke="none" />
              </svg>
            </span>
          </div>
          <div className="fx-dots absolute bottom-6 left-1/2 -ml-[66px] flex w-[132px] justify-between">
            {Array.from({ length: 6 }, (_, i) => (
              <span key={i} style={{ "--i": i + 4 } as React.CSSProperties} className="size-3.5 rounded-full border-2 border-blue bg-blue" />
            ))}
          </div>
        </div>

        {/* 4 · Remind: the reminder email lands, the bell rings, the days count down. */}
        <div data-on={on(3)} className={`${layer(3)} top-5 left-1/2 -ml-[86px] w-[226px] ${on(3) ? "" : "-translate-y-6"}`}>
          <div className="fx-rise rounded-2xl border border-border bg-white p-3 shadow-[0_24px_48px_-20px_rgba(16,34,61,0.5)] [--d:150ms]">
            <div className="flex items-start gap-2.5">
              <span className="fx-bell flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber text-white">
                <Bell className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-caption font-semibold text-midnight">TrackMyUSCIS</span>
                  <span className="text-caption text-slate">now</span>
                </div>
                <p className="mt-0.5 text-small font-semibold text-midnight">Your passport expires soon</p>
              </div>
            </div>
            <div className="mt-3 flex items-end justify-between rounded-xl bg-amber/10 px-3 py-2">
              <span className="text-caption font-medium text-amber">Days left</span>
              <span className="fx-count text-h3 font-semibold text-amber tabular-nums" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
