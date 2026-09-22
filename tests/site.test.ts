import { describe, expect, it } from "vitest";
import { primaryNavigation, siteConfig, stack } from "@/lib/site";

describe("public identity", () => {
  it("uses the canonical GitHub identity", () => {
    expect(siteConfig.github).toBe("https://github.com/ajaykr0905");
  });

  it("keeps recruiter navigation concise", () => {
    expect(primaryNavigation.map((item) => item.label)).toEqual(["Projects", "Experience", "Writing", "Résumé"]);
  });

  it("states the selected engineering position", () => {
    expect(siteConfig.title).toBe("Distributed Systems and AI Infrastructure Engineer");
    expect(stack).toContain("Go");
    expect(stack).toContain("PyTorch");
  });
});
