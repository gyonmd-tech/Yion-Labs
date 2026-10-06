import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Inbox } from "lucide-react";
import { getModule } from "@/config/modules";
import { appCopy } from "@/content/app";
import { formatModuleCost } from "@/content/common";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shell/empty-state";
import { ModuleIcon } from "@/components/shell/module-icon";
import { ModuleStatusBadge } from "@/components/shell/module-status-badge";
import { Workspace } from "@/components/shell/workspace";

export async function generateMetadata(props: PageProps<"/app/[module]">): Promise<Metadata> {
  const { module: slug } = await props.params;
  const m = getModule(slug);
  return m ? { title: m.name } : {};
}

export default async function ModuleWorkspacePage(props: PageProps<"/app/[module]">) {
  const { module: slug } = await props.params;
  const m = getModule(slug);
  if (!m) notFound();
  const w = appCopy.workspace;

  // Fase 0: semua modul berstatus Segera; panel diisi saat modul dibangun.
  return (
    <Workspace
      header={
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-accent text-primary">
            <ModuleIcon name={m.icon} className="size-5" />
          </span>
          <div className="flex min-w-0 flex-col gap-1.5">
            <h1 className="type-h3">{m.name}</h1>
            <p className="text-sm text-muted-foreground">{m.tagline}</p>
            <div className="flex flex-wrap gap-2">
              <ModuleStatusBadge status={m.status} />
              <Badge variant="accent">{formatModuleCost(m.cost)}</Badge>
            </div>
          </div>
        </div>
      }
      input={
        <EmptyState
          icon={<Clock aria-hidden="true" />}
          title={w.soonTitle}
          description={w.soonBody}
          action={
            <Button asChild variant="outline">
              <Link href="/app">{w.backToPortal}</Link>
            </Button>
          }
        />
      }
      result={
        <EmptyState
          icon={<Inbox aria-hidden="true" />}
          title={w.resultEmptyTitle}
          description={w.resultEmptyBody}
        />
      }
    />
  );
}
