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
    expect(projects.map((project) => project.visualKey)).toEqual(["distributed", "transformer", "voicemed", "security"]);
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

  it("labels verified CPU recovery as a runnable lab, not shipped infrastructure", () => {
    const flagship = projects.find((project) => project.slug === "fault-tolerant-transformer-lab");
    expect(flagship?.status).toBe("Runnable Lab");
    expect(flagship?.lastVerified).toBe("2026-10-03");
    expect(flagship?.limitations.some((item) => item.includes("No public multi-GPU"))).toBe(true);
    expect(flagship?.limitations.join(" ")).toMatch(/not a power-loss durability proof/);
    expect(flagship?.limitations.join(" ")).toMatch(/arbitrary asynchronous kill timing remains unverified/);
    expect(flagship?.limitations.join(" ")).toMatch(/not throughput benchmarks or recovery SLOs/);
    for (const metric of flagship?.metrics ?? []) {
      expect(metric.evidence.sourceUrl).toMatch(/^https:\/\/github\.com\/ajaykr0905\//);
    }
  });

  it("replaces weak volume counts with exact restart equality", () => {
    const transformer = projects.find((project) => project.visualKey === "transformer");
    expect(transformer?.metrics.some((metric) => metric.value === "512")).toBe(false);
    expect(transformer?.metrics.some((metric) => metric.value === "9 / 9")).toBe(false);
    expect(transformer?.metrics).toEqual(expect.arrayContaining([
      expect.objectContaining({
        value: "rtol 0 / atol 0",
        label: "resumed model-state equality",
      }),
    ]));
  });

  it("separates pinned public-corpus kill evidence from network-free fixture CI", () => {
    const transformer = projects.find((project) => project.visualKey === "transformer");
    const recoveryMetrics = transformer?.metrics.filter((metric) => metric.value !== "5.5%") ?? [];
    expect(recoveryMetrics).toHaveLength(2);
    expect(recoveryMetrics[0]).toMatchObject({
      value: "4 / 4",
      label: "SIGKILL boundaries recovered on public data",
    });
    for (const metric of recoveryMetrics) {
      expect(metric.evidence.commitSha).toBe("e6a7d44a7f60b5f87e60e28efe6232070b43954e");
      expect(metric.evidence.sourceUrl).toContain("/artifacts/peps-process-kill-2026-10-03");
      expect(metric.evidence.command).toContain("fttl-verify-process-recovery");
      expect(metric.evidence.command).toContain("--dataset-manifest .cache/fttl/peps-v1/manifest.json");
      expect(metric.evidence.ciLabel).toContain("network-free CC0 fixture");
      expect(metric.evidence.ciUrl).toBe("https://github.com/ajaykr0905/fault-tolerant-transformer-lab/actions/runs/37114067040/job/111177338320");
      expect(metric.evidence.environment).toContain("Local deterministic CPU");
      expect(metric.evidence.limitation).toMatch(/not/);
    }
    for (const boundary of ["before-forward", "after-backward", "after-optimizer", "during-checkpoint-write"]) {
      expect(recoveryMetrics[0]?.evidence.command).toContain(boundary);
    }
    expect(transformer?.verification.join(" ")).toContain("384 input tokens");
    expect(transformer?.limitations.join(" ")).toContain("12 windows from 12 documents");
    expect(transformer?.replayScenarios[0]?.steps).toHaveLength(5);
    expect(transformer?.replayScenarios[0]?.outcome).toContain("16 exact checks");
    expect(transformer?.replayScenarios[0]?.sourceUrl).toContain("/after-optimizer/process-recovery-report.json");
  });

  it("preserves the original synthetic LoRA result and its independent evidence pin", () => {
    const transformer = projects.find((project) => project.visualKey === "transformer");
    const tuning = transformer?.metrics.find((metric) => metric.value === "5.5%");
    expect(tuning?.evidence.commitSha).toBe("41dcd0ea315515f63ea764225867ff569bc50316");
    expect(tuning?.evidence.sourceUrl).toBe("https://github.com/ajaykr0905/fault-tolerant-transformer-lab/blob/41dcd0ea315515f63ea764225867ff569bc50316/artifacts/tuning-comparison/result.json");
    expect(tuning?.evidence.ciUrl).toBe("https://github.com/ajaykr0905/fault-tolerant-transformer-lab/actions/runs/35731966039/job/106759520958");
    expect(tuning?.evidence.limitation).toContain("synthetic tokens; not a quality comparison");
  });

  it("exposes real-service recovery boundaries without claiming arbitrary worker kills", () => {
    const distributed = projects.find((project) => project.visualKey === "distributed");
    expect(distributed?.status).toBe("Runnable Lab");
    expect(distributed?.limitations.join(" ")).toContain("single-process memory-adapter functional run");
    expect(distributed?.decisions.map(({ detail }) => detail).join(" ")).toContain("SKIP LOCKED");
    expect(distributed?.evidenceLinks?.some(({ url }) => url.endsWith("/artifacts/2026-10-08-durable-results-v2.md"))).toBe(true);
    expect(distributed?.evidenceLinks).toEqual(expect.arrayContaining([
      expect.objectContaining({ url: "https://github.com/ajaykr0905/distributed-scale-validation-lab/blob/6cc588b72cb44258d65ea12e6f18ec281e9ea033/artifacts/2026-10-08-binary-inspection-v2.json" }),
    ]));
    expect(distributed?.failureModes.join(" ")).toContain("fault-helper subprocess exits");
    expect(distributed?.limitations.join(" ")).toContain("approximately 50 ms polling");
    expect(distributed?.metrics.map((metric) => metric.value)).toEqual(["12 / 12", "262.73 – 323.21", "95.43 – 151.08", "3.402 s"]);
    expect(distributed?.metrics.every(({ evidence }) => evidence.ciUrl === "https://github.com/ajaykr0905/distributed-scale-validation-lab/actions/runs/37741425446/job/113192773204")).toBe(true);
    expect(distributed?.metrics.every(({ evidence }) => evidence.commitSha === "0a03f985bb78a7a0889e541ece71672b74a73912")).toBe(true);
    expect(distributed?.metrics[0]?.evidence.command).toContain("6b01125cb71d49fc2fba1cf009aeb7d45e61cab6");
    expect(distributed?.metrics[1]?.evidence.limitation).toContain("do not demonstrate linear worker scaling");
    expect(distributed?.metrics[2]?.evidence.limitation).toContain("Not isolated SQL commit duration");
    expect(distributed?.metrics[3]?.evidence.limitation).toContain("different trial");
    expect(distributed?.replayScenarios.map((scenario) => scenario.id)).toEqual([
      "commit-before-ack",
      "outbox-recovery",
      "broker-restart",
    ]);
    expect(distributed?.replayScenarios.map((scenario) => scenario.label).join(" ")).not.toMatch(/kill/i);
    expect(distributed?.demoPath).toBe("/projects/distributed-scale-validation-platform#failure-replay");
    expect(distributed?.demoUrl).toBe("https://github.com/ajaykr0905/distributed-scale-validation-lab/blob/cf0ab0f93adc55f74fbdbcce2243dd6ecee3dd68/artifacts/2026-10-08-recovery-demo.mp4");
    expect(distributed?.limitations.join(" ")).toContain("separate trial from the v2 receipt");
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
