"use client";

import { useActionState } from "react";
import { authCopy } from "@/content/auth";
import { signIn, type AuthFormState } from "@/app/(auth)/actions";
import { Field, FormMessage, SubmitButton } from "@/app/(auth)/_components/form-parts";

const initial: AuthFormState = { status: "idle" };

export function SignInForm({ next }: { next?: string }) {
  const [state, action] = useActionState(signIn, initial);
  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      {next && <input type="hidden" name="next" value={next} />}
      <FormMessage state={state} />
      <Field
        name="email"
        type="email"
        label={authCopy.fields.email}
        autoComplete="email"
        error={state.fieldErrors?.email}
        defaultValue={state.values?.email}
      />
      <Field
        name="password"
        type="password"
        label={authCopy.fields.password}
        autoComplete="current-password"
        error={state.fieldErrors?.password}
      />
      <SubmitButton>{authCopy.signIn.submit}</SubmitButton>
    </form>
  );
}
