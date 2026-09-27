/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Img from "./ui/Img";
import Magnetic from "./ui/Magnetic";
import { pad } from "./ui/scrollRange";
import { site } from "@/content/site";
import SoundZone from "./sound/SoundZone";
import { useSoundEnabled } from "./sound/SoundProvider";
import { sound } from "@/lib/sound/engine";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const soundOn = useSoundEnabled();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.18]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const textOpacity = useTransform(scrollYProgress, ...pad([0, 0.55], [1, 0]));
  const veil = useTransform(scrollYProgress, [0, 1], [0, 0.65]);

  return (
    <section ref={ref} id="top" className="relative h-[100svh] min-h-[640px] overflow-hidden">
      {/* backdrop */}
      <motion.div className="absolute inset-0 will-change-transform" style={{ y: imgY, scale: imgScale }}>
        <motion.div
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.2, ease }}
          className="h-full w-full"
        >
          <Img
            name="hero-skyline-sunset"
            alt="Depth City skyline at sunset — the Burj Khalifa rising over an island city"
            className="h-full w-full object-cover object-[50%_60%]"
            portrait
            priority
            sizes="118vw"
          />
        </motion.div>
      </motion.div>
      <motion.div className="absolute inset-0 bg-bg" style={{ opacity: veil }} />
      {/* Light touch: the bright sky and city stay vivid; only the copy gets a soft pool of shade behind it,
          and the bottom melts into the page. */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,9,15,0.3)_0%,rgba(6,9,15,0)_20%,rgba(6,9,15,0.18)_42%,rgba(6,9,15,0.5)_66%,rgba(6,9,15,0.8)_86%,#06090f_100%)]" />

      {/* content */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 pb-24 pt-24 text-center md:pb-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.3, ease, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-0 -z-10 scale-150 rounded-full bg-[radial-gradient(circle,rgba(245,194,66,0.22),transparent_65%)]" />
          <img
            src="/brand/mark-512.png"
            alt=""
            className="mx-auto h-28 w-28 drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)] sm:h-36 sm:w-36 md:h-44 md:w-44"
          />
        </motion.div>

        <motion.img
          src="/brand/wordmark-1200.png"
          alt={site.name}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease, delay: 0.55 }}
          className="mt-6 w-[min(78vw,560px)] drop-shadow-[0_10px_40px_rgba(0,0,0,0.7)]"
        />

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.85 }}
          className="mt-7 max-w-xl text-balance text-[17px] font-medium leading-relaxed text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.7),0_2px_22px_rgba(0,0,0,0.85)] md:text-xl"
        >
          A city builder with real depth. Raise an island metropolis, live in it at street level, defend it from eleven
          rival nations — and find the things nobody told you were there.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 1.05 }}
          className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Magnetic>
            <a href="#city" className="btn btn-primary">
              Watch it grow
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </a>
          </Magnetic>
          <Magnetic>
            <a href="#follow" className="btn btn-ghost !bg-[rgba(6,9,15,0.55)] hover:!bg-[rgba(6,9,15,0.75)]">
              Wishlist · Coming soon
            </a>
          </Magnetic>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
        >
          <div className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] tracking-[0.22em] text-white/75">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green" />
            {site.status.toUpperCase()}
          </div>
          {!soundOn && (
            <button
              type="button"
              data-sfx="none"
              onClick={() => {
                sound.enable();
                sound.play("chime", { gain: 0.2, rate: 1.5, reverb: 0.4 });
              }}
              className="glass inline-flex items-center gap-2 rounded-full px-4 py-3 min-h-[44px] text-[11px] tracking-[0.22em] text-gold transition hover:bg-white/10 active:scale-95 touch-manipulation"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M11 5 6 9H3v6h3l5 4z" />
                <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
              </svg>
              TAP FOR SOUND
            </button>
          )}
        </motion.div>
      </motion.div>
      <SoundZone zone="city-day" />

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 md:bottom-8"
        aria-hidden
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/30 p-1">
          <motion.span
            className="block h-2 w-1 rounded-full bg-white/80"
            animate={{ y: [0, 14, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
