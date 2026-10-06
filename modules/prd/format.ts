import { prdCopy } from "@/modules/prd/copy";
import type { PrdOutput } from "@/modules/prd/schema";

/** PRD sebagai Markdown untuk tombol salin. */
export function prdToMarkdown(prd: PrdOutput): string {
  const s = prdCopy.sections;
  const list = (items: readonly string[]) => items.map((i) => `- ${i}`).join("\n");
  return [
    `# ${prd.productName}`,
    prd.oneLiner,
    `## ${s.problem}\n${prd.problem}`,
    `## ${s.targetUsers}\n${list(prd.targetUsers)}`,
    `## ${s.goals}\n${list(prd.goals)}`,
    `## ${s.features}\n${prd.features
      .map((f) => `- **${f.name}** (${prdCopy.priority[f.priority]}): ${f.description}`)
      .join("\n")}`,
    `## ${s.mvp}\n### ${s.mvpInclude}\n${list(prd.mvpScope.include)}\n### ${s.mvpExclude}\n${list(prd.mvpScope.exclude)}`,
    `## ${s.successMetrics}\n${list(prd.successMetrics)}`,
    `## ${s.risks}\n${list(prd.risks)}`,
  ].join("\n\n");
}
