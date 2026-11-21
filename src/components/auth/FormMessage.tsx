import { CircleAlert, CircleCheck } from "lucide-react";

/** One line of feedback above or below a form: red for problems, teal for success. Announced to screen readers. */
export function FormMessage({ tone, children, id }: { tone: "error" | "success"; children: React.ReactNode; id?: string }) {
  const Icon = tone === "error" ? CircleAlert : CircleCheck;
  return (
    <p
      id={id}
      role={tone === "error" ? "alert" : "status"}
      className={`flex items-start gap-2 rounded-[10px] px-4 py-3 text-small ${
        tone === "error" ? "bg-red/10 text-red" : "bg-teal/10 text-teal"
      }`}
    >
      <Icon aria-hidden className="mt-0.5 size-4 shrink-0" />
      <span>{children}</span>
    </p>
  );
}
