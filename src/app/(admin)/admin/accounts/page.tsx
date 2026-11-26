import { Suspense } from "react";
import { AccountSearch } from "@/components/admin/AccountSearch";
import { AdminOnly } from "@/components/admin/AdminOnly";
import { appTitle } from "@/lib/ui";
import { findAccounts, newestAccounts } from "../actions";

export const metadata = { title: "Accounts" };

async function Accounts() {
  const initial = await newestAccounts();
  return (
    <div className="flex flex-col gap-5">
      <h1 className={appTitle}>Accounts</h1>
      <AccountSearch initial={initial} find={findAccounts} />
    </div>
  );
}

export default function AdminAccounts() {
  return (
    <Suspense fallback={<div className="skeleton h-64 rounded-xl" />}>
      <AdminOnly next="/admin/accounts">
        <Accounts />
      </AdminOnly>
    </Suspense>
  );
}
