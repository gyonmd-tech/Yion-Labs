/** Hanya izinkan path relatif di situs ini sebagai tujuan setelah login. */
export function safeNextPath(value: FormDataEntryValue | string | null | undefined): string {
  if (typeof value !== "string") return "/app";
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return "/app";
  return value;
}
