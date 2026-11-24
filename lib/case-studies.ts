export type CaseStudy = {
  slug: string;
  title: string;
  context: string;
  problem: string;
  ownership: string;
  decision: string;
  result: string[];
  limits: string[];
  scope: string[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "device-classification-reuse",
    title: "Reusing device classifications across randomized MAC addresses",
    context:
      "On a Kubernetes-native enterprise identity and security platform, devices are classified before an access policy applies.",
    problem:
      "Phones rotate randomized MAC addresses, so the same device looked new and a downstream engine classified it again.",
    ownership: "I wrote the reuse logic and its metrics.",
    decision:
      "Reuse a classification only on a strong match, and fall back to a fresh classification on any doubt. This gave up some savings to avoid a wrong access policy.",
    result: [
      "Volume: about 235K classifications a day reused, about 4% of that classification work.",
      "Reuse: 61% hit rate.",
      "Errors: zero database errors.",
      "Rollout: live across the production fleet since 9 Nov 2026.",
    ],
    limits: [
      "One change in a single product; it is not a claim about other products or the whole platform.",
      "No customer data is published.",
      "The figures are production counts at one point in time, not a long-term average or a benchmark.",
      "The internal code is not public.",
    ],
    scope: ["Backend service logic", "Reuse logic", "Production metrics"],
  },
  {
    slug: "dependency-failure-handling",
    title: "Making dependency failures explicit in policy evaluation",
    context:
      "Policy evaluation on a Kubernetes-native enterprise identity and security platform depended on several downstream services.",
    problem:
      "A failure in one dependency was not reported explicitly, so a skipped rule looked like a normal result.",
    ownership:
      "I wrote typed dependency-failure classification, HTTP 424 for dependency failures, and structured skipped-rule records.",
    decision:
      "Classify dependency failures by type, return HTTP 424 for them, and record each skipped rule.",
    result: [
      "Typed dependency-failure classification, HTTP 424 for dependency failures, and structured skipped-rule records merged in three services.",
      "The 269-test suite was green at merge.",
    ],
    limits: [
      "One change in a single product; it is not a claim about other products or the whole platform.",
      "No customer data is published.",
      "The service and test counts are facts at merge time, not a measure of later behaviour.",
      "The internal code is not public.",
    ],
    scope: ["HTTP APIs", "Typed error classification", "Automated test suite"],
  },
];
