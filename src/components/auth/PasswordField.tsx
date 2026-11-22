"use client";

import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { field, fieldLabel, focusRing } from "@/lib/ui";

/** A password input with a 44px show/hide button inside it. */
export function PasswordField({
  label,
  value,
  onChange,
  autoComplete,
  describedBy,
  hint,
  invalid,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: "current-password" | "new-password";
  describedBy?: string;
  /** Short text at the right of the label row, such as the password rules. */
  hint?: React.ReactNode;
  invalid?: boolean;
  disabled?: boolean;
}) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className={fieldLabel}>
          {label}
        </label>
        {hint}
      </div>
      <div className="relative mt-1.5">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          required
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className={`${field} pr-14 disabled:opacity-60`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className={`absolute inset-y-0.5 right-0.5 inline-flex w-11 cursor-pointer items-center justify-center rounded-[8px] text-slate transition-colors duration-200 hover:text-midnight ${focusRing}`}
        >
          {visible ? <EyeOff aria-hidden className="size-5" /> : <Eye aria-hidden className="size-5" />}
        </button>
      </div>
    </div>
  );
}
