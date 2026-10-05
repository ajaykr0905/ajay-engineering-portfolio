export type OpenSourceContribution = {
  repository: string;
  pullRequest: `#${number}`;
  title: string;
  area: string;
  impact: string;
  mergedAt: `${number}-${number}-${number}`;
  mergedOn: string;
  evidence: string;
  url: `https://github.com/${string}`;
};

export const mergedOpenSourceContributions: OpenSourceContribution[] = [
  {
    repository: "thruwire/foreman",
    pullRequest: "#39",
    title: "Reject malformed persisted state before legacy migration",
    area: "Persistence reliability",
    impact:
      "Routes malformed saved-state shapes through Foreman's existing error boundary so corrupt runs cannot crash list and inspect commands.",
    mergedAt: "2026-10-05",
    mergedOn: "05 Oct 2026",
    evidence: "Maintainer merged · 15 regression cases",
    url: "https://github.com/thruwire/foreman/pull/39",
  },
  {
    repository: "prometheus/prometheus",
    pullRequest: "#19882",
    title: "Restore firing alerts with short for durations",
    area: "Alerting reliability",
    impact:
      "Preserves previously firing alert state across restarts without changing pending-alert grace behavior.",
    mergedAt: "2026-10-05",
    mergedOn: "05 Oct 2026",
    evidence: "Maintainer approved · 39 checks passed",
    url: "https://github.com/prometheus/prometheus/pull/19882",
  },
  {
    repository: "nats-io/nats.py",
    pullRequest: "#1043",
    title: "Send explicit passwords alongside signed CONNECT credentials",
    area: "Client authentication",
    impact:
      "Keeps explicit passwords intact when NATS clients authenticate with signed JWT and NKey credentials.",
    mergedAt: "2026-10-02",
    mergedOn: "02 Oct 2026",
    evidence: "Maintainer approved · 28 checks passed",
    url: "https://github.com/nats-io/nats.py/pull/1043",
  },
];
