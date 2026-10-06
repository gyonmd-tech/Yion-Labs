import type { Metadata } from "next";
import { requireProfile } from "@/lib/auth/current-profile";
import { AppShell } from "@/components/shell/app-shell";

export const metadata: Metadata = { robots: { index: false } };

export default async function AppLayout({ children }: LayoutProps<"/app">) {
  const profile = await requireProfile();
  // Saldo kredit dibaca dari ledger mulai Fase 1.
  return (
    <AppShell user={{ name: profile.name, email: profile.email }} balance={null}>
      {children}
    </AppShell>
  );
}
