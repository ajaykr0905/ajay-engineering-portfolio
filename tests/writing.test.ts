import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { getWritingArticle, writingArticles, writingSlugs } from "@/lib/writing";

const expectedCommits = {
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
  it("publishes exactly the two routed long-form articles", () => {
    expect(writingArticles.map((article) => article.slug)).toEqual(writingSlugs);
    expect(new Set(writingArticles.map((article) => article.slug)).size).toBe(writingArticles.length);
    for (const slug of writingSlugs) expect(getWritingArticle(slug)?.slug).toBe(slug);
    expect(getWritingArticle("not-an-article")).toBeUndefined();
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
      expect(proseWordCount(source)).toBeGreaterThanOrEqual(900);
      expect(source).toContain("className=\"article-flow\"");
      expect(source).toMatch(/## (Rejected approaches|Approaches the design rejects)/);
      expect(source).toContain("## Reproduce the result");
      expect(source).toContain("## Limitations");
      expect(source).toContain(expectedCommits[slug]);
    }
  });

  it("uses the concise public identity without surname leakage", () => {
    const completeWritingSurface = [
      JSON.stringify(writingArticles),
      ...writingSlugs.map(articleSource),
    ].join("\n");
    expect(completeWritingSurface).not.toMatch(/Ajay (?:Kumar )?Pondugala/i);
  });
});
