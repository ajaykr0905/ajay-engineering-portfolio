import type { AmbientStar } from "@/lib/ambient-stars";
import type { ProjectVisualKey } from "@/lib/projects";

export const CONSTELLATION_ISLAND_MIN_WIDTH = 1500;

type IslandNode = {
  x: number;
  y: number;
};

type IslandDefinition = {
  visualKey: ProjectVisualKey;
  nodes: readonly IslandNode[];
  edges: readonly (readonly [number, number])[];
};

export type AuthoredIslandConnection = {
  from: number;
  to: number;
  visualKey: ProjectVisualKey;
};

// These live only in wide-screen gutters. They use twenty-four stars already
// included in STAR_DENSITY rather than adding more particles to the scene.
export const CONSTELLATION_ISLANDS: readonly IslandDefinition[] = [
  {
    visualKey: "transformer",
    nodes: [
      { x: 0.95, y: 0.145 },
      { x: 0.972, y: 0.165 },
      { x: 0.973, y: 0.21 },
      { x: 0.95, y: 0.235 },
      { x: 0.927, y: 0.21 },
      { x: 0.927, y: 0.165 },
    ],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]],
  },
  {
    visualKey: "distributed",
    nodes: [
      { x: 0.055, y: 0.48 },
      { x: 0.078, y: 0.495 },
      { x: 0.079, y: 0.54 },
      { x: 0.055, y: 0.567 },
      { x: 0.031, y: 0.55 },
      { x: 0.031, y: 0.505 },
    ],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]],
  },
  {
    visualKey: "voicemed",
    nodes: [
      { x: 0.925, y: 0.8 },
      { x: 0.937, y: 0.77 },
      { x: 0.949, y: 0.81 },
      { x: 0.961, y: 0.765 },
      { x: 0.973, y: 0.805 },
      { x: 0.985, y: 0.78 },
    ],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]],
  },
  {
    visualKey: "security",
    nodes: [
      { x: 0.055, y: 0.77 },
      { x: 0.078, y: 0.79 },
      { x: 0.078, y: 0.825 },
      { x: 0.055, y: 0.845 },
      { x: 0.032, y: 0.825 },
      { x: 0.032, y: 0.79 },
    ],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]],
  },
] as const;

export const CONSTELLATION_ISLAND_STAR_COUNT = CONSTELLATION_ISLANDS.reduce(
  (total, island) => total + island.nodes.length,
  0,
);

export function reserveConstellationIslandStars(
  stars: AmbientStar[],
  viewportWidth: number,
): { stars: AmbientStar[]; connections: AuthoredIslandConnection[]; reservedCount: number } {
  if (viewportWidth < CONSTELLATION_ISLAND_MIN_WIDTH || stars.length < CONSTELLATION_ISLAND_STAR_COUNT) {
    return { stars, connections: [], reservedCount: 0 };
  }

  const positionedStars = [...stars];
  const connections: AuthoredIslandConnection[] = [];
  let starOffset = 0;

  for (const [islandIndex, island] of CONSTELLATION_ISLANDS.entries()) {
    const islandPhase = (islandIndex / CONSTELLATION_ISLANDS.length) * Math.PI * 2;
    island.nodes.forEach((node, nodeIndex) => {
      const original = stars[starOffset + nodeIndex];
      positionedStars[starOffset + nodeIndex] = {
        ...original,
        x: node.x,
        y: node.y,
        radius: 1.05 + (nodeIndex % 3) * 0.14,
        alpha: 0.58 + (nodeIndex % 2) * 0.12,
        phase: islandPhase,
        driftX: 4,
        driftY: 3,
        depth: 2,
      };
    });

    for (const [from, to] of island.edges) {
      connections.push({
        from: starOffset + from,
        to: starOffset + to,
        visualKey: island.visualKey,
      });
    }
    starOffset += island.nodes.length;
  }

  return {
    stars: positionedStars,
    connections,
    reservedCount: CONSTELLATION_ISLAND_STAR_COUNT,
  };
}
