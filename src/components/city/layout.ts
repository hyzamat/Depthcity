/**
 * Deterministic procedural layout for the scroll-built city.
 * Everything is generated once (seeded), so the build order is stable between reloads.
 */

export type Building = {
  x: number;
  z: number;
  w: number; // footprint (world units, tile = 1)
  d: number;
  h: number;
  color: [number, number, number];
  order: number; // 0..1 — when it appears during the scroll
  seed: number;
  spire?: boolean;
};
export type Road = { x: number; z: number; order: number };
export type Tree = { x: number; z: number; s: number; order: number; color: [number, number, number] };
/** A full-length road strip. rot 0 runs along x, rot π/2 along z. */
export type RoadLine = { x: number; z: number; rot: number; len: number; order: number };
export type Car = { line: number; lane: 1 | -1; speed: number; phase: number; color: [number, number, number] };
export type Boat = { radius: number; speed: number; phase: number; color: [number, number, number] };

export type CityLayout = {
  size: number;
  buildings: Building[];
  roads: Road[];
  roadLines: RoadLine[];
  trees: Tree[];
  cars: Car[];
  boats: Boat[];
  /** indices into buildings — the tallest towers, which get aviation lights */
  beacons: number[];
};

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const hex = (h: string): [number, number, number] => {
  const n = parseInt(h.slice(1), 16);
  // sRGB → linear-ish (the shader works in linear space)
  const c = (v: number) => Math.pow(v / 255, 2.2);
  return [c((n >> 16) & 255), c((n >> 8) & 255), c(n & 255)];
};

// Palette lifted from the logo: orange, blue, mint, green + neutrals.
const PALETTE: { c: [number, number, number]; w: number }[] = [
  { c: hex("#F5A524"), w: 16 },
  { c: hex("#FFC44D"), w: 8 },
  { c: hex("#3B82F6"), w: 18 },
  { c: hex("#8BC5FF"), w: 8 },
  { c: hex("#5EEAD4"), w: 10 },
  { c: hex("#A7F3E6"), w: 5 },
  { c: hex("#22C55E"), w: 8 },
  { c: hex("#4ADE80"), w: 6 },
  { c: hex("#E8E6E1"), w: 12 },
  { c: hex("#5B6B85"), w: 6 },
  { c: hex("#C9D6EA"), w: 5 },
];
const TOTAL_W = PALETTE.reduce((a, p) => a + p.w, 0);

function pickColor(r: number): [number, number, number] {
  let t = r * TOTAL_W;
  for (const p of PALETTE) {
    if (t < p.w) return p.c;
    t -= p.w;
  }
  return PALETTE[0].c;
}

const CAR_COLORS = ["#F3F4F6", "#F3F4F6", "#1F2937", "#DC2626", "#F5C242", "#3B82F6", "#9CA3AF", "#0EA5E9"].map(hex);

export function generateCity(seed = 7, carCount = 90): CityLayout {
  const rnd = mulberry32(seed);
  const N = 26; // tiles per side
  const half = (N - 1) / 2;
  const period = 4; // road every 4 tiles → 3×3 blocks
  const buildings: Building[] = [];
  const roads: Road[] = [];
  const trees: Tree[] = [];
  const maxD = Math.hypot(half, half);

  const jitter = () => (rnd() - 0.5) * 0.12;

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const x = i - half;
      const z = j - half;
      const d = Math.hypot(x, z) / maxD; // 0 centre → 1 corner
      const isRoad = i % period === 0 || j % period === 0;
      if (isRoad) {
        roads.push({ x, z, order: 0.04 + d * 0.28 + jitter() * 0.5 });
        continue;
      }
      const r = rnd();
      if (r < 0.8) {
        const falloff = 1 + 6 * Math.exp(-Math.pow(d / 0.42, 2));
        const base = 0.45 + rnd() * 1.1;
        let h = base * falloff;
        if (rnd() < 0.12) h *= 1.5; // occasional tower
        h = Math.min(h, 9);
        const w = 0.62 + rnd() * 0.26;
        const dd = 0.62 + rnd() * 0.26;
        buildings.push({
          x: x + (rnd() - 0.5) * 0.08,
          z: z + (rnd() - 0.5) * 0.08,
          w,
          d: dd,
          h,
          color: pickColor(rnd()),
          order: 0.16 + d * 0.5 + jitter(),
          seed: rnd() * 100,
        });
      } else {
        // a small grove
        const count = 1 + Math.floor(rnd() * 3);
        for (let k = 0; k < count; k++) {
          const g = 0.35 + rnd() * 0.3;
          trees.push({
            x: x + (rnd() - 0.5) * 0.6,
            z: z + (rnd() - 0.5) * 0.6,
            s: 0.55 + rnd() * 0.5,
            order: 0.3 + d * 0.45 + rnd() * 0.08,
            color: [0.05 + rnd() * 0.05, g * 0.35, 0.04 + rnd() * 0.03],
          });
        }
      }
    }
  }

  // Landmark spires (the Burj-style centrepiece and two companions) — they rise last.
  const spires: Array<[number, number, number, string]> = [
    [1.5, 1.5, 12.5, "#DCEBFF"],
    [-2.5, 2.5, 8.5, "#5EEAD4"],
    [2.5, -2.5, 7.2, "#F5A524"],
  ];
  for (const [sx, sz, sh, col] of spires) {
    // remove whatever sits on those tiles
    for (let b = buildings.length - 1; b >= 0; b--) {
      if (Math.abs(buildings[b].x - sx) < 0.6 && Math.abs(buildings[b].z - sz) < 0.6) buildings.splice(b, 1);
    }
    buildings.push({ x: sx, z: sz, w: 0.55, d: 0.55, h: sh, color: hex(col), order: 0.62 + rnd() * 0.08, seed: rnd() * 100, spire: true });
  }

  // Full-length road strips, drawn from the centre outwards.
  const roadLines: RoadLine[] = [];
  for (let i = 0; i < N; i += period) {
    const c = i - half;
    roadLines.push({ x: 0, z: c, rot: 0, len: N, order: 0.02 + (Math.abs(c) / half) * 0.16 });
    roadLines.push({ x: c, z: 0, rot: Math.PI / 2, len: N, order: 0.04 + (Math.abs(c) / half) * 0.16 });
  }

  const cars: Car[] = [];
  for (let k = 0; k < carCount; k++) {
    cars.push({
      line: Math.floor(rnd() * roadLines.length),
      lane: rnd() < 0.5 ? 1 : -1,
      speed: 1.1 + rnd() * 1.5,
      phase: rnd() * N,
      color: CAR_COLORS[Math.floor(rnd() * CAR_COLORS.length)],
    });
  }

  const boats: Boat[] = [
    { radius: 19.5, speed: 0.045, phase: 0.4, color: hex("#F8FAFC") },
    { radius: 23.5, speed: -0.032, phase: 2.6, color: hex("#F8FAFC") },
    { radius: 27, speed: 0.024, phase: 4.4, color: hex("#EF4444") },
  ];

  const beacons = buildings
    .map((b, i) => [b.h, i] as const)
    .sort((a, b) => b[0] - a[0])
    .slice(0, 14)
    .map(([, i]) => i);

  return { size: N, buildings, roads, roadLines, trees, cars, boats, beacons };
}
