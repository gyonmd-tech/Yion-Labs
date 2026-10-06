import type { Metadata } from "next";
import { privacyDoc } from "@/content/legal";
import { LegalPage } from "@/components/marketing/legal-page";

export const metadata: Metadata = { title: privacyDoc.metaTitle };

export default function PrivacyPage() {
  return <LegalPage doc={privacyDoc} />;
}
