"use server";

import { revalidatePath } from "next/cache";
import { deleteMyGeneration } from "@/lib/generations/repository";

export async function deleteGenerationAction(id: string): Promise<{ ok: boolean }> {
  try {
    const ok = await deleteMyGeneration(id);
    revalidatePath("/app", "layout");
    return { ok };
  } catch (error) {
    console.error("[library] gagal menghapus", error);
    return { ok: false };
  }
}
