import { z } from "zod";

export const PRD_IDEA_MIN = 30;
export const PRD_IDEA_MAX = 1500;

export const prdInputSchema = z.object({
  idea: z
    .string()
    .trim()
    .min(PRD_IDEA_MIN, { error: "too_short" })
    .max(PRD_IDEA_MAX, { error: "too_long" }),
});

export type PrdInput = z.infer<typeof prdInputSchema>;

const line = (max: number) => z.string().trim().min(1).max(max);

export const PRD_PRIORITIES = ["wajib", "sebaiknya", "nanti"] as const;

export const prdOutputSchema = z.object({
  productName: line(80),
  oneLiner: line(200),
  problem: line(700),
  targetUsers: z.array(line(200)).min(1).max(4),
  goals: z.array(line(200)).min(1).max(4),
  features: z
    .array(
      z.object({
        name: line(80),
        description: line(280),
        priority: z.enum(PRD_PRIORITIES),
      }),
    )
    .min(3)
    .max(8),
  mvpScope: z.object({
    include: z.array(line(200)).min(1).max(6),
    exclude: z.array(line(200)).min(1).max(6),
  }),
  successMetrics: z.array(line(200)).min(1).max(4),
  risks: z.array(line(200)).min(1).max(4),
});

export type PrdOutput = z.infer<typeof prdOutputSchema>;
