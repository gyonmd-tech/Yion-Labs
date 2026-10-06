"use client";

import { useActionState } from "react";
import { authCopy } from "@/content/auth";
import { requestPasswordReset, type AuthFormState } from "@/app/(auth)/actions";
import { Field, FormMessage, SubmitButton } from "@/app/(auth)/_components/form-parts";

const initial: AuthFormState = { status: "idle" };

export function ForgotPasswordForm() {
  const [state, action] = useActionState(requestPasswordReset, initial);
  if (state.status === "success") return <FormMessage state={state} />;
  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <FormMessage state={state} />
      <Field
        name="email"
        type="email"
        label={authCopy.fields.email}
        autoComplete="email"
        error={state.fieldErrors?.email}
        defaultValue={state.values?.email}
      />
      <SubmitButton>{authCopy.forgot.submit}</SubmitButton>
    </form>
  );
}
