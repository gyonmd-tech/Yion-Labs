import { Info } from "lucide-react";
import type { LegalDoc } from "@/content/legal";
import { PageHeader } from "@/components/marketing/page-header";

export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <PageHeader title={doc.title} />
      <section className="section-y">
        <div className="container-page">
          <div className="flex max-w-3xl flex-col gap-8">
            <p
              role="note"
              className="flex items-start gap-3 rounded-card border border-warning/40 bg-warning/10 p-4 text-sm"
            >
              <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              {doc.draftNotice}
            </p>
            {doc.sections.map((s, i) => (
              <div key={s.heading} className="flex flex-col gap-2">
                <h2 className="type-h3">
                  {i + 1}. {s.heading}
                </h2>
                <p className="text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
