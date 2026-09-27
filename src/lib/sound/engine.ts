/**
 * The site's sound engine: one Web Audio graph, everything synthesised (see synth.ts). Every page load
 * starts muted — nothing is remembered between visits; only the toggle turns it on.
 *
 *   sound.enable() / disable() / toggle()   – must be called from a user gesture the first time
 *   sound.play("pop", { rate, gain, pan })   – one-shots
 *   sound.whoosh(gain, dur)                  – a live air sweep (menus, headings)
 *   sound.enter(key, "jungle") / leave(key)  – sections declare the ambience they want while on screen;
 *                                              the most recently entered zone wins and beds cross-fade
 *   sound.intensity(0..1)                    – how busy the zone's random events are (fireworks, gunfire)
 *
 * Audio runs on the browser's audio thread, so scrolling never waits on it; the main thread only ever
 * creates a few nodes per event. Every call is a no-op while sound is off.
 */
import { SR, beds, fireworks, reverbIR, shot, ui } from "./synth";

export type Sfx = keyof typeof SFX;
export type Bed = keyof typeof beds;
export type Zone = keyof typeof ZONES;

const SFX = {
  hover: ui.hover,
  click: ui.click,
  pop: ui.pop,
  tick: ui.tick,
  chime: ui.chime,
  beep: ui.beep,
  // GunfireFX: three rifles and the cannon, with the game's exact parameters
  rifle1: () => shot(11, 0.32, 46, 150, 0.5, 0.95),
  rifle2: () => shot(23, 0.3, 52, 165, 0.45, 0.9),
  rifle3: () => shot(37, 0.34, 40, 140, 0.55, 1),
  cannon: () => shot(5, 0.85, 11, 55, 1, 0.7),
  fwLaunch: fireworks.launch,
  fwWhistle: fireworks.whistle,
  fwBoom: fireworks.boom,
  fwBoomSharp: fireworks.boomSharp,
  fwCrackle: fireworks.crackle,
};

type PlayOpts = { rate?: number; gain?: number; pan?: number; lowpass?: number; reverb?: number; at?: number };
type EventGen = (e: Engine, intensity: number) => number; // returns ms until the next event

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)];

/* ----------------------------------------------------------------- live events (built from oscillators) */
const birds =
  (density: number, exotic = false): EventGen =>
  (e) => {
    const ctx = e.ctx!;
    const t0 = ctx.currentTime + 0.02;
    const notes = exotic ? 1 : 2 + Math.floor(Math.random() * 3);
    const base = exotic ? rand(500, 900) : rand(2400, 4200);
    const pan = e.panner(rand(-0.8, 0.8));
    const g = ctx.createGain();
    g.gain.value = 0;
    g.connect(pan);
    const o = ctx.createOscillator();
    o.type = "sine";
    o.connect(g);
    let t = t0;
    for (let i = 0; i < notes; i++) {
      const len = exotic ? rand(0.25, 0.45) : rand(0.04, 0.09);
      const f0 = base * rand(0.9, 1.1);
      const f1 = exotic ? f0 * rand(1.6, 2.2) : f0 * rand(0.75, 1.35);
      o.frequency.setValueAtTime(f0, t);
      o.frequency.exponentialRampToValueAtTime(f1, t + len * 0.7);
      if (exotic) o.frequency.exponentialRampToValueAtTime(f0 * 1.2, t + len);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(exotic ? 0.05 : 0.035, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + len);
      t += len + rand(0.05, 0.14);
    }
    o.start(t0);
    o.stop(t + 0.05);
    return rand(700, 3200) / density;
  };

const car: EventGen = (e) => {
  const ctx = e.ctx!;
  const t0 = ctx.currentTime + 0.02;
  const dur = rand(1.8, 3);
  const src = ctx.createBufferSource();
  src.buffer = e.noise();
  src.loop = true;
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.Q.value = 0.7;
  bp.frequency.setValueAtTime(260, t0);
  bp.frequency.exponentialRampToValueAtTime(900, t0 + dur * 0.5);
  bp.frequency.exponentialRampToValueAtTime(300, t0 + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(0.09, t0 + dur * 0.5);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  const pan = e.panner(0);
  const dir = Math.random() < 0.5 ? 1 : -1;
  pan.pan.setValueAtTime(-dir, t0);
  pan.pan.linearRampToValueAtTime(dir, t0 + dur);
  src.connect(bp).connect(g).connect(pan);
  src.start(t0);
  src.stop(t0 + dur + 0.05);
  return rand(5000, 12000);
};

const owl: EventGen = (e) => {
  const ctx = e.ctx!;
  const t0 = ctx.currentTime + 0.02;
  const o = ctx.createOscillator();
  o.type = "sine";
  o.frequency.value = rand(340, 420);
  const g = ctx.createGain();
  g.gain.value = 0;
  o.connect(g).connect(e.panner(rand(-0.6, 0.6)));
  let t = t0;
  for (let i = 0; i < 2; i++) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.06, t + 0.08);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
    t += 0.45;
  }
  o.start(t0);
  o.stop(t + 0.1);
  return rand(9000, 22000);
};

const gunfire: EventGen = (e, intensity) => {
  const n = 3 + Math.floor(Math.random() * 5);
  let at = 0;
  for (let i = 0; i < n; i++) {
    e.play(pick(["rifle1", "rifle2", "rifle3"]), { rate: rand(0.92, 1.1), gain: 0.28, pan: rand(-0.7, 0.7), lowpass: 1600, reverb: 0.45, at });
    at += rand(0.07, 0.14);
  }
  if (Math.random() < 0.3) e.play("cannon", { rate: rand(0.85, 0.98), gain: 0.5, pan: rand(-0.5, 0.5), lowpass: 900, reverb: 0.6, at: at + rand(0.1, 0.5) });
  return rand(1500, 5000) / (0.4 + intensity);
};

const fireworksShow: EventGen = (e, intensity) => {
  const whistle = Math.random() < 0.35;
  e.play(whistle ? "fwWhistle" : "fwLaunch", { gain: 0.35, pan: rand(-0.4, 0.4), reverb: 0.2 });
  const up = rand(0.9, 1.6);
  const pan = rand(-0.8, 0.8);
  e.play(Math.random() < 0.5 ? "fwBoom" : "fwBoomSharp", { gain: 0.55, pan, rate: rand(0.9, 1.1), reverb: 0.5, at: up });
  if (Math.random() < 0.45) e.play("fwCrackle", { gain: 0.3, pan, at: up + 0.2 });
  return (3200 - 2500 * intensity) * rand(0.6, 1.4);
};

/* ----------------------------------------------------------------- zones */
type ZoneDef = { beds: Partial<Record<Bed, number>>; events?: EventGen[] };
const ZONES = {
  // bed levels are gains on loops whose RMS sits around 0.1–0.2: ambience stays well under the one-shots
  none: { beds: { wind: 0.2 } },
  "city-day": { beds: { wind: 0.3 }, events: [birds(1), car] },
  street: { beds: { wind: 0.25, crowd: 0.1 }, events: [birds(0.6), car] },
  "city-night": { beds: { wind: 0.18, hum: 0.1, insects: 0.1 }, events: [car] },
  jungle: { beds: { wind: 0.2, insects: 0.28 }, events: [birds(2.2), birds(0.5, true)] },
  "forest-night": { beds: { wind: 0.3, insects: 0.18 }, events: [owl] },
  war: { beds: { wind: 0.2, rumble: 0.45 }, events: [gunfire] },
  space: { beds: { wind: 0.1, drone: 0.35 } },
  show: { beds: { wind: 0.12, crowd: 0.28 }, events: [fireworksShow] },
} as const satisfies Record<string, ZoneDef>;

/* ----------------------------------------------------------------- engine */
class Engine {
  ctx: AudioContext | null = null;
  private master!: GainNode;
  private sfxBus!: GainNode;
  private ambBus!: GainNode;
  private reverbSend!: GainNode;
  private buffers = new Map<string, AudioBuffer>();
  private noiseBuf: AudioBuffer | null = null;
  private running = new Map<Bed, { src: AudioBufferSourceNode; gain: GainNode }>();
  private zones = new Map<string, Zone>();
  private timers: number[] = [];
  private listeners = new Set<() => void>();
  private _on = false;
  private _intensity = 0.5;
  private unlocker: HTMLAudioElement | null = null;

  get enabled() {
    return this._on;
  }
  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };
  private emit() {
    this.listeners.forEach((fn) => fn());
  }

  private ensure() {
    if (this.ctx) return this.ctx;
    const ctx = new AudioContext();
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(ctx.destination);
    this.sfxBus = ctx.createGain();
    this.ambBus = ctx.createGain();
    this.sfxBus.connect(this.master);
    this.ambBus.connect(this.master);
    const reverb = ctx.createConvolver();
    const ir = reverbIR(ctx.sampleRate);
    const irBuf = ctx.createBuffer(1, ir.length, ctx.sampleRate);
    irBuf.copyToChannel(ir as Float32Array<ArrayBuffer>, 0);
    reverb.buffer = irBuf;
    this.reverbSend = ctx.createGain();
    this.reverbSend.gain.value = 0.7;
    this.reverbSend.connect(reverb).connect(this.master);
    document.addEventListener("visibilitychange", () => {
      if (!this.ctx) return;
      if (document.hidden) this.ctx.suspend();
      else if (this._on) this.ctx.resume();
    });
    return ctx;
  }

  private buffer(name: string, make: () => Float32Array) {
    let b = this.buffers.get(name);
    if (!b) {
      const data = make();
      b = this.ctx!.createBuffer(1, data.length, SR);
      b.copyToChannel(data as Float32Array<ArrayBuffer>, 0);
      this.buffers.set(name, b);
    }
    return b;
  }

  /** two seconds of white noise for the live events */
  noise() {
    if (!this.noiseBuf) {
      const n = SR * 2;
      const d = new Float32Array(n);
      for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
      this.noiseBuf = this.ctx!.createBuffer(1, n, SR);
      this.noiseBuf.copyToChannel(d, 0);
    }
    return this.noiseBuf;
  }

  panner(pan: number) {
    const p = this.ctx!.createStereoPanner();
    p.pan.value = pan;
    p.connect(this.ambBus);
    return p;
  }

  /** Call from a click/tap/key handler: browsers only let audio start inside a gesture. */
  enable() {
    if (this._on) return;
    const ctx = this.ensure();
    this._on = true;
    ctx.resume();
    // iOS keeps Web Audio under the ring/silent switch until a media element has played: a moment of silence does it.
    if (!this.unlocker && /iP(hone|ad|od)/.test(navigator.userAgent)) {
      const a = document.createElement("audio");
      a.src = SILENT_WAV;
      a.setAttribute("playsinline", "");
      a.play().catch(() => {});
      this.unlocker = a;
    }
    this.master.gain.cancelScheduledValues(ctx.currentTime);
    this.master.gain.setTargetAtTime(0.85, ctx.currentTime, 0.25);
    this.applyZone();
    this.emit();
  }

  disable() {
    if (!this._on || !this.ctx) return;
    this._on = false;
    const ctx = this.ctx;
    this.master.gain.cancelScheduledValues(ctx.currentTime);
    this.master.gain.setTargetAtTime(0, ctx.currentTime, 0.12);
    this.stopEvents();
    window.setTimeout(() => {
      if (!this._on) {
        for (const [bed, r] of this.running) {
          r.src.stop();
          this.running.delete(bed);
        }
        ctx.suspend();
      }
    }, 600);
    this.emit();
  }

  toggle() {
    if (this._on) this.disable();
    else this.enable();
  }

  play(name: Sfx, { rate = 1, gain = 0.5, pan = 0, lowpass, reverb = 0, at = 0 }: PlayOpts = {}) {
    if (!this._on || !this.ctx) return;
    const ctx = this.ctx;
    const src = ctx.createBufferSource();
    src.buffer = this.buffer(name, SFX[name]);
    src.playbackRate.value = rate;
    const g = ctx.createGain();
    g.gain.value = gain;
    let node: AudioNode = src;
    if (lowpass) {
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = lowpass;
      node = node.connect(lp);
    }
    node = node.connect(g);
    if (pan) {
      const p = ctx.createStereoPanner();
      p.pan.value = pan;
      node = node.connect(p);
    }
    node.connect(this.sfxBus);
    if (reverb) {
      const send = ctx.createGain();
      send.gain.value = reverb;
      node.connect(send).connect(this.reverbSend);
    }
    src.start(ctx.currentTime + at);
  }

  /** A soft air sweep for things sliding into place (menus, headings). Built live: noise through a moving band-pass. */
  whoosh(gain = 0.25, dur = 0.5) {
    if (!this._on || !this.ctx) return;
    const ctx = this.ctx;
    const t0 = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.noise();
    src.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 1.1;
    bp.frequency.setValueAtTime(220, t0);
    bp.frequency.exponentialRampToValueAtTime(1900, t0 + dur * 0.35);
    bp.frequency.exponentialRampToValueAtTime(320, t0 + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + dur * 0.3);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(bp).connect(g).connect(this.sfxBus);
    src.start(t0);
    src.stop(t0 + dur + 0.05);
  }

  /* ---- ambience */
  enter(key: string, zone: Zone) {
    if (this.zones.get(key) === zone && [...this.zones.keys()].pop() === key) return;
    this.zones.delete(key);
    this.zones.set(key, zone);
    this.applyZone();
  }
  leave(key: string) {
    if (!this.zones.delete(key)) return;
    this.applyZone();
  }
  intensity(v: number) {
    this._intensity = Math.min(1, Math.max(0, v));
  }

  private current(): Zone {
    return [...this.zones.values()].pop() ?? "none";
  }

  private applyZone() {
    if (!this._on || !this.ctx) return;
    const ctx = this.ctx;
    const zone: ZoneDef = ZONES[this.current()];
    const t = ctx.currentTime;
    // beds: start the ones this zone wants, ramp all to their new level (0 fades out and stops)
    for (const [bed, level] of Object.entries(zone.beds) as [Bed, number][]) {
      let r = this.running.get(bed);
      if (!r) {
        const src = ctx.createBufferSource();
        src.buffer = this.buffer(bed, beds[bed]);
        src.loop = true;
        const gain = ctx.createGain();
        gain.gain.value = 0;
        src.connect(gain).connect(this.ambBus);
        src.start(t, Math.random() * src.buffer.duration);
        r = { src, gain };
        this.running.set(bed, r);
      }
      r.gain.gain.cancelScheduledValues(t);
      r.gain.gain.setTargetAtTime(level, t, 1.2);
    }
    for (const [bed, r] of this.running) {
      if (bed in zone.beds) continue;
      r.gain.gain.cancelScheduledValues(t);
      r.gain.gain.setTargetAtTime(0, t, 0.8);
      const src = r.src;
      this.running.delete(bed);
      window.setTimeout(() => src.stop(), 4000);
    }
    // events: restart the schedulers for this zone
    this.stopEvents();
    for (const gen of zone.events ?? []) {
      const tick = () => {
        if (!this._on || (ZONES[this.current()] as ZoneDef) !== zone) return;
        const next = gen(this, this._intensity);
        this.timers.push(window.setTimeout(tick, next));
      };
      this.timers.push(window.setTimeout(tick, rand(300, 1500)));
    }
  }

  private stopEvents() {
    this.timers.forEach((id) => window.clearTimeout(id));
    this.timers = [];
  }
}

/** 0.05 s of silence as a WAV (8 kHz, 8-bit) — the iOS media-session unlock. */
const SILENT_WAV =
  "data:audio/wav;base64,UklGRrQBAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YZABAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA";

export const sound = new Engine();
