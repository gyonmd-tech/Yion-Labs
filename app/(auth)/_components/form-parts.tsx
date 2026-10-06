"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AuthFormState } from "@/app/(auth)/actions";
import { cn } from "@/lib/utils";

export function Field({
  name,
  label,
  type = "text",
  autoComplete,
  hint,
  error,
  defaultValue,
}: {
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  hint?: string;
  error?: string;
  defaultValue?: string;
}) {
  const describedBy = error ? `${name}-error` : hint ? `${name}-hint` : undefined;
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required
        defaultValue={defaultValue}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
      />
      {error ? (
        <p id={`${name}-error`} className="text-sm text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${name}-hint`} className="text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function SubmitButton({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant?: "outline";
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant={variant}
      className="w-full"
      disabled={pending}
      aria-busy={pending}
    >
      {pending && <Loader2 aria-hidden="true" className="animate-spin" />}
      {children}
    </Button>
  );
}

export function FormMessage({ state }: { state: AuthFormState }) {
  if (!state.message) return null;
  return (
    <p
      role={state.status === "error" ? "alert" : "status"}
      className={cn(
        "rounded-md border p-3 text-sm",
        state.status === "error"
          ? "border-danger/30 bg-danger/5 text-danger"
          : "border-success/30 bg-success/5 text-foreground",
      )}
    >
      {state.message}
    </p>
  );
}
