import { h2, lead } from "@/lib/ui";

/** A section's heading and one short line under it. No eyebrows, no badges. */
export function SectionIntro({
  id,
  title,
  description,
  dark = false,
}: {
  id: string;
  title: string;
  description?: string;
  dark?: boolean;
}) {
  return (
    <div className="max-w-2xl">
      <h2 id={id} className={dark ? h2.replace("text-midnight", "text-white") : h2}>
        {title}
      </h2>
      {description && <p className={`mt-3 ${dark ? lead.replace("text-slate", "text-ice/80") : lead}`}>{description}</p>}
    </div>
  );
}
