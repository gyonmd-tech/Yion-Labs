import { FileText, Image, LayoutTemplate, Scissors, Tag, type LucideProps } from "lucide-react";
import type { ModuleIconName } from "@/lib/modules/types";

const icons = {
  image: Image,
  tag: Tag,
  scissors: Scissors,
  layout: LayoutTemplate,
  "file-text": FileText,
} satisfies Record<ModuleIconName, React.ComponentType<LucideProps>>;

export function ModuleIcon({ name, ...props }: { name: ModuleIconName } & LucideProps) {
  const Icon = icons[name];
  return <Icon aria-hidden="true" {...props} />;
}
