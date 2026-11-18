import { describe, expect, it } from "vitest";
import { mergedOpenSourceContributions } from "@/lib/open-source";

const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function utcDateLabel(timestamp: string) {
  const date = new Date(timestamp);
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${day} ${monthLabels[date.getUTCMonth()]} ${date.getUTCFullYear()} · UTC`;
}

describe("open-source contribution evidence", () => {
  it("publishes the thirteen verified upstream merges, newest first", () => {
    expect(mergedOpenSourceContributions).toHaveLength(13);
    expect(mergedOpenSourceContributions.map(({ repository, pullRequest }) => `${repository}${pullRequest}`)).toEqual([
      "CrowdStrike/gofalcon#773",
      "CrowdStrike/gofalcon#774",
      "grafana/clickhouse-datasource#2251",
      "nats-io/nats.py#1047",
      "nats-io/nats.py#1045",
      "airbytehq/PyAirbyte#1463",
      "nats-io/nats-server#8794",
      "envoyproxy/ratelimit#1287",
      "nats-io/nats.js#453",
      "mindersec/minder#6959",
      "thruwire/foreman#39",
      "prometheus/prometheus#19882",
      "nats-io/nats.py#1043",
    ]);
  });

  it("records GitHub merge timestamps in UTC without silently shifting dates", () => {
    expect(mergedOpenSourceContributions.map(({ mergedAt }) => mergedAt)).toEqual([
      "2026-11-16T21:58:16Z",
      "2026-11-16T21:57:48Z",
      "2026-11-16T12:41:02Z",
      "2026-11-16T11:35:11Z",
      "2026-11-13T23:46:06Z",
      "2026-11-12T18:31:47Z",
      "2026-11-09T11:06:26Z",
      "2026-11-07T07:45:04Z",
      "2026-10-23T13:50:30Z",
      "2026-10-23T10:33:14Z",
      "2026-10-05T13:00:52Z",
      "2026-10-05T10:20:20Z",
      "2026-10-01T21:36:34Z",
    ]);
    for (const contribution of mergedOpenSourceContributions) {
      expect(contribution.mergedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
      expect(contribution.mergedOn).toBe(utcDateLabel(contribution.mergedAt));
    }

    const mergeTimes = mergedOpenSourceContributions.map(({ mergedAt }) => Date.parse(mergedAt));
    expect(new Set(mergeTimes).size).toBe(mergeTimes.length);
    expect(mergeTimes).toEqual([...mergeTimes].sort((left, right) => right - left));
  });

  it("links every entry to a unique public GitHub pull request", () => {
    const urls = mergedOpenSourceContributions.map(({ url }) => url);

    expect(new Set(urls).size).toBe(urls.length);
    for (const { repository, pullRequest, url } of mergedOpenSourceContributions) {
      expect(url).toMatch(/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/pull\/\d+$/);
      expect(url).toBe(`https://github.com/${repository}/pull/${pullRequest.slice(1)}`);
    }
  });

  it("keeps review evidence and impact attached to every merge", () => {
    for (const contribution of mergedOpenSourceContributions) {
      expect(contribution.title.trim()).toBe(contribution.title);
      expect(contribution.title.length).toBeGreaterThan(0);
      expect(contribution.evidence).toMatch(/^Maintainer (approved|merged) · \d+ (of \d+ )?(checks passed|regression cases)$/);
      expect(contribution.impact.length).toBeGreaterThan(40);
    }
    const prometheus = mergedOpenSourceContributions.find(({ repository }) => repository === "prometheus/prometheus");
    expect(prometheus?.impact).toContain("next scheduled evaluation");
  });
});
