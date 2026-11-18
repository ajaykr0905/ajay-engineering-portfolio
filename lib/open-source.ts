export type OpenSourceContribution = {
  repository: string;
  pullRequest: `#${number}`;
  title: string;
  area: string;
  impact: string;
  mergedAt: `${number}-${number}-${number}T${string}Z`;
  mergedOn: string;
  evidence: string;
  url: `https://github.com/${string}`;
};

// Titles, merge times, approvals and check counts come from GitHub. "N checks passed" counts successful checks only.
const contributionInput: OpenSourceContribution[] = [
  {
    repository: "CrowdStrike/gofalcon",
    pullRequest: "#773",
    title: "fix(client): don't stop retrying after the backoff 15-minute default",
    area: "Retry reliability",
    impact:
      "Removes the backoff library's 15-minute retry limit, so only MaxTries and the request context end retries and MaxTries 0 is unlimited as documented.",
    mergedAt: "2026-11-16T21:58:16Z",
    mergedOn: "16 Nov 2026 · UTC",
    evidence: "Maintainer approved · 8 checks passed",
    url: "https://github.com/CrowdStrike/gofalcon/pull/773",
  },
  {
    repository: "CrowdStrike/gofalcon",
    pullRequest: "#774",
    title: "fix(streaming): refresh the session of the stream's own partition",
    area: "Streaming sessions",
    impact:
      "Sends each stream's own partition on every session refresh, so streams on partitions other than 0 now get their own sessions refreshed.",
    mergedAt: "2026-11-16T21:57:48Z",
    mergedOn: "16 Nov 2026 · UTC",
    evidence: "Maintainer approved · 8 checks passed",
    url: "https://github.com/CrowdStrike/gofalcon/pull/774",
  },
  {
    repository: "grafana/clickhouse-datasource",
    pullRequest: "#2251",
    title: "fix(queryBuilder): handle single-value IN filters",
    area: "Query builder",
    impact:
      "Converts single-value IN and NOT IN filters to the array shape the query builder expects, so switching from the SQL editor no longer fails.",
    mergedAt: "2026-11-16T12:41:02Z",
    mergedOn: "16 Nov 2026 · UTC",
    evidence: "Maintainer approved · 27 checks passed",
    url: "https://github.com/grafana/clickhouse-datasource/pull/2251",
  },
  {
    repository: "nats-io/nats.py",
    pullRequest: "#1047",
    title: "Reject durable and queue settings for ordered consumers",
    area: "Consumer validation",
    impact:
      "Rejects durable names and queue groups for ordered consumers at subscription time, as ADR-17 requires, so a durable ordered consumer no longer fails later when the client recreates it.",
    mergedAt: "2026-11-16T11:35:11Z",
    mergedOn: "16 Nov 2026 · UTC",
    evidence: "Maintainer approved · 27 checks passed",
    url: "https://github.com/nats-io/nats.py/pull/1047",
  },
  {
    repository: "nats-io/nats.py",
    pullRequest: "#1045",
    title: "Support metadata when creating legacy key-value buckets",
    area: "Key-value API",
    impact:
      "Lets callers set bucket metadata through create_key_value() and forwards it to the backing stream config, matching the nats-key-value package.",
    mergedAt: "2026-11-13T23:46:06Z",
    mergedOn: "13 Nov 2026 · UTC",
    evidence: "Maintainer approved · 27 checks passed",
    url: "https://github.com/nats-io/nats.py/pull/1045",
  },
  {
    repository: "airbytehq/PyAirbyte",
    pullRequest: "#1463",
    title: "feat(cli): report the installed PyAirbyte version",
    area: "CLI usability",
    impact:
      "Adds a --version flag, so pyab and pyairbyte print the installed PyAirbyte version and exit successfully instead of failing with an unknown-command error.",
    mergedAt: "2026-11-12T18:31:47Z",
    mergedOn: "12 Nov 2026 · UTC",
    evidence: "Maintainer merged · 14 checks passed",
    url: "https://github.com/airbytehq/PyAirbyte/pull/1463",
  },
  {
    repository: "nats-io/nats-server",
    pullRequest: "#8794",
    title: "Fix ATS worker shutdown synchronization",
    area: "Shutdown synchronization",
    impact:
      "Gives each ATS worker its own stop channel and makes Unregister wait for that worker to exit, so a new worker cannot consume an older worker's shutdown signal.",
    mergedAt: "2026-11-09T11:06:26Z",
    mergedOn: "09 Nov 2026 · UTC",
    evidence: "Maintainer approved · 24 checks passed",
    url: "https://github.com/nats-io/nats-server/pull/8794",
  },
  {
    repository: "envoyproxy/ratelimit",
    pullRequest: "#1287",
    title: "server: allow memcache health checks to pass",
    area: "Health checks",
    impact:
      "Lets memcache-backed servers report healthy without a Redis client, while Redis-backed servers still wait for a confirmed connection.",
    mergedAt: "2026-11-07T07:45:04Z",
    mergedOn: "07 Nov 2026 · UTC",
    evidence: "Maintainer approved · 4 of 6 checks passed",
    url: "https://github.com/envoyproxy/ratelimit/pull/1287",
  },
  {
    repository: "nats-io/nats.js",
    pullRequest: "#453",
    title: "core: reject transports closed after handshake",
    area: "Connection reliability",
    impact:
      "Rejects a dial when the transport closes right after the handshake, so the client does not become connected to a closed transport and the dial loop retries.",
    mergedAt: "2026-10-23T13:50:30Z",
    mergedOn: "23 Oct 2026 · UTC",
    evidence: "Maintainer approved · 30 checks passed",
    url: "https://github.com/nats-io/nats.js/pull/453",
  },
  {
    repository: "mindersec/minder",
    pullRequest: "#6959",
    title: "Handle SIGTERM during server shutdown",
    area: "Graceful shutdown",
    impact:
      "Adds SIGTERM to the server's shutdown signals, so a normal Kubernetes pod shutdown reaches the existing cleanup for the event router, subscribers, database and provider clients.",
    mergedAt: "2026-10-23T10:33:14Z",
    mergedOn: "23 Oct 2026 · UTC",
    evidence: "Maintainer approved · 27 checks passed",
    url: "https://github.com/mindersec/minder/pull/6959",
  },
  {
    repository: "thruwire/foreman",
    pullRequest: "#39",
    title: "Reject malformed persisted state before legacy migration",
    area: "Persistence reliability",
    impact:
      "Routes malformed saved-state shapes through Foreman's existing error boundary so corrupt runs cannot crash list and inspect commands.",
    mergedAt: "2026-10-05T13:00:52Z",
    mergedOn: "05 Oct 2026 · UTC",
    evidence: "Maintainer merged · 15 regression cases",
    url: "https://github.com/thruwire/foreman/pull/39",
  },
  {
    repository: "prometheus/prometheus",
    pullRequest: "#19882",
    title: "rules: restore firing alerts with short for durations",
    area: "Alerting reliability",
    impact:
      "Restores the activation time of firing alerts with short for durations across restart, allowing firing to resume on the next scheduled evaluation while preserving pending-alert grace behavior.",
    mergedAt: "2026-10-05T10:20:20Z",
    mergedOn: "05 Oct 2026 · UTC",
    evidence: "Maintainer approved · 29 checks passed",
    url: "https://github.com/prometheus/prometheus/pull/19882",
  },
  {
    repository: "nats-io/nats.py",
    pullRequest: "#1043",
    title: "Send explicit passwords alongside signed CONNECT credentials",
    area: "Client authentication",
    impact:
      "Keeps explicit passwords intact when NATS clients authenticate with signed JWT and NKey credentials.",
    mergedAt: "2026-10-01T21:36:34Z",
    mergedOn: "01 Oct 2026 · UTC",
    evidence: "Maintainer approved · 28 checks passed",
    url: "https://github.com/nats-io/nats.py/pull/1043",
  },
];

function newestMergeFirst(left: OpenSourceContribution, right: OpenSourceContribution) {
  const byMergeTime = Date.parse(right.mergedAt) - Date.parse(left.mergedAt);
  if (byMergeTime !== 0) return byMergeTime;
  return left.url < right.url ? -1 : left.url > right.url ? 1 : 0;
}

export const mergedOpenSourceContributions = [...contributionInput].sort(newestMergeFirst);
