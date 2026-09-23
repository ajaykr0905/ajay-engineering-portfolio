import { describe, expect, it } from "vitest";
import { projectSchema, projects, projectVisualKeySchema } from "@/lib/projects";

describe("project evidence model", () => {
  it("validates every published project", () => {
    for (const project of projects) {
      expect(() => projectSchema.parse(project)).not.toThrow();
    }
  });

  it("uses unique, URL-safe slugs", () => {
    const slugs = projects.map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  });

  it("assigns each published system one supported visual identity", () => {
    expect(projects.map((project) => project.visualKey)).toEqual(["transformer", "distributed", "voicemed", "security"]);
    expect(projectVisualKeySchema.safeParse("security").success).toBe(true);
  });

  it("does not publish a metric without a method", () => {
    for (const metric of projects.flatMap((project) => project.metrics)) {
      expect(metric.method.trim().length).toBeGreaterThan(20);
    }
  });

  it("pins every metric to reproducible source, commit, command, CI, and environment details", () => {
    for (const metric of projects.flatMap((project) => project.metrics)) {
      const { evidence } = metric;
      expect(evidence.sourceLabel.length).toBeGreaterThan(5);
      expect(evidence.sourceUrl).toContain(evidence.commitSha);
      expect(evidence.sourceUrl).not.toMatch(/\/(?:blob|tree)\/main(?:\/|$)/);
      expect(evidence.commitSha).toMatch(/^[a-f0-9]{40}$/);
      expect(evidence.commitUrl).toBe(`https://github.com/ajaykr0905/${new URL(evidence.sourceUrl).pathname.split("/")[2]}/commit/${evidence.commitSha}`);
      expect(evidence.command.length).toBeGreaterThan(5);
      expect(evidence.ciUrl).toMatch(/^https:\/\/github\.com\/ajaykr0905\/[^/]+\/actions\/runs\/\d+\/job\/\d+$/);
      expect(evidence.environment.length).toBeGreaterThan(10);
      expect(evidence.limitation.length).toBeGreaterThan(20);
    }
  });

  it("publishes only test-grounded deterministic replay scenarios", () => {
    for (const project of projects) {
      expect(project.replayScenarios.length).toBeGreaterThan(0);
      for (const scenario of project.replayScenarios) {
        expect(scenario.steps.length).toBeGreaterThanOrEqual(3);
        expect(scenario.sourceUrl).toMatch(/^https:\/\/github\.com\/ajaykr0905\//);
        expect(scenario.sourceUrl).not.toMatch(/\/(?:blob|tree)\/main(?:\/|$)/);
        expect(scenario.limitation.toLowerCase()).toContain("not");
      }
    }
  });

  it("gives every featured project a public Ajay-owned repository", () => {
    for (const project of projects.filter((item) => item.featured)) {
      expect(project.repositoryUrl).toMatch(/^https:\/\/github\.com\/ajaykr0905\//);
      expect(project.currentFocus.length).toBeGreaterThan(30);
    }
  });

  it("does not label unfinished flagship work as shipped", () => {
    const flagship = projects.find((project) => project.slug === "fault-tolerant-transformer-lab");
    expect(flagship?.status).toBe("Building");
    expect(flagship?.limitations.some((item) => item.includes("No public multi-GPU"))).toBe(true);
    for (const metric of flagship?.metrics ?? []) {
      expect(metric.evidence.sourceUrl).toMatch(/^https:\/\/github\.com\/ajaykr0905\//);
    }
  });

  it("replaces weak volume counts with exact restart equality", () => {
    const transformer = projects.find((project) => project.visualKey === "transformer");
    expect(transformer?.metrics.some((metric) => metric.value === "512")).toBe(false);
    expect(transformer?.metrics).toEqual(expect.arrayContaining([
      expect.objectContaining({
        value: "rtol 0 / atol 0",
        label: "resumed model-state equality",
      }),
    ]));
  });

  it("exposes truthful distributed failure semantics without a worker-kill control", () => {
    const distributed = projects.find((project) => project.visualKey === "distributed");
    expect(distributed?.metrics.map((metric) => metric.value)).toEqual(["2 → 1", "3 → DLQ", "1 / 1", "10,000 / 10,000"]);
    expect(distributed?.metrics.map((metric) => metric.evidence.ciUrl)).toEqual(expect.arrayContaining([
      "https://github.com/ajaykr0905/distributed-scale-validation-lab/actions/runs/35731961184/job/106759506319",
      "https://github.com/ajaykr0905/distributed-scale-validation-lab/actions/runs/35731961184/job/106759506059",
    ]));
    expect(distributed?.replayScenarios.map((scenario) => scenario.id)).toEqual([
      "duplicate-delivery",
      "retry-failed-job",
      "bounded-dead-letter",
    ]);
    expect(distributed?.replayScenarios.map((scenario) => scenario.label).join(" ")).not.toMatch(/kill/i);
    expect(distributed?.demoPath).toBe("/projects/distributed-scale-validation-platform#failure-replay");
  });

  it("grounds the VoiceMed review replay in the pinned browser gate", () => {
    const voiceMed = projects.find((project) => project.visualKey === "voicemed");
    expect(voiceMed?.replayScenarios).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: "human-review-gate", label: "Human review gate" }),
    ]));
    expect(voiceMed?.replayScenarios[0]?.sourceUrl).toContain("824b2331c476ccfab320e5b186f1846ae21d79f3");
  });

  it("publishes the security harness only with pinned, current-slice evidence", () => {
    const security = projects.find((project) => project.visualKey === "security");
    expect(security?.stack).toEqual(["Go", "OSV", "CISA KEV", "HTTP API", "GitHub Actions"]);
    expect(security?.stack).not.toEqual(expect.arrayContaining(["PostgreSQL", "Docker", "OpenTelemetry"]));
    expect(security?.metrics.map((metric) => metric.value)).toEqual(["4 / 4", "1 → 1", "critical"]);
    expect(security?.metrics.every((metric) => metric.evidence.commitSha === "2caa83604fa969f4c9d6e226e479c331899d76ba")).toBe(true);
    expect(security?.metrics.every((metric) => metric.evidence.ciUrl === "https://github.com/ajaykr0905/evidence-first-security-harness/actions/runs/35780173790/job/106923368505")).toBe(true);
    expect(security?.replayScenarios).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: "evidence-policy-replay", label: "Evidence-to-policy replay" }),
    ]));
    expect(security?.demoPath).toBe("/projects/evidence-first-security-harness#failure-replay");
  });
});
