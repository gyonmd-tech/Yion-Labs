import { formatModuleCost } from "@/content/common";
import type { ModuleManifest } from "@/lib/modules/types";
import { Badge } from "@/components/ui/badge";
import { ModuleIcon } from "@/components/shell/module-icon";
import { ModuleStatusBadge } from "@/components/shell/module-status-badge";

export function ModuleHeader({ module: m }: { module: ModuleManifest }) {
  return (
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
  );
}
