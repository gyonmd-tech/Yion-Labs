import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatModuleCost } from "@/content/common";
import type { ModuleManifest } from "@/lib/modules/types";
import { cn } from "@/lib/utils";
import { ModuleIcon } from "@/components/shell/module-icon";
import { ModuleStatusBadge } from "@/components/shell/module-status-badge";

type ModuleCardProps = {
  module: ModuleManifest;
  /** Tanpa href (atau disabled) kartu dirender sebagai elemen yang tidak bisa diklik. */
  href?: string;
  disabled?: boolean;
  /** Nomor urut opsional, mis. "01", untuk grid marketing. */
  index?: string;
  className?: string;
};

export function ModuleCard({ module, href, disabled = false, index, className }: ModuleCardProps) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-11 items-center justify-center rounded-md bg-accent text-primary">
          <ModuleIcon name={module.icon} className="size-5" />
        </span>
        {index ? (
          <span className="font-heading text-sm font-bold text-primary">{index}</span>
        ) : (
          <ModuleStatusBadge status={module.status} />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5">
        <h3 className="font-heading text-lg font-bold">{module.name}</h3>
        <p className="text-sm text-muted-foreground">{module.tagline}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="accent">{formatModuleCost(module.cost)}</Badge>
        {index && <ModuleStatusBadge status={module.status} />}
      </div>
    </>
  );

  const base = "flex h-full flex-col gap-4 rounded-card border bg-card p-5 text-card-foreground";

  if (!href || disabled) {
    return (
      <div
        aria-disabled={disabled || undefined}
        className={cn(base, disabled && "opacity-70", className)}
      >
        {body}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        base,
        "transition-shadow hover:shadow-lg hover:shadow-primary/5 focus-visible:shadow-lg",
        className,
      )}
    >
      {body}
    </Link>
  );
}
