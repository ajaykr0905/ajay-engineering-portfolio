import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { getWritingArticle, writingArticles, writingSlugs } from "@/lib/writing";

const expectedCommits = {
  "commit-before-ack": "6b01125cb71d49fc2fba1cf009aeb7d45e61cab6",
  "transactional-outbox-recovery": "6b01125cb71d49fc2fba1cf009aeb7d45e61cab6",
  "backpressure-under-load": "6b01125cb71d49fc2fba1cf009aeb7d45e61cab6",
  "deterministic-checkpoint-recovery": "41dcd0ea315515f63ea764225867ff569bc50316",
  "at-least-once-idempotency": "e0a1a197265869a15043df462d1f230221660ba5",
} as const;

function articleSource(slug: (typeof writingSlugs)[number]) {
  return readFileSync(resolve(process.cwd(), "content", "writing", `${slug}.mdx`), "utf8");
}

function proseWordCount(source: string) {
  return source
    .replace(/<[^>]+>/g, " ")
    .replace(/[`#*_>()[\]{}]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

describe("technical writing library", () => {
  it("routes two long-form articles and three concise backend field notes", () => {
    expect(writingArticles.map((article) => article.slug)).toEqual(writingSlugs);
    expect(new Set(writingArticles.map((article) => article.slug)).size).toBe(writingArticles.length);
    for (const slug of writingSlugs) expect(getWritingArticle(slug)?.slug).toBe(slug);
    expect(getWritingArticle("not-an-article")).toBeUndefined();
    expect(writingArticles.filter(({ format }) => format === "field-note")).toHaveLength(3);
    expect(writingArticles.filter(({ format }) => format === "long-form")).toHaveLength(2);
  });

  it("pins every evidence link to the reviewed public commit", () => {
    for (const article of writingArticles) {
      expect(article.sourceCommit).toBe(expectedCommits[article.slug]);
      expect(article.sourceCommitUrl).toContain(`/tree/${article.sourceCommit}`);
      expect(article.repositoryUrl).toMatch(/^https:\/\/github\.com\/ajaykr0905\//);
    }
  });

  it("keeps each article substantive, reproducible, and explicit about limits", () => {
    for (const slug of writingSlugs) {
      const source = articleSource(slug);
      const minimumWords = getWritingArticle(slug)?.format === "long-form" ? 900 : 350;
      expect(proseWordCount(source)).toBeGreaterThanOrEqual(minimumWords);
      expect(source).toContain("className=\"article-flow\"");
      expect(source).toMatch(/## (Rejected approaches|Approaches the design rejects)/);
      expect(source).toContain("## Reproduce the result");
      expect(source).toContain("## Limitations");
      expect(source).toContain(expectedCommits[slug]);
    }
  });

  it("grounds field notes in tested local contracts and corrected measurement boundaries", () => {
    expect(articleSource("transactional-outbox-recovery")).toContain("FOR UPDATE SKIP LOCKED");
    expect(articleSource("backpressure-under-load")).toContain("first observed committed completed-job/result join");
    expect(articleSource("backpressure-under-load")).toContain("not an isolated SQL commit duration");
    expect(articleSource("commit-before-ack")).toContain("not arbitrary SIGKILL timing");
    for (const slug of writingSlugs.slice(0, 3)) {
      expect(articleSource(slug)).toContain("0a03f985bb78a7a0889e541ece71672b74a73912");
    }
  });
});
