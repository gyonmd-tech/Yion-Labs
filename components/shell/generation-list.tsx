import Link from "next/link";
import { getModule } from "@/config/modules";
import { appCopy } from "@/content/app";
import { formatDateTime } from "@/content/common";
import type { GenerationListItem } from "@/lib/generations/repository";
import { generationHref } from "@/lib/generations/links";
import { DeleteGenerationButton } from "@/components/shell/delete-generation-button";
import { ModuleIcon } from "@/components/shell/module-icon";

/** Daftar hasil. `deletable` menampilkan tombol hapus (Library). */
export function GenerationList({
  items,
  deletable = false,
}: {
  items: GenerationListItem[];
  deletable?: boolean;
}) {
  return (
    <ul className="flex flex-col divide-y rounded-card border bg-background">
      {items.map((g) => {
        const m = getModule(g.module);
        const title = g.title || appCopy.library.untitled;
        return (
          <li key={g.id} className="flex items-center gap-3 p-3 md:p-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-accent text-primary">
              {m && <ModuleIcon name={m.icon} className="size-5" />}
            </span>
            <Link
              href={generationHref(g.module, g.id)}
              className="group flex min-w-0 flex-1 flex-col"
            >
              <span className="truncate font-medium group-hover:text-primary">{title}</span>
              <span className="truncate text-sm text-muted-foreground">
                {m?.name} · {formatDateTime(g.created_at)}
              </span>
            </Link>
            {deletable && <DeleteGenerationButton id={g.id} title={title} />}
          </li>
        );
      })}
    </ul>
  );
}
