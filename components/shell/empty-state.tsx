import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-card border border-dashed bg-bg-subtle px-6 py-12 text-center",
        className,
      )}
    >
      {icon && (
        <span className="flex size-12 items-center justify-center rounded-full bg-accent text-primary [&_svg]:size-6">
          {icon}
        </span>
      )}
      <h3 className="font-heading text-lg font-bold">{title}</h3>
      {description && <p className="max-w-md text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
