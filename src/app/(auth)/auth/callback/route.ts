import { NextResponse, type NextRequest } from "next/server";
import { safeNext } from "@/lib/account";
import { createClient } from "@/lib/supabase/server";

/** Finishes email links (sign-up confirmation, password reset) by exchanging the one-time code for a session. */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }
  // Password resets need a fresh link. Sign-up links were already confirmed by Supabase before
  // redirecting here, even when this browser cannot open a session (sign-up began in the extension).
  if (next.startsWith("/update-password")) return NextResponse.redirect(`${origin}/reset-password?expired=1`);
  return NextResponse.redirect(`${origin}/login?confirmed=1&next=${encodeURIComponent(next)}`);
}
