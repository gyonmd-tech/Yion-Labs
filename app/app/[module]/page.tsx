import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Inbox } from "lucide-react";
import { getModule } from "@/config/modules";
import { appCopy } from "@/content/app";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shell/empty-state";
import { ModuleHeader } from "@/components/shell/module-header";
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

  // Modul yang belum dibangun memakai kerangka kosong ini. Modul aktif punya rute sendiri (mis. /app/prd).
  return (
    <Workspace
      header={<ModuleHeader module={m} />}
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
