import type { Metadata } from "next";
import Link from "next/link";
import { signOut } from "@/app/account/actions";
import { AuthTitle } from "@/components/auth/AuthParts";
import { authButton } from "@/components/auth/authButton";

export const metadata: Metadata = { title: "No access", robots: { index: false } };

export default function NoAccessPage() {
  return (
    <>
      <AuthTitle title="Admins" serif="only.">You are signed in, but this account cannot open the control panel. Your own account page is still yours.</AuthTitle>
      <div className="mt-9 flex flex-col gap-3">
        <Link href="/account" className={authButton}>Go to your account</Link>
        <form action={signOut}>
          <button type="submit" className="h-[52px] w-full rounded-[14px] text-[15px] font-semibold text-slate ring-1 ring-line ring-inset hover:text-ink hover:ring-ink">Sign out</button>
        </form>
      </div>
    </>
  );
}
