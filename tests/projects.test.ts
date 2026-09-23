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
    expect(projects.map((project) => project.visualKey)).toEqual(["transformer", "distributed", "voicemed"]);
    expect(projectVisualKeySchema.safeParse("security").success).toBe(false);
  });

  it("does not publish a metric without a method", () => {
    for (const metric of projects.flatMap((project) => project.metrics)) {
      expect(metric.method.trim().length).toBeGreaterThan(20);
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
      expect(metric.evidenceUrl).toMatch(/^https:\/\/github\.com\/ajaykr0905\//);
    }
  });
});
