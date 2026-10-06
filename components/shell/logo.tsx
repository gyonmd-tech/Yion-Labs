import Link from "next/link";
import { brand } from "@/config/brand";
import { cn } from "@/lib/utils";

export function Logo({
  href = "/",
  label,
  className,
}: {
  href?: string;
  label: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 font-heading text-lg font-extrabold",
        className,
      )}
    >
      <span aria-hidden="true" className="size-6 rounded-md bg-primary" />
      <span>{brand.name}</span>
    </Link>
  );
}
