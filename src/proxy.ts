import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { publicSupabase } from "@/lib/env";

/**
 * Keeps the Supabase session cookie fresh for the account, the admin panel and auth pages.
 * Authorization itself happens in `requireAdmin()` on every page and action.
 */
export async function proxy(request: NextRequest) {
  const supabase = publicSupabase();
  let response = NextResponse.next({ request });
  if (!supabase) return response;

  const client = createServerClient(supabase.url, supabase.key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
      },
    },
  });

  const { data } = await client.auth.getClaims();
  const { pathname } = request.nextUrl;
  if (!data?.claims && (pathname.startsWith("/admin") || pathname.startsWith("/account"))) {
    const login = request.nextUrl.clone();
    login.pathname = "/login";
    login.search = `?next=${encodeURIComponent(request.nextUrl.pathname)}`;
    return NextResponse.redirect(login);
  }
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/login", "/signup", "/auth/:path*", "/update-password"],
};
