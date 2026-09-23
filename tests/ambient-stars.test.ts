import { describe, expect, it } from "vitest";
import {
  ambientStarStateAtTime,
  CONSTELLATION_LOOP_SECONDS,
  createSeededStars,
  createStarConnections,
  STAR_DENSITY,
  starCountForWidth,
} from "@/lib/ambient-stars";

describe("ambient constellation model", () => {
  it("places stars deterministically for a fixed seed", () => {
    expect(createSeededStars(12, 42)).toEqual(createSeededStars(12, 42));
    expect(createSeededStars(12, 42)).not.toEqual(createSeededStars(12, 43));
  });

  it("uses the declared responsive density caps", () => {
    expect(STAR_DENSITY).toEqual({ desktop: 128, tablet: 80, mobile: 48 });
    expect(starCountForWidth(390)).toBe(STAR_DENSITY.mobile);
    expect(starCountForWidth(800)).toBe(STAR_DENSITY.tablet);
    expect(starCountForWidth(1440)).toBe(STAR_DENSITY.desktop);
  });

  it("keeps generated values within their normalized contracts", () => {
    const stars = createSeededStars(STAR_DENSITY.desktop);
    expect(stars).toHaveLength(STAR_DENSITY.desktop);
    expect(new Set(stars.map((star) => star.depth))).toEqual(new Set([0, 1, 2]));
    for (const star of stars) {
      expect(star.x).toBeGreaterThanOrEqual(0);
      expect(star.x).toBeLessThan(1);
      expect(star.y).toBeGreaterThanOrEqual(0);
      expect(star.y).toBeLessThan(1);
      expect(star.radius).toBeGreaterThan(0);
      expect(star.alpha).toBeGreaterThan(0);
      expect(star.alpha).toBeLessThanOrEqual(1);
    }
  });

  it("limits every star to two nearby connections", () => {
    const stars = createSeededStars(STAR_DENSITY.desktop, 7);
    const connections = createStarConnections(stars, 1440, 900, 120, 2);
    const degree = new Array(stars.length).fill(0) as number[];

    for (const connection of connections) {
      degree[connection.from] += 1;
      degree[connection.to] += 1;
      expect(connection.distance).toBeLessThanOrEqual(120);
    }

    expect(Math.max(...degree)).toBeLessThanOrEqual(2);
  });

  it("returns the identical position and appearance at both ends of the loop", () => {
    const star = createSeededStars(1, 42)[0];
    const initial = ambientStarStateAtTime(star, 1440, 900, 0);

    expect(ambientStarStateAtTime(star, 1440, 900, CONSTELLATION_LOOP_SECONDS)).toEqual(initial);
    expect(ambientStarStateAtTime(star, 1440, 900, CONSTELLATION_LOOP_SECONDS * 2)).toEqual(initial);
    expect(ambientStarStateAtTime(star, 1440, 900, CONSTELLATION_LOOP_SECONDS / 2)).not.toEqual(initial);
  });

  it("keeps every animated state finite and visible", () => {
    for (const star of createSeededStars(STAR_DENSITY.desktop)) {
      const state = ambientStarStateAtTime(star, 1440, 900, 31.25);
      expect(Number.isFinite(state.x)).toBe(true);
      expect(Number.isFinite(state.y)).toBe(true);
      expect(state.radius).toBeGreaterThan(0);
      expect(state.alpha).toBeGreaterThan(0);
      expect(state.alpha).toBeLessThanOrEqual(1);
    }
  });

  it("rejects invalid density requests", () => {
    expect(() => createSeededStars(-1)).toThrow(RangeError);
    expect(() => createSeededStars(1.5)).toThrow(RangeError);
    expect(() => ambientStarStateAtTime(createSeededStars(1)[0], 100, 100, Number.NaN)).toThrow(RangeError);
  });
});
