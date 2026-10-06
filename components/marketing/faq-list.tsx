import { ChevronDown } from "lucide-react";

export function FaqList({ items }: { items: readonly { q: string; a: string }[] }) {
  return (
    <div className="divide-y rounded-card border bg-background">
      {items.map((item) => (
        <details key={item.q} className="group">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium [&::-webkit-details-marker]:hidden">
            {item.q}
            <ChevronDown
              aria-hidden="true"
              className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
            />
          </summary>
          <p className="px-5 pb-5 text-muted-foreground">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
