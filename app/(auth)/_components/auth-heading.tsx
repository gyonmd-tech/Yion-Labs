export function AuthHeading({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6 flex flex-col gap-1.5">
      <h1 className="type-h3">{title}</h1>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}
