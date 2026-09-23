export const STAR_DENSITY = {
  desktop: 216,
  tablet: 144,
  mobile: 80,
} as const;

export const DEFAULT_STAR_SEED = 0x41504a59;
export const CONSTELLATION_LOOP_SECONDS = 72;
export const AMBIENT_FRAME_RATE = 30;
export const MAX_AMBIENT_PIXEL_RATIO = 1.5;
export const STAR_CONNECTION_DISTANCE = 112;
export const DEFAULT_METEOR_SEED = 0x4d455445;
export const METEORS_PER_BURST = 2;
export const METEOR_BURSTS_PER_LOOP = 6;
export const METEORS_PER_LOOP = METEORS_PER_BURST * METEOR_BURSTS_PER_LOOP;
export const MAX_METEORS_PER_LOOP = 12;
export const METEOR_DURATION_SECONDS = {
  minimum: 2.8,
  maximum: 3.6,
} as const;
export const METEOR_HEAD_GLOW_RADIUS = 9;
export const MIN_METEOR_VIEWPORT_EDGE = 48;
export const METEOR_TRAIL_PIXELS = {
  minimum: 56,
  maximum: 148,
} as const;

export type StarDepth = 0 | 1 | 2;

export type AmbientStar = {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  phase: number;
  driftX: number;
  driftY: number;
  depth: StarDepth;
};

export type AmbientStarState = {
  x: number;
  y: number;
  radius: number;
  alpha: number;
};

export type StarConnection = {
  from: number;
  to: number;
  distance: number;
};

export type AmbientMeteor = {
  burstIndex: number;
  lane: "upper" | "lower";
  startsAt: number;
  duration: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  trailScale: number;
  alpha: number;
};

export type AmbientMeteorState = {
  headX: number;
  headY: number;
  tailX: number;
  tailY: number;
  alpha: number;
};

function mulberry32(seed: number) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
}

const DEPTH_BEHAVIOR = [
  { radius: 0.76, alpha: 0.72, drift: 0.5, orbitTurns: 1, twinkleTurns: 2 },
  { radius: 0.96, alpha: 0.86, drift: 0.76, orbitTurns: 2, twinkleTurns: 3 },
  { radius: 1.15, alpha: 1, drift: 1, orbitTurns: 3, twinkleTurns: 4 },
] as const;

// Both routes in a burst span the viewport in exactly antiparallel directions
// while remaining inside disjoint upper and lower sky lanes. The vertical gap
// means the complete path segments (and their collinear trails) cannot intersect.
const METEOR_ROUTE_PAIRS = [
  [
    { startX: -0.14, startY: 0.08, endX: 1.14, endY: 0.3 },
    { startX: 1.14, startY: 0.92, endX: -0.14, endY: 0.7 },
  ],
  [
    { startX: 1.14, startY: 0.1, endX: -0.14, endY: 0.32 },
    { startX: -0.14, startY: 0.9, endX: 1.14, endY: 0.68 },
  ],
  [
    { startX: -0.14, startY: 0.32, endX: 1.14, endY: 0.08 },
    { startX: 1.14, startY: 0.68, endX: -0.14, endY: 0.92 },
  ],
  [
    { startX: 1.14, startY: 0.3, endX: -0.14, endY: 0.08 },
    { startX: -0.14, startY: 0.68, endX: 1.14, endY: 0.9 },
  ],
] as const;

function loopTime(seconds: number) {
  if (!Number.isFinite(seconds)) {
    throw new RangeError("Elapsed time must be finite.");
  }

  return ((seconds % CONSTELLATION_LOOP_SECONDS) + CONSTELLATION_LOOP_SECONDS) % CONSTELLATION_LOOP_SECONDS;
}

export function starCountForWidth(width: number) {
  if (width <= 680) return STAR_DENSITY.mobile;
  if (width <= 1024) return STAR_DENSITY.tablet;
  return STAR_DENSITY.desktop;
}

export function cappedCanvasPixelRatio(devicePixelRatio: number) {
  if (!Number.isFinite(devicePixelRatio) || devicePixelRatio <= 0) return 1;
  return Math.min(devicePixelRatio, MAX_AMBIENT_PIXEL_RATIO);
}

export function createSeededStars(count: number, seed = DEFAULT_STAR_SEED): AmbientStar[] {
  if (!Number.isInteger(count) || count < 0) {
    throw new RangeError("Star count must be a non-negative integer.");
  }

  const random = mulberry32(seed);
  return Array.from({ length: count }, (_, index) => ({
    x: random(),
    y: random(),
    radius: 0.65 + random() * 1.2,
    alpha: 0.34 + random() * 0.5,
    phase: random() * Math.PI * 2,
    driftX: (random() - 0.5) * 18,
    driftY: (random() - 0.5) * 14,
    depth: (index % 3) as StarDepth,
  }));
}

/**
 * Resolves a star's complete drawable state at a point in the shared loop.
 * The modulo-normalized clock makes the returned state byte-for-byte stable
 * at the beginning and end of every 72-second cycle.
 */
export function ambientStarStateAtTime(
  star: AmbientStar,
  width: number,
  height: number,
  elapsedSeconds: number,
): AmbientStarState {
  const behavior = DEPTH_BEHAVIOR[star.depth];
  const progress = loopTime(elapsedSeconds) / CONSTELLATION_LOOP_SECONDS;
  const orbitAngle = progress * Math.PI * 2 * behavior.orbitTurns + star.phase;
  const twinkleAngle = progress * Math.PI * 2 * behavior.twinkleTurns + star.phase;
  const twinkle = 0.82 + Math.sin(twinkleAngle) * 0.18;

  return {
    x: star.x * width + Math.sin(orbitAngle) * star.driftX * behavior.drift,
    y: star.y * height + Math.cos(orbitAngle) * star.driftY * behavior.drift,
    radius: star.radius * behavior.radius,
    alpha: star.alpha * behavior.alpha * twinkle,
  };
}

/**
 * Creates a sparse, repeatable meteor timetable for the shared 72-second loop.
 * Every burst has exactly two simultaneous, lane-separated meteors. Bursts use
 * separate time slots so no more than one pair is visible at once.
 */
export function createMeteorSchedule(
  count = METEORS_PER_LOOP,
  seed = DEFAULT_METEOR_SEED,
): AmbientMeteor[] {
  if (
    !Number.isInteger(count)
    || count < 0
    || count > MAX_METEORS_PER_LOOP
    || count % METEORS_PER_BURST !== 0
  ) {
    throw new RangeError(
      `Meteor count must be an even integer between 0 and ${MAX_METEORS_PER_LOOP}.`,
    );
  }
  if (count === 0) return [];

  const random = mulberry32(seed);
  const burstCount = count / METEORS_PER_BURST;
  const slotSeconds = CONSTELLATION_LOOP_SECONDS / burstCount;
  const routeOffset = Math.floor(random() * METEOR_ROUTE_PAIRS.length);

  return Array.from({ length: burstCount }, (_, burstIndex) => {
    const routes = METEOR_ROUTE_PAIRS[(routeOffset + burstIndex) % METEOR_ROUTE_PAIRS.length];
    const offsetX = (random() - 0.5) * 0.04;
    const offsetY = (random() - 0.5) * 0.04;
    const startsAt = burstIndex * slotSeconds + slotSeconds * (0.22 + random() * 0.1);
    const duration = METEOR_DURATION_SECONDS.minimum
      + random() * (METEOR_DURATION_SECONDS.maximum - METEOR_DURATION_SECONDS.minimum);

    return routes.map((route, laneIndex) => ({
      burstIndex,
      lane: laneIndex === 0 ? "upper" as const : "lower" as const,
      startsAt,
      duration,
      startX: route.startX + offsetX,
      startY: route.startY + offsetY,
      endX: route.endX + offsetX,
      endY: route.endY + offsetY,
      trailScale: 0.06 + random() * 0.025,
      alpha: 0.72 + random() * 0.16,
    }));
  }).flat();
}

/** Resolves a meteor's head, capped trail, and fade at a loop-relative time. */
export function meteorStateAtTime(
  meteor: AmbientMeteor,
  width: number,
  height: number,
  elapsedSeconds: number,
): AmbientMeteorState | null {
  const elapsedInLoop = loopTime(elapsedSeconds);
  const activeElapsed = elapsedInLoop - meteor.startsAt;
  if (activeElapsed < 0 || activeElapsed >= meteor.duration) return null;

  const progress = activeElapsed / meteor.duration;
  const headX = (meteor.startX + (meteor.endX - meteor.startX) * progress) * width;
  const headY = (meteor.startY + (meteor.endY - meteor.startY) * progress) * height;
  const trajectoryX = (meteor.endX - meteor.startX) * width;
  const trajectoryY = (meteor.endY - meteor.startY) * height;
  const trajectoryLength = Math.hypot(trajectoryX, trajectoryY);
  if (trajectoryLength === 0) return null;

  const fadeIn = Math.min(1, progress / 0.14);
  const fadeOut = Math.min(1, (1 - progress) / 0.22);
  const trailLength = Math.min(
    METEOR_TRAIL_PIXELS.maximum,
    Math.max(METEOR_TRAIL_PIXELS.minimum, Math.hypot(width, height) * meteor.trailScale),
  ) * fadeIn;

  return {
    headX,
    headY,
    tailX: headX - (trajectoryX / trajectoryLength) * trailLength,
    tailY: headY - (trajectoryY / trajectoryLength) * trailLength,
    alpha: meteor.alpha * Math.min(fadeIn, fadeOut),
  };
}

export function createStarConnections(
  stars: AmbientStar[],
  width: number,
  height: number,
  maximumDistance = STAR_CONNECTION_DISTANCE,
  maximumConnections = 2,
): StarConnection[] {
  if (maximumDistance <= 0 || maximumConnections <= 0) return [];

  const candidates: StarConnection[] = [];
  for (let from = 0; from < stars.length; from += 1) {
    for (let to = from + 1; to < stars.length; to += 1) {
      const deltaX = (stars[from].x - stars[to].x) * width;
      const deltaY = (stars[from].y - stars[to].y) * height;
      const distance = Math.hypot(deltaX, deltaY);
      if (distance <= maximumDistance) candidates.push({ from, to, distance });
    }
  }

  candidates.sort((left, right) => left.distance - right.distance || left.from - right.from || left.to - right.to);
  const degree = new Uint8Array(stars.length);
  const connections: StarConnection[] = [];

  for (const candidate of candidates) {
    if (degree[candidate.from] >= maximumConnections || degree[candidate.to] >= maximumConnections) continue;
    degree[candidate.from] += 1;
    degree[candidate.to] += 1;
    connections.push(candidate);
  }

  return connections;
}
