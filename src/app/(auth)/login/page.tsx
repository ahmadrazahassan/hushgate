import type { Metadata } from "next";
import Link from "next/link";
import { AuthMessage, AuthTitle } from "@/components/auth/AuthParts";
import { safeNext } from "@/lib/account";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const notice = params.confirmed ? "Your email is confirmed. Sign in to open your account." : params.deleted ? "Your account has been deleted. Take care." : params.signedOut ? "You are signed out." : "";
  return (
    <>
      <AuthTitle title="Welcome" serif="back.">Sign in to manage your plan, devices and account. It is the same account you use in the extension.</AuthTitle>
      {notice && <div className="mt-6"><AuthMessage tone="info">{notice}</AuthMessage></div>}
      <LoginForm next={safeNext(params.next)} />
      <p className="mt-8 text-center text-[15px] text-slate">
        New to Hushgate?{" "}
        <Link href="/signup" className="font-semibold text-ink underline decoration-line underline-offset-4 hover:decoration-ink">Start your free trial</Link>
      </p>
    </>
  );
}
