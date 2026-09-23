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
  METEOR_BURSTS_PER_LOOP,
  METEOR_DURATION_SECONDS,
  METEOR_HEAD_GLOW_RADIUS,
  METEORS_PER_BURST,
  METEORS_PER_LOOP,
  METEOR_TRAIL_PIXELS,
  meteorStateAtTime,
  MIN_METEOR_VIEWPORT_EDGE,
  STAR_DENSITY,
  STAR_CONNECTION_DISTANCE,
  starCountForWidth,
} from "@/lib/ambient-stars";
import {
  CONSTELLATION_ISLAND_MIN_WIDTH,
  CONSTELLATION_ISLAND_STAR_COUNT,
  CONSTELLATION_ISLANDS,
  reserveConstellationIslandStars,
} from "@/lib/constellation-islands";

describe("ambient constellation model", () => {
  it("places stars deterministically for a fixed seed", () => {
    expect(createSeededStars(12, 42)).toEqual(createSeededStars(12, 42));
    expect(createSeededStars(12, 42)).not.toEqual(createSeededStars(12, 43));
  });

  it("uses the declared responsive density caps", () => {
    expect(STAR_DENSITY).toEqual({ desktop: 216, tablet: 144, mobile: 80 });

    expect(starCountForWidth(360)).toBe(STAR_DENSITY.mobile);
    expect(starCountForWidth(680)).toBe(STAR_DENSITY.mobile);
    expect(starCountForWidth(681)).toBe(STAR_DENSITY.tablet);
    expect(starCountForWidth(1024)).toBe(STAR_DENSITY.tablet);
    expect(starCountForWidth(1025)).toBe(STAR_DENSITY.desktop);
    expect(starCountForWidth(1920)).toBe(STAR_DENSITY.desktop);
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
    const connections = createStarConnections(stars, 1440, 900, STAR_CONNECTION_DISTANCE, 2);
    const degree = new Array(stars.length).fill(0) as number[];

    expect(STAR_CONNECTION_DISTANCE).toBe(112);
    for (const connection of connections) {
      degree[connection.from] += 1;
      degree[connection.to] += 1;
      expect(connection.distance).toBeLessThanOrEqual(STAR_CONNECTION_DISTANCE);
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

  it("reserves existing wide-screen stars for four authored constellation islands", () => {
    const seeded = createSeededStars(STAR_DENSITY.desktop);
    const narrow = reserveConstellationIslandStars(seeded, CONSTELLATION_ISLAND_MIN_WIDTH - 1);
    const wide = reserveConstellationIslandStars(seeded, CONSTELLATION_ISLAND_MIN_WIDTH);

    expect(CONSTELLATION_ISLAND_STAR_COUNT).toBe(24);
    expect(CONSTELLATION_ISLANDS.map((island) => island.visualKey)).toEqual([
      "transformer",
      "distributed",
      "voicemed",
      "security",
    ]);
    expect(narrow.reservedCount).toBe(0);
    expect(narrow.connections).toEqual([]);
    expect(wide.stars).toHaveLength(STAR_DENSITY.desktop);
    expect(wide.reservedCount).toBe(CONSTELLATION_ISLAND_STAR_COUNT);
    expect(wide.connections.length).toBeGreaterThan(0);

    const degrees = new Array(wide.reservedCount).fill(0) as number[];
    for (const connection of wide.connections) {
      degrees[connection.from] += 1;
      degrees[connection.to] += 1;
    }
    expect(Math.max(...degrees)).toBeLessThanOrEqual(2);

    for (const connection of wide.connections) {
      const from = wide.stars[connection.from];
      const to = wide.stars[connection.to];
      const distanceAtUltraWide = Math.hypot(
        (from.x - to.x) * 3840,
        (from.y - to.y) * 2160,
      );
      expect(distanceAtUltraWide).toBeLessThanOrEqual(STAR_CONNECTION_DISTANCE);
    }

    for (let start = 0; start < wide.reservedCount; start += 6) {
      const islandStars = wide.stars.slice(start, start + 6);
      expect(new Set(islandStars.map((star) => star.phase)).size).toBe(1);
      expect(new Set(islandStars.map((star) => star.driftX)).size).toBe(1);
      expect(new Set(islandStars.map((star) => star.driftY)).size).toBe(1);
    }
  });

  it("keeps authored constellation nodes normalized and seamless at 72 seconds", () => {
    const field = reserveConstellationIslandStars(
      createSeededStars(STAR_DENSITY.desktop),
      CONSTELLATION_ISLAND_MIN_WIDTH,
    );

    for (const star of field.stars.slice(0, field.reservedCount)) {
      expect(star.x).toBeGreaterThanOrEqual(0);
      expect(star.x).toBeLessThanOrEqual(1);
      expect(star.y).toBeGreaterThanOrEqual(0);
      expect(star.y).toBeLessThanOrEqual(1);
      expect(ambientStarStateAtTime(star, 1920, 1080, CONSTELLATION_LOOP_SECONDS)).toEqual(
        ambientStarStateAtTime(star, 1920, 1080, 0),
      );
    }
  });
});

describe("ambient meteor model", () => {
  it("creates the same six-pair schedule for the same seed", () => {
    const schedule = createMeteorSchedule(METEORS_PER_LOOP, 42);

    expect(METEOR_BURSTS_PER_LOOP).toBe(6);
    expect(METEORS_PER_BURST).toBe(2);
    expect(METEORS_PER_LOOP).toBe(12);
    expect(schedule).toHaveLength(METEORS_PER_LOOP);
    expect(schedule).toEqual(createMeteorSchedule(METEORS_PER_LOOP, 42));
    expect(schedule).not.toEqual(createMeteorSchedule(METEORS_PER_LOOP, 43));
  });

  it("runs exactly two simultaneous, opposing meteors in each burst", () => {
    const schedule = createMeteorSchedule();
    const burstIndexes = new Set(schedule.map((meteor) => meteor.burstIndex));

    expect(burstIndexes.size).toBe(METEOR_BURSTS_PER_LOOP);
    for (const burstIndex of burstIndexes) {
      const burst = schedule.filter((meteor) => meteor.burstIndex === burstIndex);
      expect(burst).toHaveLength(METEORS_PER_BURST);
      expect(new Set(burst.map((meteor) => meteor.lane))).toEqual(new Set(["upper", "lower"]));
      expect(burst[0].startsAt).toBe(burst[1].startsAt);
      expect(burst[0].duration).toBe(burst[1].duration);

      const firstDirection = {
        x: burst[0].endX - burst[0].startX,
        y: burst[0].endY - burst[0].startY,
      };
      const secondDirection = {
        x: burst[1].endX - burst[1].startX,
        y: burst[1].endY - burst[1].startY,
      };
      const crossProduct = firstDirection.x * secondDirection.y
        - firstDirection.y * secondDirection.x;
      const dotProduct = firstDirection.x * secondDirection.x
        + firstDirection.y * secondDirection.y;

      expect(Math.sign(firstDirection.x)).toBe(-Math.sign(secondDirection.x));
      expect(crossProduct).toBeCloseTo(0, 12);
      expect(dotProduct).toBeLessThan(0);
    }
  });

  it("keeps simultaneous paths in nonintersecting upper and lower lanes", () => {
    const schedule = createMeteorSchedule();

    for (let burstIndex = 0; burstIndex < METEOR_BURSTS_PER_LOOP; burstIndex += 1) {
      const burst = schedule.filter((meteor) => meteor.burstIndex === burstIndex);
      const upper = burst.find((meteor) => meteor.lane === "upper");
      const lower = burst.find((meteor) => meteor.lane === "lower");
      expect(upper).toBeDefined();
      expect(lower).toBeDefined();
      if (!upper || !lower) continue;

      const upperPathBottom = Math.max(upper.startY, upper.endY);
      const lowerPathTop = Math.min(lower.startY, lower.endY);
      const directionX = upper.endX - upper.startX;
      const directionY = upper.endY - upper.startY;
      const offsetX = lower.startX - upper.startX;
      const offsetY = lower.startY - upper.startY;
      const supportingLineCrossProduct = directionX * offsetY - directionY * offsetX;
      expect(upperPathBottom).toBeLessThan(lowerPathTop);
      expect(lowerPathTop - upperPathBottom).toBeGreaterThanOrEqual(0.3);
      expect(Math.abs(supportingLineCrossProduct)).toBeGreaterThan(0.3);

      for (const [width, height] of [
        [MIN_METEOR_VIEWPORT_EDGE, MIN_METEOR_VIEWPORT_EDGE],
        [MIN_METEOR_VIEWPORT_EDGE, 10_000],
        [10_000, MIN_METEOR_VIEWPORT_EDGE],
      ] as const) {
        const scaledDirectionX = directionX * width;
        const scaledDirectionY = directionY * height;
        const scaledOffsetX = offsetX * width;
        const scaledOffsetY = offsetY * height;
        const lineDistance = Math.abs(
          scaledDirectionX * scaledOffsetY - scaledDirectionY * scaledOffsetX,
        ) / Math.hypot(scaledDirectionX, scaledDirectionY);

        expect(lineDistance).toBeGreaterThan(METEOR_HEAD_GLOW_RADIUS * 2);
      }
    }
  });

  it("keeps bursts separated, slow, and away from the loop seam", () => {
    const schedule = createMeteorSchedule();
    const bursts = Array.from({ length: METEOR_BURSTS_PER_LOOP }, (_, burstIndex) => (
      schedule.filter((meteor) => meteor.burstIndex === burstIndex)
    ));

    expect(METEOR_DURATION_SECONDS).toEqual({ minimum: 2.8, maximum: 3.6 });
    for (const [index, burst] of bursts.entries()) {
      const meteor = burst[0];
      expect(meteor.duration).toBeGreaterThanOrEqual(METEOR_DURATION_SECONDS.minimum);
      expect(meteor.duration).toBeLessThanOrEqual(METEOR_DURATION_SECONDS.maximum);
      expect(meteor.startsAt).toBeGreaterThan(0);
      expect(meteor.startsAt + meteor.duration).toBeLessThan(CONSTELLATION_LOOP_SECONDS);
      if (index > 0) {
        const previous = bursts[index - 1][0];
        expect(meteor.startsAt - (previous.startsAt + previous.duration)).toBeGreaterThanOrEqual(7.2);
      }
    }

    const first = bursts[0][0];
    const last = bursts[bursts.length - 1][0];
    const cyclicSeamGap = CONSTELLATION_LOOP_SECONDS + first.startsAt - (last.startsAt + last.duration);
    expect(cyclicSeamGap).toBeGreaterThanOrEqual(7.2);
  });

  it("never renders more than one two-meteor burst at once", () => {
    const schedule = createMeteorSchedule();

    for (let burstIndex = 0; burstIndex < METEOR_BURSTS_PER_LOOP; burstIndex += 1) {
      const burst = schedule.filter((meteor) => meteor.burstIndex === burstIndex);
      const midpoint = burst[0].startsAt + burst[0].duration / 2;
      expect(schedule.filter((meteor) => meteorStateAtTime(meteor, 1440, 900, midpoint))).toHaveLength(2);
    }

    let maximumActive = 0;
    for (let elapsed = 0; elapsed <= CONSTELLATION_LOOP_SECONDS; elapsed += 0.05) {
      const activeCount = schedule.filter((meteor) => (
        meteorStateAtTime(meteor, 1440, 900, elapsed) !== null
      )).length;
      maximumActive = Math.max(maximumActive, activeCount);
      expect(activeCount).toBeLessThanOrEqual(METEORS_PER_BURST);
    }
    expect(maximumActive).toBe(METEORS_PER_BURST);
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
    const meteor = createMeteorSchedule(2, 7)[0];
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
    const meteor = createMeteorSchedule(2, 21)[0];
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
    expect(meteorStateAtTime(meteor, 1440, 900, CONSTELLATION_LOOP_SECONDS * 2)).toBeNull();
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
    expect(() => createMeteorSchedule(1)).toThrow(RangeError);
    expect(() => createMeteorSchedule(3)).toThrow(RangeError);
    expect(() => createMeteorSchedule(MAX_METEORS_PER_LOOP - 1)).toThrow(RangeError);
    expect(() => createMeteorSchedule(MAX_METEORS_PER_LOOP + 1)).toThrow(RangeError);
    expect(() => createMeteorSchedule(MAX_METEORS_PER_LOOP + 2)).toThrow(RangeError);
    expect(createMeteorSchedule(0)).toEqual([]);
    expect(() => meteorStateAtTime(createMeteorSchedule(2)[0], 100, 100, Number.NaN)).toThrow(RangeError);
  });
});
