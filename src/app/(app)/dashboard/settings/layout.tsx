import { appPage, appTitle } from "@/lib/ui";
import { SettingsNav } from "@/components/app/SettingsNav";

/** Settings: the section list on the left, the chosen section on the right. */
export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={appPage}>
      <h1 className={`enter ${appTitle}`}>Settings</h1>
      <div className="mt-5 grid gap-4 lg:grid-cols-[11rem_minmax(0,1fr)] lg:items-start lg:gap-6">
        <SettingsNav />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
