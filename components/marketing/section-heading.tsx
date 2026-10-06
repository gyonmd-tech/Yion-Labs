import { cn } from "@/lib/utils";

/** Label kecil huruf kecil di atas H2, sesuai pola section marketing. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  as: Heading = "h2",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex max-w-2xl flex-col gap-3",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      {eyebrow && <p className="text-sm font-semibold text-primary lowercase">{eyebrow}</p>}
      <Heading className={Heading === "h1" ? "type-h1" : "type-h2"}>{title}</Heading>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  );
}
