"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coins, Library, LayoutGrid, type LucideIcon } from "lucide-react";
import { appCopy } from "@/content/app";
import type { ModuleIconName, ModuleSlug } from "@/lib/modules/types";
import { cn } from "@/lib/utils";
import { ModuleIcon } from "@/components/shell/module-icon";

const fixedItems: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/app", label: appCopy.portalLabel, icon: LayoutGrid },
  { href: "/app/library", label: appCopy.nav.library, icon: Library },
  { href: "/app/kredit", label: appCopy.nav.credits, icon: Coins },
];

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
      {fixedItems.map(({ href, label, icon: Icon }) => {
        const active = href === "/app" ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            aria-label={compact ? label : undefined}
            title={compact ? label : undefined}
            className={item(active)}
          >
            <Icon aria-hidden="true" className="size-5 shrink-0" />
            {!compact && label}
          </Link>
        );
      })}
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
