import { ChevronDown } from "lucide-react";
import { field, fieldLabel } from "@/lib/ui";

export function SelectField({
  id,
  name,
  label,
  options,
  defaultValue,
}: {
  id: string;
  name: string;
  label: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className={fieldLabel}>
        {label}
      </label>
      <div className="relative mt-2">
        <select
          id={id}
          name={name}
          defaultValue={defaultValue ?? ""}
          className={`${field} cursor-pointer appearance-none pr-11`}
        >
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
