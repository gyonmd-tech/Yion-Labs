import type { Metadata } from "next";
import Link from "next/link";
import { authCopy } from "@/content/auth";
import { safeNextPath } from "@/lib/safe-next-path";
import { AuthHeading } from "@/app/(auth)/_components/auth-heading";
import { FormMessage } from "@/app/(auth)/_components/form-parts";
import { GoogleButton, OrDivider } from "@/app/(auth)/_components/google-button";
import { SignInForm } from "@/app/(auth)/_components/sign-in-form";

export const metadata: Metadata = { title: authCopy.signIn.metaTitle };

const errorMessages: Record<string, string> = {
  callback: authCopy.errors.callback,
  oauth: authCopy.errors.oauth,
};

export default async function SignInPage(props: PageProps<"/masuk">) {
  const params = await props.searchParams;
  const next = typeof params.next === "string" ? safeNextPath(params.next) : undefined;
  const errorKey = typeof params.error === "string" ? params.error : undefined;
  const errorMessage = errorKey ? errorMessages[errorKey] : undefined;

  return (
    <>
      <AuthHeading title={authCopy.signIn.title} description={authCopy.signIn.description} />
      <div className="flex flex-col gap-5">
        {errorMessage && <FormMessage state={{ status: "error", message: errorMessage }} />}
        <GoogleButton next={next} />
        <OrDivider />
        <SignInForm next={next} />
        <Link
          href="/lupa-password"
          className="inline-flex min-h-11 items-center text-sm text-primary hover:underline"
        >
          {authCopy.signIn.forgot}
        </Link>
        <p className="text-sm text-muted-foreground">
          {authCopy.signIn.switchText}{" "}
          <Link href="/daftar" className="font-medium text-primary hover:underline">
            {authCopy.signIn.switchLink}
          </Link>
        </p>
      </div>
    </>
  );
}
