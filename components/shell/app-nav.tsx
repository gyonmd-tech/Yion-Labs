"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid } from "lucide-react";
import { appCopy } from "@/content/app";
import type { ModuleIconName, ModuleSlug } from "@/lib/modules/types";
import { cn } from "@/lib/utils";
import { ModuleIcon } from "@/components/shell/module-icon";

export type NavModule = { slug: ModuleSlug; name: string; icon: ModuleIconName };

/**
 * Daftar navigasi aplikasi. `compact` = hanya ikon (lebar 768-1023 px).
 */
export function AppNav({
  modules,
  compact = false,
  onNavigate,
}: {
  modules: readonly NavModule[];
  compact?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const item = (active: boolean) =>
    cn(
      "flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
      compact && "justify-center px-0",
      active
        ? "bg-accent text-primary"
        : "text-muted-foreground hover:bg-bg-subtle hover:text-foreground",
    );

  return (
    <nav aria-label={appCopy.nav.main} className="flex flex-col gap-1">
      <Link
        href="/app"
        onClick={onNavigate}
        aria-current={pathname === "/app" ? "page" : undefined}
        aria-label={compact ? appCopy.portalLabel : undefined}
        title={compact ? appCopy.portalLabel : undefined}
        className={item(pathname === "/app")}
      >
        <LayoutGrid aria-hidden="true" className="size-5 shrink-0" />
        {!compact && appCopy.portalLabel}
      </Link>
      {!compact && (
        <p className="px-3 pt-4 pb-1 text-xs font-semibold text-muted-foreground uppercase">
          {appCopy.nav.modules}
        </p>
      )}
      {compact && <div className="my-2 border-t" />}
      {modules.map((m) => {
        const href = `/app/${m.slug}`;
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={m.slug}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            aria-label={compact ? m.name : undefined}
            title={compact ? m.name : undefined}
            className={item(active)}
          >
            <ModuleIcon name={m.icon} className="size-5 shrink-0" />
            {!compact && m.name}
          </Link>
        );
      })}
    </nav>
  );
}
