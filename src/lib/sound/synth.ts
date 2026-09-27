/**
 * Every sound on the site is synthesised here at 22.05 kHz mono — nothing is downloaded.
 * The gunfire and fireworks are straight ports of the game's own synths (GunfireFX.MakeShotClip
 * and FireworksShow.BuildClips), so the site sounds like Depth City because it runs the same code.
 */
export const SR = 22050;

/** Deterministic PRNG so a given sound is identical on every visit (mulberry32). */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** One-pole low-pass noise state, as in the game's SynthState. */
class State {
  lp = 0;
  lp2 = 0;
  phase = 0;
  pop = 0;
  noise(r: () => number, cutoff: number) {
    this.lp += (r() * 2 - 1 - this.lp) * cutoff;
    return this.lp;
  }
  noise2(r: () => number, cutoff: number) {
    this.lp2 += (r() * 2 - 1 - this.lp2) * cutoff;
    return this.lp2;
  }
}

/** Renders `f(t)` for `dur` seconds, soft-clips, normalises to 0.9 and fades the tail (FireworksShow.Synth). */
export function synth(dur: number, seed: number, f: (t: number, r: () => number, st: State) => number, norm = true) {
  const n = Math.ceil(SR * dur);
  const d = new Float32Array(n);
  const r = rng(seed);
  const st = new State();
  let peak = 0.0001;
  for (let i = 0; i < n; i++) {
    const x = f(i / SR, r, st) * 1.4;
    d[i] = x / (1 + Math.abs(x));
    peak = Math.max(peak, Math.abs(d[i]));
  }
  const k = norm ? 0.9 / peak : 1;
  const fade = Math.min(n, 600);
  for (let i = 0; i < n; i++) d[i] *= k;
  for (let i = 0; i < fade; i++) d[n - 1 - i] *= i / fade;
  return d;
}

/* ------------------------------------------------------------------ the game's gunfire */
/** GunfireFX.MakeShotClip: filtered noise crack + pitched thump + slap echo, soft-clipped. */
export function shot(seed: number, dur: number, crackDecay: number, bodyFreq: number, bodyAmp: number, bright: number) {
  const n = Math.ceil(SR * dur);
  const d = new Float32Array(n);
  const r = rng(seed);
  let lp = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const noise = r() * 2 - 1;
    const cutoff = lerp(bright, 0.06, clamp01(t * 10));
    lp += (noise - lp) * cutoff;
    const crack = lp * Math.exp(-t * crackDecay);
    const f = bodyFreq * Math.exp(-t * 5);
    const thump = Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 16) * bodyAmp;
    const tail = lp * Math.exp(-t * 7) * 0.18;
    d[i] = crack + thump + tail;
  }
  const echo = Math.floor(SR * 0.055);
  for (let i = n - 1; i >= echo; i--) d[i] += d[i - echo] * 0.32;
  for (let i = 0; i < n; i++) {
    const x = d[i] * 1.5;
    d[i] = x / (1 + Math.abs(x));
  }
  const fade = Math.min(n, 400);
  for (let i = 0; i < fade; i++) d[n - 1 - i] *= i / fade;
  return d;
}

/* ------------------------------------------------------------------ the game's fireworks */
export const fireworks = {
  launch: () =>
    synth(0.45, 3, (t, r, st) => {
      const thump = Math.sin(2 * Math.PI * 95 * Math.exp(-t * 6) * t) * Math.exp(-t * 18);
      return thump * 0.9 + st.noise(r, 0.35) * Math.exp(-t * 30) * 0.5;
    }),
  whistle: () =>
    synth(1.3, 5, (t, r, st) => {
      const thump = Math.sin(2 * Math.PI * 95 * Math.exp(-t * 6) * t) * Math.exp(-t * 18);
      const f = lerp(700, 2100, clamp01(t / 1.2));
      st.phase += (2 * Math.PI * f) / SR;
      const env = clamp01((t - 0.05) / 0.15) * clamp01((1.3 - t) / 0.25);
      return thump * 0.8 + Math.sin(st.phase) * env * 0.18;
    }),
  boom: () =>
    synth(2.4, 7, (t, r, st) => {
      const body = Math.sin(2 * Math.PI * 48 * Math.exp(-t * 2) * t) * Math.exp(-t * 4.5);
      const crack = st.noise(r, lerp(0.8, 0.05, clamp01(t * 6))) * Math.exp(-t * 9);
      const rumble = st.noise2(r, 0.02) * Math.exp(-t * 1.6) * 2.2;
      return body * 0.9 + crack * 0.8 + rumble;
    }),
  boomSharp: () =>
    synth(1.6, 11, (t, r, st) => {
      const body = Math.sin(2 * Math.PI * 70 * Math.exp(-t * 3) * t) * Math.exp(-t * 7);
      const crack = st.noise(r, 0.9) * Math.exp(-t * 16);
      return body * 0.7 + crack;
    }),
  crackle: () =>
    synth(1.4, 13, (t, r, st) => {
      const density = 0.0016 * Math.exp(-t * 1.8);
      if (r() < density) st.pop = 1;
      st.pop *= 0.93;
      return st.noise(r, 0.95) * st.pop;
    }),
};

/* ------------------------------------------------------------------ interface sounds */
export const ui = {
  /** the faintest tick for hover — a 2.4 kHz ping, 25 ms */
  hover: () =>
    synth(0.05, 21, (t) => Math.sin(2 * Math.PI * 2400 * t) * Math.exp(-t * 90) * 0.6 + Math.sin(2 * Math.PI * 4800 * t) * Math.exp(-t * 160) * 0.2),
  /** click: a short pitch-drop with a noise transient */
  click: () =>
    synth(0.09, 22, (t, r, st) => {
      const f = 900 * Math.exp(-t * 28);
      return Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 40) + st.noise(r, 0.6) * Math.exp(-t * 300) * 0.5;
    }),
  /** a building landing: wood-block knock, pitch dropping fast */
  pop: () =>
    synth(0.2, 23, (t, r, st) => {
      const f = 420 * (1 + 2.2 * Math.exp(-t * 70));
      return Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 24) + st.noise(r, 0.5) * Math.exp(-t * 220) * 0.35;
    }),
  /** road tile / counter tick: 12 ms of bright noise */
  tick: () => synth(0.03, 24, (t, r, st) => st.noise(r, 0.85) * Math.exp(-t * 260)),
  /** soft bell: inharmonic partials, 2.5 s */
  chime: () =>
    synth(2.5, 25, (t) => {
      const f = 660;
      return (
        Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 1.6) +
        Math.sin(2 * Math.PI * f * 2.76 * t) * Math.exp(-t * 3.2) * 0.45 +
        Math.sin(2 * Math.PI * f * 5.4 * t) * Math.exp(-t * 6) * 0.2 +
        Math.sin(2 * Math.PI * f * 8.93 * t) * Math.exp(-t * 9) * 0.08
      );
    }),
  /** countdown beep */
  beep: () => synth(0.09, 26, (t) => Math.sign(Math.sin(2 * Math.PI * 880 * t)) * 0.5 * clamp01((0.09 - t) / 0.02) * clamp01(t / 0.004)),
};

/* ------------------------------------------------------------------ ambient beds (seamless loops) */
/** Crossfades the tail of a rendered loop into its head so it repeats without a click. */
function loopable(d: Float32Array, xfade = Math.floor(SR * 0.6)) {
  const n = d.length;
  for (let i = 0; i < xfade; i++) {
    const t = i / xfade;
    d[i] = d[i] * t + d[n - xfade + i] * (1 - t);
  }
  return d.subarray(0, n - xfade);
}

export const beds = {
  /** brown-noise wind with slow gusts — the base layer everywhere */
  wind: () =>
    loopable(
      synth(
        12,
        31,
        (t, r, st) => {
          const gust = 0.55 + 0.45 * Math.sin(2 * Math.PI * 0.07 * t) * Math.sin(2 * Math.PI * 0.13 * t + 1);
          return st.noise(r, 0.012) * gust * 3;
        },
        false,
      ),
    ),
  /** night city: mains-like hum plus a very low murmur */
  hum: () =>
    loopable(
      synth(
        8,
        32,
        (t, r, st) =>
          (Math.sin(2 * Math.PI * 50 * t) * 0.5 + Math.sin(2 * Math.PI * 100 * t) * 0.25 + Math.sin(2 * Math.PI * 150.3 * t) * 0.12) *
            (0.8 + 0.2 * Math.sin(2 * Math.PI * 0.21 * t)) +
          st.noise(r, 0.006) * 2.5,
        false,
      ),
    ),
  /** insects: pulsed 4 kHz chirr at several phases, thinning and thickening */
  insects: () =>
    loopable(
      synth(
        9,
        33,
        (t, r, st) => {
          let s = 0;
          for (let k = 0; k < 3; k++) {
            const rate = 26 + k * 7;
            const gate = Math.pow(Math.max(0, Math.sin(2 * Math.PI * rate * t + k * 2)), 6);
            const swell = 0.5 + 0.5 * Math.sin(2 * Math.PI * (0.11 + k * 0.05) * t + k);
            s += Math.sin(2 * Math.PI * (4100 + k * 260) * t) * gate * swell;
          }
          return s * 0.35 + st.noise(r, 0.9) * 0.02;
        },
        false,
      ),
    ),
  /** distant war: deep rolling rumble with random far thuds */
  rumble: () =>
    loopable(
      synth(
        10,
        34,
        (t, r, st) => {
          if (r() < 0.00025) st.pop = 1;
          st.pop *= 0.9993;
          return st.noise(r, 0.008) * 3.2 + st.noise2(r, 0.03) * st.pop * 2;
        },
        false,
      ),
    ),
  /** a crowd far below: band-limited noise with restless amplitude */
  crowd: () =>
    loopable(
      synth(
        10,
        35,
        (t, r, st) => {
          const murmur = st.noise(r, 0.16) - st.noise2(r, 0.03);
          const restless = 0.6 + 0.4 * Math.sin(2 * Math.PI * 0.9 * t) * Math.sin(2 * Math.PI * 2.3 * t + 0.5);
          return murmur * restless * 1.6;
        },
        false,
      ),
    ),
  /** deep space drone: detuned low partials breathing slowly */
  drone: () =>
    loopable(
      synth(
        12,
        36,
        (t) =>
          (Math.sin(2 * Math.PI * 55 * t) + Math.sin(2 * Math.PI * 55.6 * t) * 0.8 + Math.sin(2 * Math.PI * 82.4 * t) * 0.35 + Math.sin(2 * Math.PI * 110.7 * t) * 0.25) *
          (0.55 + 0.45 * Math.sin(2 * Math.PI * 0.08 * t)) *
          0.4,
        false,
      ),
      Math.floor(SR * 2),
    ),
};

/** Long reverb tail as an impulse response: decaying noise, rendered at the context's own rate (a ConvolverNode insists). */
export function reverbIR(sampleRate: number, dur = 1.8) {
  const n = Math.ceil(sampleRate * dur);
  const d = new Float32Array(n);
  const r = rng(37);
  for (let i = 0; i < n; i++) d[i] = (r() * 2 - 1) * Math.exp((-i / sampleRate) * 3.2) * 0.5;
  return d;
}
