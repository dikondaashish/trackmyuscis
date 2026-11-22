/** Re-mounts on every navigation, so each new page fades in (globals.css .page-in). */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-in">{children}</div>;
}
