"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2, FileText, RotateCcw } from "lucide-react";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/shell/copy-button";
import { EmptyState } from "@/components/shell/empty-state";
import { Workspace, type WorkspaceTab } from "@/components/shell/workspace";
import { cn } from "@/lib/utils";
import { prdCopy as copy } from "@/modules/prd/copy";
import { prdToMarkdown } from "@/modules/prd/format";
import { PRD_IDEA_MAX, PRD_IDEA_MIN, prdOutputSchema, type PrdOutput } from "@/modules/prd/schema";
import { PrdDocument } from "@/modules/prd/ui/prd-document";
import { PrdSkeleton } from "@/modules/prd/ui/prd-skeleton";

const responseSchema = z.discriminatedUnion("ok", [
  z.object({
    ok: z.literal(true),
    generation: z.object({ id: z.string(), output: prdOutputSchema }),
    remainingToday: z.number().int().nullable(),
  }),
  z.object({
    ok: z.literal(false),
    code: z.string(),
    message: z.string(),
    remainingToday: z.number().int().optional(),
  }),
]);

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "done"; id: string; prd: PrdOutput };

export function PrdWorkspace({
  header,
  dailyLimit,
  initialRemaining,
}: {
  header: React.ReactNode;
  dailyLimit: number;
  initialRemaining: number;
}) {
  const router = useRouter();
  const [idea, setIdea] = useState("");
  const [touched, setTouched] = useState(false);
  const [remaining, setRemaining] = useState(initialRemaining);
  const [state, setState] = useState<State>({ status: "idle" });
  const [tab, setTab] = useState<WorkspaceTab>("input");

  const length = idea.trim().length;
  const inputError =
    length > PRD_IDEA_MAX
      ? copy.form.tooLong
      : touched && length < PRD_IDEA_MIN
        ? copy.form.tooShort
        : null;
  const exhausted = remaining <= 0;
  const loading = state.status === "loading";

  async function submit() {
    setTouched(true);
    if (length < PRD_IDEA_MIN || length > PRD_IDEA_MAX || exhausted || loading) return;
    setState({ status: "loading" });
    setTab("result");
    try {
      const res = await fetch("/api/ai/prd", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ idea }),
      });
      const parsed = responseSchema.safeParse(await res.json());
      if (!parsed.success) throw new Error("bad response");
      const body = parsed.data;
      if (!body.ok) {
        if (typeof body.remainingToday === "number") setRemaining(body.remainingToday);
        if (body.code === "unauthorized") router.refresh();
        setState({ status: "error", message: body.message });
        return;
      }
      if (body.remainingToday !== null) setRemaining(body.remainingToday);
      setState({ status: "done", id: body.generation.id, prd: body.generation.output });
      // Segarkan data server (baris "Lanjutkan" di portal, Library).
      router.refresh();
    } catch {
      setState({ status: "error", message: copy.error.network });
    }
  }

  const input = (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
      noValidate
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="prd-idea">{copy.form.label}</Label>
        <Textarea
          id="prd-idea"
          name="idea"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          onBlur={() => length > 0 && setTouched(true)}
          placeholder={copy.form.placeholder}
          rows={8}
          maxLength={PRD_IDEA_MAX + 200}
          aria-invalid={inputError ? true : undefined}
          aria-describedby="prd-idea-help"
          className="min-h-40"
          disabled={loading}
        />
        <div id="prd-idea-help" className="flex items-start justify-between gap-3 text-sm">
          <p className={cn(inputError ? "text-danger" : "text-muted-foreground")}>
            {inputError ?? copy.form.hint}
          </p>
          <span
            className={cn(
              "shrink-0 tabular-nums",
              length > PRD_IDEA_MAX ? "text-danger" : "text-muted-foreground",
            )}
          >
            {copy.form.counter(length)}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Badge variant="accent">{copy.form.cost}</Badge>
        <span className="text-muted-foreground">{copy.form.remaining(remaining, dailyLimit)}</span>
      </div>

      {exhausted && (
        <p role="status" className="rounded-md border border-warning/40 bg-warning/10 p-3 text-sm">
          {copy.form.exhausted}
        </p>
      )}

      <Button type="submit" size="lg" disabled={loading || exhausted} aria-busy={loading}>
        {loading ? copy.form.submitting : copy.form.submit}
      </Button>
    </form>
  );

  let result: React.ReactNode;
  if (state.status === "loading") {
    result = <PrdSkeleton />;
  } else if (state.status === "error") {
    result = (
      <EmptyState
        className="border-danger/30 bg-danger/5"
        icon={<AlertTriangle aria-hidden="true" />}
        title={copy.error.title}
        description={<span role="alert">{state.message}</span>}
        action={
          !exhausted && (
            <Button type="button" variant="outline" onClick={() => void submit()}>
              <RotateCcw aria-hidden="true" />
              {copy.error.retry}
            </Button>
          )
        }
      />
    );
  } else if (state.status === "done") {
    result = (
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CheckCircle2 aria-hidden="true" className="size-4 text-success" />
            {copy.result.saved}
          </p>
          <div className="flex flex-wrap gap-2">
            <CopyButton text={prdToMarkdown(state.prd)} label={copy.result.copy} />
            <Button asChild variant="ghost">
              <Link href={`/app/prd/${state.id}`}>{copy.result.open}</Link>
            </Button>
          </div>
        </div>
        <PrdDocument prd={state.prd} />
      </div>
    );
  } else {
    result = (
      <EmptyState
        icon={<FileText aria-hidden="true" />}
        title={copy.empty.title}
        description={copy.empty.body}
      />
    );
  }

  return <Workspace header={header} input={input} result={result} tab={tab} onTabChange={setTab} />;
}
