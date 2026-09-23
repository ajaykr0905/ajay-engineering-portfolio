export const STAR_DENSITY = {
  desktop: 96,
  tablet: 64,
  mobile: 36,
} as const;

export const DEFAULT_STAR_SEED = 0x41504a59;

export type AmbientStar = {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  phase: number;
  driftX: number;
  driftY: number;
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
  return Array.from({ length: count }, () => ({
    x: random(),
    y: random(),
    radius: 0.55 + random() * 1.15,
    alpha: 0.2 + random() * 0.52,
    phase: random() * Math.PI * 2,
    driftX: (random() - 0.5) * 2.4,
    driftY: (random() - 0.5) * 1.8,
  }));
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
