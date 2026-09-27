"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Img from "./ui/Img";
import { Reveal, SplitWords } from "./ui/Reveal";
import { pad } from "./ui/scrollRange";
import SoundZone from "./sound/SoundZone";

export default function SkySection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);
  const glow = useTransform(scrollYProgress, ...pad([0.2, 0.5, 0.8], [0, 1, 0]));

  return (
    <section ref={ref} className="relative h-[120svh] min-h-[720px] overflow-hidden">
      <SoundZone zone="city-night" />
      <motion.div className="absolute inset-[-8%] will-change-transform" style={{ y, scale }}>
        <Img
          name="sky-aurora"
          alt="Aurora over the Depth City skyline at night, seen from the street"
          className="h-full w-full object-cover object-[50%_35%]"
          portrait
          sizes="134vw"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg" />
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ opacity: glow, background: "radial-gradient(60% 40% at 50% 30%, rgba(124,245,195,0.18), transparent 70%)" }}
      />

      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
          <div className="max-w-2xl">
            <Reveal as="p" className="eyebrow mb-4 !text-aurora">
              Look up
            </Reveal>
            <h2 className="h-display text-[clamp(2.2rem,6vw,5rem)] text-white">
              <SplitWords text="Galaxy nights. Aurora nights." />
            </h2>
            <Reveal as="p" className="lede mt-6 max-w-lg !text-white/80" delay={2}>
              Every night is one or the other — never both. The decision is made at dusk before anything is visible: a
              baked Milky Way hangs at one place in the sky, or a green curtain rises a few seconds after full dark and
              stays until dawn. Twinkle runs on its own clock, so the stars keep blinking while the city is paused.
            </Reveal>
            <Reveal className="mt-8 flex flex-wrap gap-2" delay={3}>
              {["Procedural twinkling stars", "Baked 360° cloud panorama", "Two-layer parallax drift", "Rose dawn · violet dusk"].map((t) => (
                <span key={t} className="glass rounded-full px-3.5 py-1.5 text-xs text-white/80">
                  {t}
                </span>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
