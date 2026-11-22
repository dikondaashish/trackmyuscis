import { card } from "@/lib/ui";

/**
 * The form column on every account page (sign in, sign up, reset): a compact h1, one line
 * under it (usually the link to the other account page), then the white card. Sized so the
 * whole page fits one screen without scrolling.
 */
export function AuthShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-[28rem]">
      <div className="enter">
        <h1 className="text-h3 text-midnight">{title}</h1>
        {description && <p className="mt-1 text-body text-slate">{description}</p>}
      </div>
      <div className={`${card} mt-5 p-5 sm:p-6`}>{children}</div>
    </div>
  );
}
