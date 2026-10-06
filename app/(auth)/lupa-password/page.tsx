import type { Metadata } from "next";
import Link from "next/link";
import { authCopy } from "@/content/auth";
import { AuthHeading } from "@/app/(auth)/_components/auth-heading";
import { ForgotPasswordForm } from "@/app/(auth)/_components/forgot-password-form";

export const metadata: Metadata = { title: authCopy.forgot.metaTitle };

export default function ForgotPasswordPage() {
  return (
    <>
      <AuthHeading title={authCopy.forgot.title} description={authCopy.forgot.description} />
      <div className="flex flex-col gap-5">
        <ForgotPasswordForm />
        <Link
          href="/masuk"
          className="inline-flex min-h-11 items-center text-sm text-primary hover:underline"
        >
          {authCopy.forgot.back}
        </Link>
      </div>
    </>
  );
}
