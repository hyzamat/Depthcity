/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, type CSSProperties } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Img from "./ui/Img";
import Magnetic from "./ui/Magnetic";
import { pad } from "./ui/scrollRange";
import { hero, site } from "@/content/site";
import TrailerButton from "./TrailerButton";
import SoundZone from "./sound/SoundZone";
import { useSoundEnabled } from "./sound/SoundProvider";
import { sound } from "@/lib/sound/engine";

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
        <div className="intro-zoom h-full w-full">
          <Img
            name={hero.image}
            alt={hero.alt}
            className="h-full w-full object-cover"
            style={{ objectPosition: hero.position }}
            portrait
            priority
            sizes="118vw"
          />
        </div>
      </motion.div>
      <motion.div className="absolute inset-0 bg-bg" style={{ opacity: veil }} />
      {/* Light touch: the bright sky and city stay vivid; only the copy gets a soft pool of shade behind it,
          and the bottom melts into the page. */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,9,15,0.3)_0%,rgba(6,9,15,0)_20%,rgba(6,9,15,0.12)_40%,rgba(6,9,15,0.5)_66%,rgba(6,9,15,0.8)_86%,#06090f_100%)]" />

      {/* content — animated in with CSS (.intro), so it is part of the first paint */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 pb-24 pt-24 text-center md:pb-16"
      >
        <div className="intro relative" style={{ "--d": "0.15s" } as CSSProperties}>
          <div className="absolute inset-0 -z-10 scale-150 rounded-full bg-[radial-gradient(circle,rgba(124,196,255,0.25),transparent_65%)]" />
          <img
            src="/brand/mark-512.webp"
            alt=""
            width={512}
            height={512}
            fetchPriority="high"
            className="mx-auto h-28 w-28 drop-shadow-[0_20px_50px_rgba(0,0,0,0.55)] sm:h-36 sm:w-36 md:h-44 md:w-44"
          />
        </div>

        <h1 className="intro mt-5" style={{ "--d": "0.35s" } as CSSProperties}>
          <img
            src="/brand/wordmark-1200.webp"
            alt={site.name}
            width={1200}
            height={220}
            className="w-[min(80vw,600px)] drop-shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
          />
        </h1>
        <p
          className="intro mt-4 whitespace-nowrap font-display text-[9px] font-bold tracking-[0.26em] text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.8)] sm:text-xs sm:tracking-[0.42em]"
          style={{ "--d": "0.5s" } as CSSProperties}
        >
          {site.motto}
        </p>

        <p
          className="intro mt-6 max-w-xl text-balance text-[17px] font-medium leading-relaxed text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.7),0_2px_22px_rgba(0,0,0,0.85)] md:text-xl"
          style={{ "--d": "0.65s" } as CSSProperties}
        >
          {hero.pitch}
        </p>

        <div className="intro mt-9 flex flex-col items-center gap-3 sm:flex-row" style={{ "--d": "0.85s" } as CSSProperties}>
          <Magnetic>
            <TrailerButton />
          </Magnetic>
          <Magnetic>
            <a href="#city" className="btn btn-ghost !bg-[rgba(6,9,15,0.55)] hover:!bg-[rgba(6,9,15,0.75)]">
              Explore the city
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </a>
          </Magnetic>
        </div>

        <div className="intro mt-10 flex flex-wrap items-center justify-center gap-2" style={{ "--d": "1.1s" } as CSSProperties}>
          <div className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] tracking-[0.22em] text-white/80">
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
        </div>
      </motion.div>
      <SoundZone zone="city-day" />

      {/* scroll cue */}
      <div className="intro absolute bottom-6 left-1/2 z-10 -translate-x-1/2 md:bottom-8" style={{ "--d": "1.6s" } as CSSProperties} aria-hidden>
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/30 p-1">
          <motion.span
            className="block h-2 w-1 rounded-full bg-white/80"
            animate={{ y: [0, 14, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </section>
  );
}
