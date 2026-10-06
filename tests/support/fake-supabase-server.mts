/**
 * Menjalankan Supabase tiruan sebagai proses terpisah untuk uji lokal di browser:
 *   node tests/support/fake-supabase-server.mts
 * Lalu isi .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY=fake-anon-key
 *   SUPABASE_SERVICE_ROLE_KEY=fake-service-role-key
 * Data hilang saat proses berhenti.
 */
import { startFakeSupabase } from "./fake-supabase.ts";

const port = Number(process.env.FAKE_SUPABASE_PORT ?? 54321);
const fake = await startFakeSupabase({ port });
const seedEmail = process.env.FAKE_SUPABASE_SEED_EMAIL;
if (seedEmail) {
  const user = await fake.createUser({
    email: seedEmail,
    password: "password123",
    name: "Pengguna Uji",
  });
  console.log(`Pengguna uji: ${user.email} / password123`);
}
console.log(`Supabase tiruan berjalan di ${fake.url}`);
