import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { getMyGeneration } from "@/lib/generations/repository";
import { formatDateTime } from "@/content/common";
import { CopyButton } from "@/components/shell/copy-button";
import { EmptyState } from "@/components/shell/empty-state";
import { prdCopy as copy } from "@/modules/prd/copy";
import { prdToMarkdown } from "@/modules/prd/format";
import { manifest } from "@/modules/prd/manifest";
import { prdOutputSchema } from "@/modules/prd/schema";
import { PrdDocument } from "@/modules/prd/ui/prd-document";

export async function generateMetadata(props: PageProps<"/app/prd/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const generation = await getMyGeneration(id);
  return { title: generation?.title || manifest.name };
}

export default async function PrdDetailPage(props: PageProps<"/app/prd/[id]">) {
  const { id } = await props.params;
  const generation = await getMyGeneration(id);
  if (!generation || generation.module !== manifest.slug) notFound();
  const prd = prdOutputSchema.safeParse(generation.output);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-4 py-6 md:px-6 md:py-8">
      <Link
        href="/app/prd"
        className="inline-flex min-h-11 items-center gap-1.5 self-start text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        {copy.detail.back}
      </Link>

      {generation.status === "done" && prd.success ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">{formatDateTime(generation.created_at)}</p>
            <CopyButton text={prdToMarkdown(prd.data)} label={copy.result.copy} />
          </div>
          <PrdDocument prd={prd.data} />
        </>
      ) : (
        <EmptyState
          icon={<AlertTriangle aria-hidden="true" />}
          title={copy.detail.failedTitle}
          description={copy.detail.failedBody}
        />
      )}
    </div>
  );
}
