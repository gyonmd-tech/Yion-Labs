import { SectionHeading } from "@/components/marketing/section-heading";

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
}) {
  return (
    <section className="border-b bg-bg-subtle">
      <div className="container-page py-14 md:py-20">
        <SectionHeading as="h1" eyebrow={eyebrow} title={title} description={description} />
      </div>
    </section>
  );
}
