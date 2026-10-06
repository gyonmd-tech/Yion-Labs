import type { Metadata } from "next";
import { authCopy } from "@/content/auth";
import { AuthHeading } from "@/app/(auth)/_components/auth-heading";
import { ResetPasswordForm } from "@/app/(auth)/_components/reset-password-form";

export const metadata: Metadata = { title: authCopy.reset.metaTitle };

/** Dibuka dari tautan reset di email; proxy memastikan sesi pemulihan aktif. */
export default function ResetPasswordPage() {
  return (
    <>
      <AuthHeading title={authCopy.reset.title} description={authCopy.reset.description} />
      <ResetPasswordForm />
    </>
  );
}
