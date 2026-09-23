import { describe, expect, it } from "vitest";
import {
  AMBIENT_FRAME_RATE,
  ambientStarStateAtTime,
  cappedCanvasPixelRatio,
  CONSTELLATION_LOOP_SECONDS,
  createMeteorSchedule,
  createSeededStars,
  createStarConnections,
  MAX_AMBIENT_PIXEL_RATIO,
  MAX_METEORS_PER_LOOP,
  METEORS_PER_LOOP,
  METEOR_TRAIL_PIXELS,
  meteorStateAtTime,
  STAR_DENSITY,
  starCountForWidth,
} from "@/lib/ambient-stars";

describe("ambient constellation model", () => {
  it("places stars deterministically for a fixed seed", () => {
    expect(createSeededStars(12, 42)).toEqual(createSeededStars(12, 42));
    expect(createSeededStars(12, 42)).not.toEqual(createSeededStars(12, 43));
  });

  it("uses the declared responsive density caps", () => {
    expect(STAR_DENSITY).toEqual({ desktop: 144, tablet: 96, mobile: 56 });
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

describe("ambient meteor model", () => {
  it("creates the same sparse schedule for the same seed", () => {
    const schedule = createMeteorSchedule(METEORS_PER_LOOP, 42);

    expect(schedule).toHaveLength(METEORS_PER_LOOP);
    expect(schedule).toEqual(createMeteorSchedule(METEORS_PER_LOOP, 42));
    expect(schedule).not.toEqual(createMeteorSchedule(METEORS_PER_LOOP, 43));
  });

  it("keeps events separated and away from the loop seam", () => {
    const schedule = createMeteorSchedule();

    for (const [index, meteor] of schedule.entries()) {
      expect(meteor.startsAt).toBeGreaterThan(0);
      expect(meteor.startsAt + meteor.duration).toBeLessThan(CONSTELLATION_LOOP_SECONDS);
      if (index > 0) {
        const previous = schedule[index - 1];
        expect(meteor.startsAt).toBeGreaterThan(previous.startsAt + previous.duration);
      }
    }
  });

  it("cycles through all four travel quadrants", () => {
    const quadrants = new Set(
      createMeteorSchedule().map((meteor) => (
        `${Math.sign(meteor.endX - meteor.startX)},${Math.sign(meteor.endY - meteor.startY)}`
      )),
    );

    expect(quadrants).toEqual(new Set(["1,1", "-1,1", "-1,-1", "1,-1"]));
  });

  it("places the trail directly behind the moving head", () => {
    const meteor = createMeteorSchedule(1, 7)[0];
    const state = meteorStateAtTime(meteor, 1440, 900, meteor.startsAt + meteor.duration / 2);
    expect(state).not.toBeNull();
    if (!state) return;

    expect(state.headX).toBeCloseTo(((meteor.startX + meteor.endX) / 2) * 1440, 8);
    expect(state.headY).toBeCloseTo(((meteor.startY + meteor.endY) / 2) * 900, 8);
    expect(state.alpha).toBeCloseTo(meteor.alpha, 8);

    const trailX = state.headX - state.tailX;
    const trailY = state.headY - state.tailY;
    const trajectoryX = (meteor.endX - meteor.startX) * 1440;
    const trajectoryY = (meteor.endY - meteor.startY) * 900;
    const alignment = (trailX * trajectoryX + trailY * trajectoryY)
      / (Math.hypot(trailX, trailY) * Math.hypot(trajectoryX, trajectoryY));

    expect(alignment).toBeCloseTo(1, 10);
    expect(Math.hypot(trailX, trailY)).toBeGreaterThanOrEqual(METEOR_TRAIL_PIXELS.minimum);
    expect(Math.hypot(trailX, trailY)).toBeLessThanOrEqual(METEOR_TRAIL_PIXELS.maximum);
  });

  it("caps trail geometry on both tiny and very large viewports", () => {
    const meteor = createMeteorSchedule(1, 21)[0];
    const sampleTime = meteor.startsAt + meteor.duration / 2;
    const tiny = meteorStateAtTime(meteor, 10, 10, sampleTime);
    const huge = meteorStateAtTime(meteor, 10_000, 10_000, sampleTime);

    expect(tiny).not.toBeNull();
    expect(huge).not.toBeNull();
    if (!tiny || !huge) return;
    expect(Math.hypot(tiny.headX - tiny.tailX, tiny.headY - tiny.tailY)).toBeCloseTo(METEOR_TRAIL_PIXELS.minimum, 8);
    expect(Math.hypot(huge.headX - huge.tailX, huge.headY - huge.tailY)).toBeCloseTo(METEOR_TRAIL_PIXELS.maximum, 8);
  });

  it("repeats active geometry and its empty seam every full loop", () => {
    const meteor = createMeteorSchedule()[0];
    const sampleTime = meteor.startsAt + meteor.duration / 2;
    const initial = meteorStateAtTime(meteor, 1440, 900, sampleTime);
    const repeated = meteorStateAtTime(meteor, 1440, 900, sampleTime + CONSTELLATION_LOOP_SECONDS);

    expect(initial).not.toBeNull();
    expect(repeated).not.toBeNull();
    if (!initial || !repeated) return;
    expect(repeated.headX).toBeCloseTo(initial.headX, 8);
    expect(repeated.headY).toBeCloseTo(initial.headY, 8);
    expect(repeated.tailX).toBeCloseTo(initial.tailX, 8);
    expect(repeated.tailY).toBeCloseTo(initial.tailY, 8);
    expect(repeated.alpha).toBeCloseTo(initial.alpha, 8);
    expect(meteorStateAtTime(meteor, 1440, 900, 0)).toBeNull();
    expect(meteorStateAtTime(meteor, 1440, 900, CONSTELLATION_LOOP_SECONDS)).toBeNull();
  });

  it("retains the frame, pixel-density, and schedule complexity caps", () => {
    expect(AMBIENT_FRAME_RATE).toBe(30);
    expect(cappedCanvasPixelRatio(3)).toBe(MAX_AMBIENT_PIXEL_RATIO);
    expect(cappedCanvasPixelRatio(1)).toBe(1);
    expect(cappedCanvasPixelRatio(Number.NaN)).toBe(1);
    expect(METEORS_PER_LOOP).toBeLessThanOrEqual(MAX_METEORS_PER_LOOP);
  });

  it("rejects invalid schedules and clocks", () => {
    expect(() => createMeteorSchedule(-1)).toThrow(RangeError);
    expect(() => createMeteorSchedule(1.5)).toThrow(RangeError);
    expect(() => createMeteorSchedule(MAX_METEORS_PER_LOOP + 1)).toThrow(RangeError);
    expect(() => meteorStateAtTime(createMeteorSchedule(1)[0], 100, 100, Number.NaN)).toThrow(RangeError);
  });
});
