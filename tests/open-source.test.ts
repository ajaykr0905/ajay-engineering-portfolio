import { describe, expect, it } from "vitest";
import { mergedOpenSourceContributions } from "@/lib/open-source";

describe("open-source contribution evidence", () => {
  it("publishes the two verified upstream merges", () => {
    expect(mergedOpenSourceContributions).toHaveLength(2);
    expect(mergedOpenSourceContributions.map(({ repository, pullRequest }) => `${repository}${pullRequest}`)).toEqual([
      "prometheus/prometheus#19882",
      "nats-io/nats.py#1043",
    ]);
  });

  it("links every entry to a unique public GitHub pull request", () => {
    const urls = mergedOpenSourceContributions.map(({ url }) => url);

    expect(new Set(urls).size).toBe(urls.length);
    for (const url of urls) {
      expect(url).toMatch(/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/pull\/\d+$/);
    }
  });

  it("keeps review evidence and impact attached to every merge", () => {
    for (const contribution of mergedOpenSourceContributions) {
      expect(contribution.evidence).toContain("Maintainer approved");
      expect(contribution.evidence).toMatch(/\d+ checks passed/);
      expect(contribution.impact.length).toBeGreaterThan(40);
    }
  });
});
