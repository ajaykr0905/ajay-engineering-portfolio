import { z } from "zod";

export const writingSlugs = [
  "deterministic-checkpoint-recovery",
  "at-least-once-idempotency",
] as const;

export type WritingSlug = (typeof writingSlugs)[number];

const writingArticleSchema = z.object({
  slug: z.enum(writingSlugs),
  title: z.string().min(1),
  eyebrow: z.string().min(1),
  summary: z.string().min(1),
  publishedAt: z.string().date(),
  updatedAt: z.string().date(),
  publishedLabel: z.string().min(1),
  readingMinutes: z.number().int().positive(),
  repositoryUrl: z.string().url(),
  sourceCommitUrl: z.string().url(),
  sourceCommit: z.string().regex(/^[a-f0-9]{40}$/),
  projectPath: z.string().startsWith("/projects/"),
  projectLabel: z.string().min(1),
});

export type WritingArticle = z.infer<typeof writingArticleSchema>;

const articleInput = [
  {
    slug: "deterministic-checkpoint-recovery",
    title: "Deterministic checkpoint recovery: what state must survive?",
    eyebrow: "AI infrastructure · Recovery contracts",
    summary:
      "A code-backed examination of atomic checkpoints, configuration identity, RNG restoration, and the exact-equality test that separates a real restart from a plausible-looking continuation.",
    publishedAt: "2026-09-23",
    updatedAt: "2026-09-23",
    publishedLabel: "23 Sep 2026",
    readingMinutes: 9,
    repositoryUrl: "https://github.com/ajaykr0905/fault-tolerant-transformer-lab",
    sourceCommitUrl:
      "https://github.com/ajaykr0905/fault-tolerant-transformer-lab/tree/41dcd0ea315515f63ea764225867ff569bc50316",
    sourceCommit: "41dcd0ea315515f63ea764225867ff569bc50316",
    projectPath: "/projects/fault-tolerant-transformer-lab",
    projectLabel: "Fault-Tolerant Transformer Lab",
  },
  {
    slug: "at-least-once-idempotency",
    title: "Why at-least-once delivery requires an idempotency strategy",
    eyebrow: "Distributed systems · Delivery semantics",
    summary:
      "A concrete worker contract for stable message identity, durable acceptance, duplicate suppression, bounded retries, and dead-letter handling—grounded in executable Go tests.",
    publishedAt: "2026-09-23",
    updatedAt: "2026-09-23",
    publishedLabel: "23 Sep 2026",
    readingMinutes: 10,
    repositoryUrl: "https://github.com/ajaykr0905/distributed-scale-validation-lab",
    sourceCommitUrl:
      "https://github.com/ajaykr0905/distributed-scale-validation-lab/tree/e0a1a197265869a15043df462d1f230221660ba5",
    sourceCommit: "e0a1a197265869a15043df462d1f230221660ba5",
    projectPath: "/projects/distributed-scale-validation-platform",
    projectLabel: "Distributed Scale Validation Lab",
  },
] satisfies WritingArticle[];

export const writingArticles = z.array(writingArticleSchema).parse(articleInput);

export function getWritingArticle(slug: string) {
  return writingArticles.find((article) => article.slug === slug);
}
