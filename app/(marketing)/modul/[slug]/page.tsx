import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { getModule, modules } from "@/config/modules";
import { moduleDetailCopy as copy } from "@/content/marketing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shell/empty-state";
import { ModuleIcon } from "@/components/shell/module-icon";
import { ModuleStatusBadge } from "@/components/shell/module-status-badge";
import { formatModuleCost } from "@/content/common";

export const dynamicParams = false;

export function generateStaticParams() {
  return modules.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata(props: PageProps<"/modul/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const m = getModule(slug);
  return m ? { title: m.name, description: m.tagline } : {};
}

function List({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div className="flex flex-col gap-3 rounded-card border bg-background p-6">
      <h2 className="font-heading text-lg font-bold">{title}</h2>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-muted-foreground">
            <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-primary" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function ModuleDetailPage(props: PageProps<"/modul/[slug]">) {
  const { slug } = await props.params;
  const m = getModule(slug);
  if (!m) notFound();
  const isSoon = m.status === "soon";

  return (
    <>
      <section className="border-b bg-bg-subtle">
        <div className="container-page flex flex-col items-start gap-5 py-12 md:py-20">
          <Link
            href="/modul"
            className="inline-flex min-h-11 items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            {copy.back}
          </Link>
          <span className="flex size-12 items-center justify-center rounded-md bg-accent text-primary">
            <ModuleIcon name={m.icon} className="size-6" />
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <ModuleStatusBadge status={m.status} />
            <Badge variant="accent">{formatModuleCost(m.cost)}</Badge>
          </div>
          <h1 className="type-h1">{m.name}</h1>
          <p className="max-w-2xl text-lg text-muted-foreground">{m.description}</p>
          <Button asChild size="lg">
            <Link href="/daftar">
              {isSoon ? copy.ctaSoon : copy.ctaActive}
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          {isSoon && <p className="text-sm text-muted-foreground">{copy.soonNote}</p>}
        </div>
      </section>

      <section className="section-y">
        <div className="container-page flex flex-col gap-12">
          <div className="grid gap-4 md:grid-cols-3">
            <List title={copy.inputsTitle} items={m.inputs} />
            <List title={copy.outputsTitle} items={m.outputs} />
            <List title={copy.costTitle} items={m.costDetails} />
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="type-h2">{copy.examplesTitle}</h2>
            <EmptyState
              icon={<ModuleIcon name={m.icon} />}
              title={copy.examplesTitle}
              description={copy.examplesPlaceholder}
            />
          </div>
        </div>
      </section>
    </>
  );
}
