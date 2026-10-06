import "server-only";
import { z } from "zod";
import type { ModuleSlug } from "@/lib/modules/types";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

/**
 * Penulisan `generations` hanya lewat service role (klien tidak boleh
 * memalsukan hasil). Pembacaan untuk pengguna memakai RLS.
 */

export const GENERATION_STATUSES = ["queued", "done", "failed"] as const;

export const generationRowSchema = z.object({
  id: z.string(),
  module: z.string(),
  title: z.string(),
  input: z.unknown(),
  output: z.unknown(),
  status: z.enum(GENERATION_STATUSES),
  cost_credits: z.number().int(),
  created_at: z.string(),
});

export type GenerationRow = z.infer<typeof generationRowSchema>;

export const generationListItemSchema = generationRowSchema.omit({ input: true, output: true });
export type GenerationListItem = z.infer<typeof generationListItemSchema>;

const COLUMNS = "id, module, title, input, output, status, cost_credits, created_at";
/** Untuk daftar: tanpa input/output agar ringan. */
const LIST_COLUMNS = "id, module, title, status, cost_credits, created_at";

export async function createQueuedGeneration(input: {
  userId: string;
  module: ModuleSlug;
  payload: unknown;
}): Promise<string> {
  const { data, error } = await createAdminClient()
    .from("generations")
    .insert({ user_id: input.userId, module: input.module, input: input.payload, status: "queued" })
    .select("id")
    .single();
  if (error) throw new Error("Gagal membuat baris generate.", { cause: error });
  return z.object({ id: z.string() }).parse(data).id;
}

export async function completeGeneration(input: {
  id: string;
  userId: string;
  title: string;
  output: unknown;
  costCredits: number;
}): Promise<GenerationRow> {
  const { data, error } = await createAdminClient()
    .from("generations")
    .update({
      status: "done",
      title: input.title,
      output: input.output,
      cost_credits: input.costCredits,
      error_code: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.id)
    .eq("user_id", input.userId)
    .select(COLUMNS)
    .single();
  if (error) throw new Error("Gagal menyimpan hasil.", { cause: error });
  return generationRowSchema.parse(data);
}

export async function failGeneration(input: { id: string; userId: string; code: string }) {
  const { error } = await createAdminClient()
    .from("generations")
    .update({ status: "failed", error_code: input.code, updated_at: new Date().toISOString() })
    .eq("id", input.id)
    .eq("user_id", input.userId);
  if (error) console.error("[generations] gagal menandai failed", input.id, error.message);
}

/** Hasil milik pengguna yang login (RLS). */
export async function listMyGenerations(options: {
  module?: ModuleSlug;
  limit?: number;
  status?: (typeof GENERATION_STATUSES)[number];
}): Promise<GenerationListItem[]> {
  const supabase = await createClient();
  let query = supabase
    .from("generations")
    .select(LIST_COLUMNS)
    .order("created_at", { ascending: false })
    .limit(options.limit ?? 50);
  if (options.module) query = query.eq("module", options.module);
  if (options.status) query = query.eq("status", options.status);
  const { data, error } = await query;
  if (error) throw new Error("Gagal membaca hasil.", { cause: error });
  return z.array(generationListItemSchema).parse(data);
}

export async function getMyGeneration(id: string): Promise<GenerationRow | null> {
  if (!z.uuid().safeParse(id).success) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("generations")
    .select(COLUMNS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error("Gagal membaca hasil.", { cause: error });
  return data ? generationRowSchema.parse(data) : null;
}

/** Hapus hasil milik pengguna yang login (RLS memastikan kepemilikan). */
export async function deleteMyGeneration(id: string): Promise<boolean> {
  if (!z.uuid().safeParse(id).success) return false;
  const supabase = await createClient();
  const { error, count } = await supabase
    .from("generations")
    .delete({ count: "exact" })
    .eq("id", id);
  if (error) throw new Error("Gagal menghapus hasil.", { cause: error });
  return (count ?? 0) > 0;
}
