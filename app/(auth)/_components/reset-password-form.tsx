"use client";

import { useActionState } from "react";
import { authCopy } from "@/content/auth";
import { updatePassword, type AuthFormState } from "@/app/(auth)/actions";
import { Field, FormMessage, SubmitButton } from "@/app/(auth)/_components/form-parts";

const initial: AuthFormState = { status: "idle" };

export function ResetPasswordForm() {
  const [state, action] = useActionState(updatePassword, initial);
  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <FormMessage state={state} />
      <Field
        name="password"
        type="password"
        label={authCopy.fields.newPassword}
        autoComplete="new-password"
        hint={authCopy.fields.passwordHint}
        error={state.fieldErrors?.password}
      />
      <SubmitButton>{authCopy.reset.submit}</SubmitButton>
    </form>
  );
}
