import type { Metadata } from "next";
import { termsDoc } from "@/content/legal";
import { LegalPage } from "@/components/marketing/legal-page";

export const metadata: Metadata = { title: termsDoc.metaTitle };

export default function TermsPage() {
  return <LegalPage doc={termsDoc} />;
}
