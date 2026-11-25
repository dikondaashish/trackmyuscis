import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { AFTER_SIGN_IN, PROTECTED_PATHS, SIGNED_OUT_ONLY } from "@/lib/auth";

/**
 * Keeps the Supabase session fresh and guards account pages.
 * Runs only on account routes (see matcher), so marketing pages stay static and fast.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  // getUser() checks the token with Supabase (getSession() alone can't be trusted on the server).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;
  const matches = (paths: string[]) => paths.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  const redirectKeepingCookies = (url: URL) => {
    const redirect = NextResponse.redirect(url);
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  };

  if (!user && matches(PROTECTED_PATHS)) {
    const signIn = new URL("/sign-in", request.url);
    signIn.searchParams.set("next", pathname + search);
    return redirectKeepingCookies(signIn);
  }

  if (user && matches(SIGNED_OUT_ONLY)) {
    return redirectKeepingCookies(new URL(AFTER_SIGN_IN, request.url));
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin", "/admin/:path*", "/sign-in", "/sign-up", "/forgot-password", "/auth/:path*"],
};
