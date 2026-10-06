import { authCopy } from "@/content/auth";
import { signInWithGoogle } from "@/app/(auth)/actions";
import { SubmitButton } from "@/app/(auth)/_components/form-parts";

export function GoogleButton({ next }: { next?: string }) {
  return (
    <form action={signInWithGoogle}>
      {next && <input type="hidden" name="next" value={next} />}
      <SubmitButton variant="outline">{authCopy.google}</SubmitButton>
    </form>
  );
}

export function OrDivider() {
  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      <span className="h-px flex-1 bg-border" />
      {authCopy.or}
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
