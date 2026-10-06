import { Skeleton } from "@/components/ui/skeleton";
import { prdCopy } from "@/modules/prd/copy";

export function PrdSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col gap-4 rounded-card border bg-background p-5 md:p-6"
    >
      <div className="flex flex-col gap-1">
        <p className="font-medium">{prdCopy.loading.title}</p>
        <p className="text-sm text-muted-foreground">{prdCopy.loading.eta}</p>
      </div>
      <Skeleton className="h-7 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="mt-2 flex flex-col gap-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    </div>
  );
}
