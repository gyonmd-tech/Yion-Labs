import { Coins } from "lucide-react";
import { appCopy } from "@/content/app";
import { formatCredits } from "@/content/common";
import { cn } from "@/lib/utils";

/** Saldo kredit di topbar dan portal. `null` = sistem kredit belum aktif. */
export function CreditPill({ balance, className }: { balance: number | null; className?: string }) {
  const text = balance === null ? appCopy.credit.unavailable : formatCredits(balance);
  return (
    <span
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-full bg-accent px-3 text-sm font-semibold whitespace-nowrap text-primary",
        className,
      )}
      title={balance === null ? appCopy.credit.unavailableHint : undefined}
    >
      <Coins aria-hidden="true" className="size-4" />
      <span className="sr-only">{appCopy.credit.label}: </span>
      {text}
    </span>
  );
}
