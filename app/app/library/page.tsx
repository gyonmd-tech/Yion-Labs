import type { Metadata } from "next";
import Link from "next/link";
import { Library } from "lucide-react";
import { getModule, modules } from "@/config/modules";
import { appCopy } from "@/content/app";
import { listMyGenerations } from "@/lib/generations/repository";
import type { ModuleSlug } from "@/lib/modules/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shell/empty-state";
import { GenerationList } from "@/components/shell/generation-list";

export const metadata: Metadata = { title: appCopy.library.metaTitle };

export default async function LibraryPage(props: PageProps<"/app/library">) {
  const copy = appCopy.library;
  const { modul } = await props.searchParams;
  const filter = typeof modul === "string" ? getModule(modul)?.slug : undefined;
  const items = await listMyGenerations({
    module: filter as ModuleSlug | undefined,
    status: "done",
    limit: 100,
  });

  const chip = (active: boolean) =>
    cn(
      "inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-medium whitespace-nowrap transition-colors",
      active
        ? "border-primary bg-accent text-primary"
        : "bg-background text-muted-foreground hover:text-foreground",
    );

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 md:px-6 md:py-10">
      <div className="flex flex-col gap-1">
        <h1 className="type-h3">{copy.title}</h1>
        <p className="text-muted-foreground">{copy.description}</p>
      </div>

      <nav aria-label={copy.filterLabel} className="-mx-4 overflow-x-auto px-4">
        <ul className="flex gap-2">
          <li>
            <Link
              href="/app/library"
              className={chip(!filter)}
              aria-current={!filter ? "page" : undefined}
            >
              {copy.all}
            </Link>
          </li>
          {modules.map((m) => (
            <li key={m.slug}>
              <Link
                href={`/app/library?modul=${m.slug}`}
                className={chip(filter === m.slug)}
                aria-current={filter === m.slug ? "page" : undefined}
              >
                {m.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {items.length > 0 ? (
        <GenerationList items={items} deletable />
      ) : (
        <EmptyState
          icon={<Library aria-hidden="true" />}
          title={copy.emptyTitle}
          description={filter ? copy.emptyFilteredBody : copy.emptyBody}
          action={
            <Button asChild variant="outline">
              <Link href="/app/prd">{copy.emptyCta}</Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
