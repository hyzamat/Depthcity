/**
 * The shared scroll → time-of-day timeline for the built city. The CSS sky behind the
 * canvas and the 3D lighting both read from here, so the horizon never seams.
 * Colour keys sit at night = 0 (day), DUSK_AT (dusk) and 1 (night).
 */

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** 0 = full day, 1 = full night. */
export const nightAmount = (p: number) => smooth(0.7, 0.97, p);

export const DUSK_AT = 0.45;

export const SKY = {
  top: ["#6fb3ff", "#6d4f9c", "#030612"],
  /** also the fog / horizon-haze colour */
  horizon: ["#d4e9ff", "#f6b9c9", "#0c1233"],
  sun: ["#fff8ee", "#ffb08a", "#8d9cff"],
  ambient: ["#8fa4c2", "#b58aa8", "#2b3560"],
} as const;

const hexToRgb = (h: string) => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

/** CSS colour for a three-key ramp at night amount t. */
export function keyColor(keys: readonly string[], t: number) {
  const [a, b, u] = t < DUSK_AT ? [keys[0], keys[1], t / DUSK_AT] : [keys[1], keys[2], (t - DUSK_AT) / (1 - DUSK_AT)];
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  const m = ca.map((v, i) => Math.round(v + (cb[i] - v) * u));
  return `rgb(${m[0]}, ${m[1]}, ${m[2]})`;
}
