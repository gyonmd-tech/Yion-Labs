"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { appCopy } from "@/content/app";
import { Button } from "@/components/ui/button";

export function CopyButton({
  text,
  label = appCopy.copy.label,
  variant = "outline",
}: {
  text: string;
  label?: string;
  variant?: "outline" | "default" | "ghost";
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(appCopy.copy.success);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(appCopy.copy.failed);
    }
  }

  return (
    <Button type="button" variant={variant} onClick={copy}>
      {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
      {copied ? appCopy.copy.done : label}
    </Button>
  );
}
