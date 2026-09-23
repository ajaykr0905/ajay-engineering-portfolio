import { describe, expect, it } from "vitest";
import { isMotionPaused, parseMotionPreference } from "@/lib/motion";

describe("motion preference contract", () => {
  it("accepts only the persisted paused value", () => {
    expect(parseMotionPreference("paused")).toBe("paused");
    expect(parseMotionPreference("auto")).toBe("auto");
    expect(parseMotionPreference("unexpected")).toBe("auto");
    expect(parseMotionPreference(null)).toBe("auto");
  });

  it("lets the operating-system reduction override the stored preference", () => {
    expect(isMotionPaused("auto", true)).toBe(true);
    expect(isMotionPaused("paused", false)).toBe(true);
    expect(isMotionPaused("auto", false)).toBe(false);
  });
});
