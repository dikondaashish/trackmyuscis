import { appPage } from "@/lib/ui";
import { SettingsNav } from "@/components/app/SettingsNav";

/** Settings: the section list on the left, the chosen section on the right. */
export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${appPage} max-w-5xl`}>
      <h1 className="enter text-h3 text-midnight">Settings</h1>
      <div className="mt-6 grid gap-4 lg:mt-8 lg:grid-cols-[13rem_minmax(0,1fr)] lg:items-start lg:gap-8">
        <SettingsNav />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
