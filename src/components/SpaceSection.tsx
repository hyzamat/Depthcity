"use client";

import { useRef } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import Img from "./ui/Img";
import { Reveal, SplitWords } from "./ui/Reveal";
import { pad } from "./ui/scrollRange";
import SoundZone from "./sound/SoundZone";
import { sound } from "@/lib/sound/engine";

/**
 * The Space Research Center launch. Pinned: the rocket photo rises as you scroll,
 * the copy fades in, then the day/close-up pair slides up underneath.
 */
export default function SpaceSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const imgScale = useTransform(scrollYProgress, [0, 0.6], [1.25, 1]);
  const imgY = useTransform(scrollYProgress, [0, 0.6], ["10%", "0%"]);
  const copyOpacity = useTransform(scrollYProgress, ...pad([0.15, 0.35, 0.75, 0.9], [0, 1, 1, 0]));
  const copyY = useTransform(scrollYProgress, [0.15, 0.35], [40, 0]);
  const countdown = useTransform(scrollYProgress, [0.05, 0.55], [10, 0]);
  const countText = useTransform(countdown, (v) => (v <= 0.5 ? "LIFTOFF" : `T-${Math.ceil(v)}`));
  // One beep per count (never faster than four a second when the page jumps), a long low boom at zero.
  const beep = useRef({ at: 0, text: "" });
  useMotionValueEvent(countText, "change", (s) => {
    const b = beep.current;
    const now = performance.now();
    if (s === b.text) return;
    const wasLive = b.text !== "";
    b.text = s;
    if (!wasLive || now - b.at < 250) return;
    b.at = now;
    if (s === "LIFTOFF") {
      sound.play("cannon", { rate: 0.55, gain: 0.7, lowpass: 500, reverb: 0.8 });
      sound.play("fwBoom", { rate: 0.6, gain: 0.6, lowpass: 400, reverb: 0.7, at: 0.15 });
    } else sound.play("beep", { gain: 0.22, rate: s === "T-1" ? 1.5 : 1, reverb: 0.3 });
  });
  // Only a partial veil — the image pair below slides up over the pinned stage, so the
  // screen never goes fully black between the two.
  const veil = useTransform(scrollYProgress, ...pad([0.7, 1], [0, 0.55]));
  const countOpacity = useTransform(scrollYProgress, ...pad([0.05, 0.15, 0.6, 0.7], [0, 1, 1, 0]));

  return (
    <section id="space" className="relative bg-bg scroll-mt-24">
      <div ref={ref} className="relative" style={{ height: "300svh" }}>
      <SoundZone zone="space" />
      <div className="sticky-stage">
        <motion.div className="absolute inset-0 will-change-transform" style={{ scale: imgScale, y: imgY }}>
          <Img
            name="rocket-night"
            alt="The BADUSHA rocket lifting off from the Space Research Center under an aurora"
            className="h-full w-full object-cover object-[55%_40%]"
            portrait
            sizes="125vw"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-bg/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/60 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-bg via-bg/75 to-transparent md:hidden" />
        <motion.div className="absolute inset-0 bg-bg" style={{ opacity: veil }} />

        {/* countdown */}
        <motion.div
          className="absolute right-6 top-24 font-display text-5xl font-black tabular-nums text-white/90 md:right-12 md:top-28 md:text-8xl"
          style={{ opacity: countOpacity }}
        >
          {countText}
        </motion.div>

        <motion.div style={{ opacity: copyOpacity, y: copyY }} className="absolute inset-x-0 bottom-0 px-6 pb-16 md:px-10 md:pb-24">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="eyebrow mb-4 !text-sky">Space program</p>
              <h2 className="h-display text-[clamp(2.2rem,6vw,5rem)] text-white">
                <SplitWords text="Reach for orbit." />
              </h2>
              <p className="lede mt-6 max-w-lg !text-white/80">
                Tap the Space Research Center and the Play button becomes LAUNCH. Engines light, the apron vanishes under
                an exhaust cloud, and the rocket climbs right out of the top of the sky. Then the pad needs a full week
                before it can fly again.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      </div>

      {/* pair underneath — pulled up so it rides over the end of the pinned launch */}
      <div className="relative z-10 -mt-[55svh]">
        <div className="mx-auto grid max-w-7xl gap-4 px-6 pb-24 md:grid-cols-2 md:px-10 md:pb-36">
          <Reveal className="group overflow-hidden rounded-3xl ring-glow" amount={0.3}>
            <div className="aspect-[16/10]">
              <Img name="rocket-day" alt="Daytime launch — the rocket clears the pad over the Eiffel district" className="h-full w-full object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.03]" sizes="(min-width: 768px) 50vw, 100vw" />
            </div>
          </Reveal>
          <Reveal className="group overflow-hidden rounded-3xl ring-glow" amount={0.3} delay={1}>
            <div className="aspect-[16/10]">
              <Img name="rocket-close" alt="Close on the launch tower at golden hour" className="h-full w-full object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.03]" sizes="(min-width: 768px) 50vw, 100vw" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
