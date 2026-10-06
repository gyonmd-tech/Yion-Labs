import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type CurrentProfile = { id: string; email: string; name: string };

/**
 * Pengguna yang login beserta nama profilnya. Mengarahkan ke /masuk bila
 * belum login (pelindung kedua setelah proxy). Di-cache per request.
 */
export const requireProfile = cache(async (): Promise<CurrentProfile> => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) redirect("/masuk");

  const user = data.user;
  const { data: profile } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", user.id)
    .maybeSingle<{ name: string }>();

  const metaName: unknown = user.user_metadata?.full_name;
  return {
    id: user.id,
    email: user.email ?? "",
    name: profile?.name || (typeof metaName === "string" ? metaName : ""),
  };
});
