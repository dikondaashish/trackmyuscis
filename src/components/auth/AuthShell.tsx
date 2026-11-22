import { card } from "@/lib/ui";

/**
 * The form column on every account page (sign in, sign up, reset): the h1 and one line,
 * then the white card, then an optional line under it. The (auth) layout centres it.
 */
export function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-[28rem]">
      <div className="enter">
        <h1 className="text-h2 text-midnight">{title}</h1>
        {description && <p className="mt-3 text-body text-slate">{description}</p>}
      </div>
      <div className={`${card} mt-8 p-6 sm:p-8`}>{children}</div>
      {footer && <div className="mt-6 text-center text-small text-slate">{footer}</div>}
    </div>
  );
}
