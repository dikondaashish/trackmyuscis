import { ChevronDown } from "lucide-react";
import { appField, appFieldLabel, field, fieldLabel } from "@/lib/ui";

export function SelectField({
  id,
  name,
  label,
  options,
  defaultValue,
  compact = false,
}: {
  id: string;
  name: string;
  label: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
  /** The app's denser size (36px). */
  compact?: boolean;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className={compact ? appFieldLabel : fieldLabel}>
        {label}
      </label>
      <div className={`relative ${compact ? "mt-1.5" : "mt-2"}`}>
        <select
          id={id}
          name={name}
          defaultValue={defaultValue ?? ""}
          className={`${compact ? appField : field} cursor-pointer appearance-none ${compact ? "pr-9" : "pr-11"}`}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden className={`pointer-events-none absolute top-1/2 ${compact ? "right-3" : "right-4"} size-4 -translate-y-1/2 text-slate`} />
      </div>
    </div>
  );
}
