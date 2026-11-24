import { describe, expect, it } from "vitest";
import { experience } from "@/lib/experience";
import { PUBLIC_SAFE_DENYLIST } from "./public-safe";

describe("experience outcomes", () => {
  it("credits the Software Engineer II role with the AI-assisted SDLC outcome", () => {
    const softwareEngineerII = experience.find((item) => item.role === "Software Engineer II");
    expect(softwareEngineerII).toBeDefined();
    expect(
      softwareEngineerII?.outcomes.some(
        (outcome) => outcome.includes("AI-assisted") && outcome.includes("vulnerability remediation"),
      ),
    ).toBe(true);
  });

  it("keeps every outcome free of internal identifiers", () => {
    for (const outcome of experience.flatMap((item) => item.outcomes)) {
      expect(outcome).not.toMatch(PUBLIC_SAFE_DENYLIST);
    }
  });
});
