import type { Metadata } from "next";
import { requireProfile } from "@/lib/auth/current-profile";
import { ensureBonusAndGetBalance } from "@/lib/credits";
import { AppShell } from "@/components/shell/app-shell";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = { robots: { index: false } };

export default async function AppLayout({ children }: LayoutProps<"/app">) {
  const profile = await requireProfile();
  // Bonus daftar diberikan sekali, saat pengguna pertama kali membuka aplikasi.
  const balance = await ensureBonusAndGetBalance(profile.id);
  return (
    <AppShell user={{ name: profile.name, email: profile.email }} balance={balance}>
      {children}
      <Toaster position="top-center" />
    </AppShell>
  );
}
