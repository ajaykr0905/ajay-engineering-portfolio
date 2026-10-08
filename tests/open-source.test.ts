import { describe, expect, it } from "vitest";
import { mergedOpenSourceContributions } from "@/lib/open-source";

describe("open-source contribution evidence", () => {
  it("publishes the three verified upstream merges", () => {
    expect(mergedOpenSourceContributions).toHaveLength(3);
    expect(mergedOpenSourceContributions.map(({ repository, pullRequest }) => `${repository}${pullRequest}`)).toEqual([
      "nats-io/nats.py#1043",
      "prometheus/prometheus#19882",
      "thruwire/foreman#39",
    ]);
  });

  it("records GitHub merge timestamps in UTC without silently shifting dates", () => {
    expect(mergedOpenSourceContributions.map(({ mergedAt }) => mergedAt)).toEqual([
      "2026-10-01T21:36:34Z",
      "2026-10-05T10:20:20Z",
      "2026-10-05T13:00:52Z",
    ]);
    for (const contribution of mergedOpenSourceContributions) {
      expect(contribution.mergedOn).toContain("UTC");
    }
    expect(mergedOpenSourceContributions[1]?.impact).toContain("next scheduled evaluation");
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
      expect(contribution.evidence).toContain("Maintainer");
      expect(contribution.evidence).toMatch(/\d+ (checks passed|regression cases)/);
      expect(contribution.impact.length).toBeGreaterThan(40);
    }
  });
});
