import { Badge } from "@/components/ui/badge";
import { moduleStatusLabel } from "@/content/common";
import type { ModuleStatus } from "@/lib/modules/types";
import { cn } from "@/lib/utils";

const dotClass: Record<ModuleStatus, string> = {
  active: "bg-success",
  beta: "bg-warning",
  soon: "bg-muted-foreground",
};

export function ModuleStatusBadge({ status }: { status: ModuleStatus }) {
  return (
    <Badge variant="outline" className="gap-1.5 bg-background">
      <span aria-hidden="true" className={cn("size-1.5 rounded-full", dotClass[status])} />
      {moduleStatusLabel[status]}
    </Badge>
  );
}
