import { FileText, Image, LayoutTemplate, Scissors, Tag } from "lucide-react";
import type { IconName } from "../data";

const icons = { image: Image, layout: LayoutTemplate, tag: Tag, scissors: Scissors, "file-text": FileText };

export const Icon: React.FC<{ name: IconName; size: number; color: string }> = ({ name, size, color }) => {
  const C = icons[name];
  return <C size={size} color={color} strokeWidth={2} />;
};
