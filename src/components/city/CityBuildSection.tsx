"use client";

import { useRef, useState, type CSSProperties } from "react";
import dynamic from "next/dynamic";
import { motion, useInView, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { DUSK_AT, SKY, nightAmount } from "./timeline";
import { pad } from "../ui/scrollRange";
import { sound } from "@/lib/sound/engine";
import { useSoundZone } from "../sound/SoundZone";

/** The CSS sky at one of the three colour keys (0 day, 1 dusk, 2 night). */
const skyGradient = (k: 0 | 1 | 2) => `linear-gradient(180deg, ${SKY.top[k]} 0%, ${SKY.horizon[k]} 62%, ${SKY.horizon[k]} 100%)`;

const CityScene = dynamic(() => import("./CityScene"), { ssr: false });

const STAGES = [
  { at: [0.0, 0.2], eyebrow: "01 · Foundations", title: "Lay the roads.", body: "Every city starts as an island and a plan. Roads first — the grid decides everything that follows." },
  { at: [0.22, 0.48], eyebrow: "02 · Districts", title: "Raise the skyline.", body: "181 buildings across six categories. Homes, shops, factories, services, defense — and the landmarks that make a city yours." },
  { at: [0.5, 0.77], eyebrow: "03 · Life", title: "Watch it come alive.", body: "Traffic, trains, ships, birds. Citizens walking home. Smoke over the plant. The city starts to breathe." },
  { at: [0.8, 1.0], eyebrow: "04 · Night", title: "Then the night falls.", body: "Moonlit streets, curb lines that glow, a scattering of lit windows — and, some nights, something moving in the woods." },
];

const CLOUDS = [
  { top: "9%", left: "4%", w: 340, dur: 70, delay: -10, o: 0.9 },
  { top: "16%", left: "38%", w: 240, dur: 90, delay: -40, o: 0.7 },
  { top: "6%", left: "62%", w: 420, dur: 110, delay: -65, o: 0.8 },
  { top: "21%", left: "80%", w: 200, dur: 80, delay: -20, o: 0.55 },
];

export default function CityBuildSection() {
  const ref = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const inView = useInView(ref, { margin: "20% 0px 20% 0px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // Sound: roads tick down in the foundations phase, buildings knock into place as they rise (rate
  // follows how fast you scroll, capped), one bell as night falls. Everything is a no-op while muted.
  const sfx = useRef({ last: 0, acc: 0, at: 0, night: false });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progress.current = v;
    const s = sfx.current;
    const d = Math.abs(v - s.last);
    s.last = v;
    if (!sound.enabled || !inView || d > 0.05) return; // a jump (anchor link) is not a scroll
    const now = performance.now();
    s.acc += d;
    if (v > 0.02 && v < 0.2 && s.acc > 0.01 && now - s.at > 60) {
      s.acc = 0;
      s.at = now;
      sound.play("tick", { gain: 0.3, rate: 0.8 + Math.random() * 0.5, pan: Math.random() - 0.5 });
    } else if (v >= 0.2 && v < 0.56 && s.acc > 0.005 && now - s.at > 85) {
      s.acc = 0;
      s.at = now;
      sound.play("pop", { gain: 0.42, rate: 0.8 + Math.random() * 0.5, pan: Math.random() * 1.2 - 0.6, reverb: 0.12 });
    }
  });

  // Sky follows exactly the same day → dusk → night ramp as the 3D lighting. Three fixed gradients
  // cross-fade (opacity only, composited on the GPU) instead of repainting a full-screen gradient every
  // scroll frame; stacking linear fades reproduces keyColor's per-channel ramp exactly.
  const night = useTransform(scrollYProgress, nightAmount);
  const [dark, setDark] = useState(false);
  useMotionValueEvent(night, "change", (n) => {
    setDark((prev) => (prev ? n > 0.45 : n > 0.55));
    const s = sfx.current;
    if (n > 0.6 && !s.night) {
      s.night = true;
      sound.play("chime", { gain: 0.22, rate: 0.75, reverb: 0.6 });
    } else if (n < 0.4) s.night = false;
  });
  useSoundZone(inView, dark ? "city-night" : "city-day");
  const duskFade = useTransform(night, (n) => Math.min(1, n / DUSK_AT));
  const nightFade = useTransform(night, (n) => Math.max(0, (n - DUSK_AT) / (1 - DUSK_AT)));
  const stars = useTransform(night, [0.55, 1], [0, 1]);
  const clouds = useTransform(night, [0, 0.5], [1, 0]);
  const sunY = useTransform(night, [0, 0.55], ["10%", "46%"]);
  const sunOpacity = useTransform(night, [0, 0.45, 0.6], [1, 1, 0]);
  const sunColor = useTransform(night, (n) =>
    n < 0.2
      ? "radial-gradient(circle, #fffdf2 0%, #fff1c4 30%, rgba(255,224,150,0.35) 52%, rgba(255,210,120,0) 72%)"
      : "radial-gradient(circle, #fff1d6 0%, #ffb27a 32%, rgba(255,120,90,0.4) 54%, rgba(255,110,90,0) 72%)",
  );
  const moonOpacity = useTransform(night, [0.65, 1], [0, 1]);
  const moonY = useTransform(night, [0.6, 1], ["22%", "11%"]);
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={ref} id="city" className="relative bg-bg scroll-mt-24" style={{ height: "460svh" }}>
      <div className="sticky-stage">
        {/* sky */}
        <div className="absolute inset-0" style={{ background: skyGradient(0) }} />
        <motion.div className="absolute inset-0" style={{ background: skyGradient(1), opacity: duskFade }} />
        <motion.div className="absolute inset-0" style={{ background: skyGradient(2), opacity: nightFade }} />
        <motion.div className="stars absolute inset-x-0 top-0 h-[60%]" style={{ opacity: stars }} aria-hidden />

        {/* sun (sets behind the skyline) and moon */}
        <motion.div
          className="absolute right-[12%] h-40 w-40 -translate-y-1/2 rounded-full md:right-[16%] md:h-56 md:w-56"
          style={{ top: sunY, opacity: sunOpacity, background: sunColor }}
          aria-hidden
        />
        <motion.div
          className="absolute left-[46%] h-12 w-12 rounded-full md:left-[40%] md:h-16 md:w-16"
          style={{
            top: moonY,
            opacity: moonOpacity,
            background: "radial-gradient(circle at 38% 38%, #ffffff 0%, #e4e8ff 45%, #b7c0f5 70%, #9aa6ea 100%)",
            boxShadow: "0 0 50px 14px rgba(170,182,245,0.35), 0 0 140px 50px rgba(120,140,240,0.15)",
          }}
          aria-hidden
        />

        {/* drifting clouds */}
        <motion.div className="pointer-events-none absolute inset-0" style={{ opacity: clouds }} aria-hidden>
          {CLOUDS.map((c, i) => (
            <div
              key={i}
              className="cloud absolute"
              style={
                {
                  top: c.top,
                  left: c.left,
                  width: `min(${c.w}px, ${c.w / 7}vw)`,
                  height: `min(${c.w * 0.32}px, ${(c.w * 0.32) / 7}vw)`,
                  "--o": c.o,
                  animationDuration: `${c.dur}s`,
                  animationDelay: `${c.delay}s`,
                } as CSSProperties
              }
            />
          ))}
        </motion.div>

        {/* the city */}
        <CityScene progress={progress} active={inView} />

        {/* readability scrims: left column on desktop, bottom on phones */}
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[55%] bg-gradient-to-r from-bg/45 via-bg/15 to-transparent lg:block" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-bg via-bg/70 to-transparent lg:h-40 lg:via-transparent" />

        {/* captions */}
        <div className="pointer-events-none absolute inset-0 flex items-end lg:items-center">
          <div className="relative mx-auto w-full max-w-7xl px-6 pb-24 md:px-10 lg:pb-0">
            <div className="relative h-56 max-w-xl md:h-64">
              {STAGES.map((s, i) => (
                <Caption key={i} p={scrollYProgress} range={s.at} {...s} />
              ))}
            </div>
          </div>
        </div>

        {/* progress rail */}
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-3 md:bottom-10">
          <span className="whitespace-nowrap font-display text-[10px] tracking-[0.3em] text-white/70">SCROLL TO BUILD</span>
          <div className="h-1 w-32 overflow-hidden rounded-full bg-white/20 md:w-40">
            <motion.div className="h-full rounded-full bg-gold" style={{ width: bar }} />
          </div>
        </div>
      </div>

      {/* Soft hand-off from the dark hero: scrolls away with the section as the stage pins. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[40svh] bg-gradient-to-b from-bg via-bg/50 to-transparent" aria-hidden />
    </section>
  );
}

function Caption({
  p,
  range,
  eyebrow,
  title,
  body,
}: {
  p: ReturnType<typeof useScroll>["scrollYProgress"];
  range: number[];
  eyebrow: string;
  title: string;
  body: string;
}) {
  const [a, b] = range;
  const fade = 0.04;
  // The first caption is already up when the section pins; the last one stays up as it un-pins.
  const opacity = useTransform(p, ...pad([a, a + fade, b - fade, b], [a === 0 ? 1 : 0, 1, 1, b === 1 ? 1 : 0]));
  const y = useTransform(p, [a, a + fade, b - fade, b], [a === 0 ? 0 : 24, 0, 0, b === 1 ? 0 : -24]);
  return (
    <motion.div className="absolute inset-x-0 top-0" style={{ opacity, y }}>
      <p className="eyebrow mb-3 drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]">{eyebrow}</p>
      <h3 className="h-display text-[clamp(2.1rem,4.6vw,3.8rem)] text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)]">{title}</h3>
      <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/90 drop-shadow-[0_1px_10px_rgba(0,0,0,0.5)] md:text-base">{body}</p>
    </motion.div>
  );
}
