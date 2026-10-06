import type { Metadata } from "next";
import Link from "next/link";
import { authCopy } from "@/content/auth";
import { AuthHeading } from "@/app/(auth)/_components/auth-heading";
import { GoogleButton, OrDivider } from "@/app/(auth)/_components/google-button";
import { SignUpForm } from "@/app/(auth)/_components/sign-up-form";

export const metadata: Metadata = { title: authCopy.signUp.metaTitle };

export default function SignUpPage() {
  const copy = authCopy.signUp;
  return (
    <>
      <AuthHeading title={copy.title} description={copy.description} />
      <div className="flex flex-col gap-5">
        <GoogleButton />
        <OrDivider />
        <SignUpForm />
        <p className="text-sm text-muted-foreground">
          {copy.terms}{" "}
          <Link href="/syarat" className="text-primary hover:underline">
            {copy.termsLink}
          </Link>{" "}
          {copy.and}{" "}
          <Link href="/privasi" className="text-primary hover:underline">
            {copy.privacyLink}
          </Link>
          .
        </p>
        <p className="text-sm text-muted-foreground">
          {copy.switchText}{" "}
          <Link href="/masuk" className="font-medium text-primary hover:underline">
            {copy.switchLink}
          </Link>
        </p>
      </div>
    </>
  );
}
