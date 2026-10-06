"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { appCopy } from "@/content/app";
import type { NavModule } from "@/components/shell/app-nav";

export function AppBreadcrumb({ modules }: { modules: readonly NavModule[] }) {
  const pathname = usePathname();
  const slug = pathname.split("/")[2];
  const current = modules.find((m) => m.slug === slug);

  return (
    <nav aria-label={appCopy.nav.breadcrumb} className="min-w-0">
      <ol className="flex items-center gap-1.5 text-sm">
        <li className={current ? "hidden sm:block" : undefined}>
          {current ? (
            <Link href="/app" className="text-muted-foreground hover:text-foreground">
              {appCopy.portalLabel}
            </Link>
          ) : (
            <span aria-current="page" className="font-medium">
              {appCopy.portalLabel}
            </span>
          )}
        </li>
        {current && (
          <>
            <li aria-hidden="true" className="hidden text-muted-foreground sm:block">
              <ChevronRight className="size-4" />
            </li>
            <li className="truncate font-medium" aria-current="page">
              {current.name}
            </li>
          </>
        )}
      </ol>
    </nav>
  );
}
