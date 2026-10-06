/** URL detail satu hasil: /app/[module]/[id] (docs/architecture.md, peta rute). */
export function generationHref(module: string, id: string): string {
  return `/app/${module}/${id}`;
}
