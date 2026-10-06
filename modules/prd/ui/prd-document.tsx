import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { prdCopy } from "@/modules/prd/copy";
import type { PrdOutput } from "@/modules/prd/schema";

const priorityClass = {
  wajib: "border-primary/30 bg-accent text-primary",
  sebaiknya: "border-border bg-background text-foreground",
  nanti: "border-border bg-bg-subtle text-muted-foreground",
} as const;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="font-heading text-base font-bold">{title}</h3>
      {children}
    </section>
  );
}

function Bullets({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-foreground/90">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

/** Dokumen PRD. Semua isi dirender sebagai teks biasa. */
export function PrdDocument({ prd, className }: { prd: PrdOutput; className?: string }) {
  const s = prdCopy.sections;
  return (
    <article
      className={cn("flex flex-col gap-6 rounded-card border bg-background p-5 md:p-6", className)}
    >
      <header className="flex flex-col gap-2 border-b pb-5">
        <h2 className="type-h3 break-words">{prd.productName}</h2>
        <p className="text-muted-foreground">{prd.oneLiner}</p>
      </header>

      <Section title={s.problem}>
        <p className="text-sm text-foreground/90">{prd.problem}</p>
      </Section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title={s.targetUsers}>
          <Bullets items={prd.targetUsers} />
        </Section>
        <Section title={s.goals}>
          <Bullets items={prd.goals} />
        </Section>
      </div>

      <Section title={s.features}>
        <ul className="flex flex-col divide-y rounded-lg border">
          {prd.features.map((f, i) => (
            <li key={i} className="flex flex-col gap-1 p-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{f.name}</span>
                <Badge variant="outline" className={priorityClass[f.priority]}>
                  {prdCopy.priority[f.priority]}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={s.mvp}>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-success/30 bg-success/5 p-3">
            <p className="mb-1.5 text-sm font-semibold">{s.mvpInclude}</p>
            <Bullets items={prd.mvpScope.include} />
          </div>
          <div className="rounded-lg border bg-bg-subtle p-3">
            <p className="mb-1.5 text-sm font-semibold">{s.mvpExclude}</p>
            <Bullets items={prd.mvpScope.exclude} />
          </div>
        </div>
      </Section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title={s.successMetrics}>
          <Bullets items={prd.successMetrics} />
        </Section>
        <Section title={s.risks}>
          <Bullets items={prd.risks} />
        </Section>
      </div>
    </article>
  );
}
