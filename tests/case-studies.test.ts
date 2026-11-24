import { describe, expect, it } from "vitest";
import { caseStudies, type CaseStudy } from "@/lib/case-studies";
import { PUBLIC_SAFE_DENYLIST } from "./public-safe";

function allText(study: CaseStudy): string[] {
  return [
    study.slug,
    study.title,
    study.context,
    study.problem,
    study.ownership,
    study.decision,
    ...study.result,
    ...study.limits,
    ...study.scope,
  ];
}

function bySlug(slug: string): CaseStudy {
  const study = caseStudies.find((item) => item.slug === slug);
  if (!study) throw new Error(`missing case study ${slug}`);
  return study;
}

describe("production case studies", () => {
  it("publishes exactly the two shipped changes", () => {
    expect(caseStudies.map((study) => study.slug)).toEqual(["device-classification-reuse", "dependency-failure-handling"]);
  });

  it("states the reuse figures verbatim", () => {
    const reuse = bySlug("device-classification-reuse");
    for (const figure of [
      "about 235K classifications a day reused",
      "about 4% of that classification work",
      "61% hit rate",
      "zero database errors",
      "live across the production fleet since 9 Nov 2026",
    ]) {
      expect(reuse.result.some((line) => line.includes(figure))).toBe(true);
    }
  });

  it("states the failure-handling facts verbatim", () => {
    const text = allText(bySlug("dependency-failure-handling")).join(" ");
    for (const fact of [
      "typed dependency-failure classification",
      "HTTP 424",
      "structured skipped-rule records",
      "three services",
      "269-test suite",
    ]) {
      expect(text).toContain(fact);
    }
  });

  it("names what each study does not claim", () => {
    for (const study of caseStudies) {
      expect(study.limits.length).toBeGreaterThanOrEqual(3);
      expect(study.scope.length).toBeGreaterThan(0);
    }
  });

  it("keeps every published string free of internal identifiers", () => {
    for (const text of caseStudies.flatMap(allText)) {
      expect(text).not.toMatch(PUBLIC_SAFE_DENYLIST);
    }
  });

  it("uses a denylist that allows legitimate published copy", () => {
    for (const safe of ["HTTP 424", "Software Engineer II", "uber/NullAway #2059", "OTLP export", "Bool columns", "SHA-256", "ISO-8601", "kill-2026-10-03"]) {
      expect(safe).not.toMatch(PUBLIC_SAFE_DENYLIST);
    }
  });

  it("uses a denylist that catches internal identifiers", () => {
    for (const unsafe of ["ABC-12345", "MR !1234", "the shard owner", "host.cisco.com", "3+ years", "built the connection pool"]) {
      expect(unsafe).toMatch(PUBLIC_SAFE_DENYLIST);
    }
  });
});
