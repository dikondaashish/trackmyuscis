import { adminGate } from "@/lib/admin";
import { AdminMfa } from "@/components/admin/AdminMfa";

/**
 * Wrap every admin page's content in this, inside <Suspense>. Non-admins get a 404 and
 * signed-out visitors go to sign in; admins without the second step see it first. The
 * children (and their database reads) only render for a fully signed-in admin.
 */
export async function AdminOnly({ next, children }: { next: string; children: React.ReactNode }) {
  const gate = await adminGate(next);
  if (gate.state !== "ok") return <AdminMfa mode={gate.state === "mfa-setup" ? "setup" : "code"} email={gate.email} />;
  return <>{children}</>;
}
