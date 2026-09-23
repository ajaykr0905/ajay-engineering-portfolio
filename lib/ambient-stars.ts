export const STAR_DENSITY = {
  desktop: 128,
  tablet: 80,
  mobile: 48,
} as const;

export const DEFAULT_STAR_SEED = 0x41504a59;
export const CONSTELLATION_LOOP_SECONDS = 72;

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
  { radius: 0.72, alpha: 0.58, drift: 0.5, orbitTurns: 1, twinkleTurns: 2 },
  { radius: 0.9, alpha: 0.78, drift: 0.76, orbitTurns: 2, twinkleTurns: 3 },
  { radius: 1.08, alpha: 1, drift: 1, orbitTurns: 3, twinkleTurns: 4 },
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

export function createSeededStars(count: number, seed = DEFAULT_STAR_SEED): AmbientStar[] {
  if (!Number.isInteger(count) || count < 0) {
    throw new RangeError("Star count must be a non-negative integer.");
  }

  const random = mulberry32(seed);
  return Array.from({ length: count }, (_, index) => ({
    x: random(),
    y: random(),
    radius: 0.55 + random() * 1.15,
    alpha: 0.2 + random() * 0.52,
    phase: random() * Math.PI * 2,
    driftX: (random() - 0.5) * 12,
    driftY: (random() - 0.5) * 9,
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
  const twinkle = 0.78 + Math.sin(twinkleAngle) * 0.22;

  return {
    x: star.x * width + Math.sin(orbitAngle) * star.driftX * behavior.drift,
    y: star.y * height + Math.cos(orbitAngle) * star.driftY * behavior.drift,
    radius: star.radius * behavior.radius,
    alpha: star.alpha * behavior.alpha * twinkle,
  };
}

export function createStarConnections(
  stars: AmbientStar[],
  width: number,
  height: number,
  maximumDistance = 120,
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
