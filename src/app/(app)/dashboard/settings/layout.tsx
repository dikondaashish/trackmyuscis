import { appPage, appTitle } from "@/lib/ui";
import { SettingsNav } from "@/components/app/SettingsNav";

/** Settings: the section list on the left, the chosen section on the right. */
export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={appPage}>
      <div className="enter">
        <h1 className={appTitle}>Settings</h1>
        <p className="mt-0.5 text-small text-slate">Your profiles, plan and sign-in.</p>
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-[12.5rem_minmax(0,1fr)] lg:items-start lg:gap-6">
        <SettingsNav />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
