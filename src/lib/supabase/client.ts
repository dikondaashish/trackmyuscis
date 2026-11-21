import { createBrowserClient } from "@supabase/ssr";

/** Supabase in the browser. Sessions live in cookies so the server sees the same login. */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
