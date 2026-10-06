import Link from "next/link";
import { Coins } from "lucide-react";
import { appCopy } from "@/content/app";
import { formatCredits } from "@/content/common";
import { cn } from "@/lib/utils";

/** Saldo kredit di topbar dan portal. `null` = sistem kredit belum aktif. */
export function CreditPill({
  balance,
  href,
  className,
}: {
  balance: number | null;
  href?: string;
  className?: string;
}) {
  const text = balance === null ? appCopy.credit.unavailable : formatCredits(balance);
  const classes = cn(
    "inline-flex h-9 items-center gap-1.5 rounded-full bg-accent px-3 text-sm font-semibold whitespace-nowrap text-primary",
    href && "transition-colors hover:bg-primary/15",
    className,
  );
  const content = (
    <>
      <Coins aria-hidden="true" className="size-4" />
      <span className="sr-only">{appCopy.credit.label}: </span>
      {text}
    </>
  );
  const title = balance === null ? appCopy.credit.unavailableHint : undefined;
  return href ? (
    <Link href={href} className={classes} title={title}>
      {content}
    </Link>
  ) : (
    <span className={classes} title={title}>
      {content}
    </span>
  );
}
