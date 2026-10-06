"use client";

import { useActionState } from "react";
import { authCopy } from "@/content/auth";
import { signUp, type AuthFormState } from "@/app/(auth)/actions";
import { Field, FormMessage, SubmitButton } from "@/app/(auth)/_components/form-parts";

const initial: AuthFormState = { status: "idle" };

export function SignUpForm() {
  const [state, action] = useActionState(signUp, initial);
  if (state.status === "success") return <FormMessage state={state} />;
  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <FormMessage state={state} />
      <Field
        name="name"
        label={authCopy.fields.name}
        autoComplete="name"
        error={state.fieldErrors?.name}
        defaultValue={state.values?.name}
      />
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
        autoComplete="new-password"
        hint={authCopy.fields.passwordHint}
        error={state.fieldErrors?.password}
      />
      <SubmitButton>{authCopy.signUp.submit}</SubmitButton>
    </form>
  );
}
