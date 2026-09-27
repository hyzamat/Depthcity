"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import type { ReelChapter } from "@/content/site";
import { pad } from "./scrollRange";
import { sound, type Zone } from "@/lib/sound/engine";
import { useSoundZone } from "../sound/SoundZone";

/**
 * Pinned cinematic reel: real in-game footage, one chapter per screen of scroll. The chapter on
 * stage autoplays (muted, looping) and cross-fades to the next as you scroll; the title card and the
 * chapter rail follow. Clips attach only once the reel is close, and only the current + next chapter,
 * so a visitor downloads the footage they actually reach.
 */
const MEDIA = "/media/cine";

const ACCENTS = {
  ember: { text: "!text-ember", bar: "bg-ember" },
  aurora: { text: "!text-aurora", bar: "bg-aurora" },
  gold: { text: "!text-gold", bar: "bg-gold" },
} as const;

type Tier = "1080" | "1440" | "tall";

function pickTier(): Tier {
  if (window.matchMedia("(max-aspect-ratio: 4/5)").matches) return "tall";
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  // device pixels a 16:9 clip must cover full-bleed (object-cover)
  const need = Math.max(window.innerWidth, (window.innerHeight * 16) / 9) * dpr;
  return need > 1920 * 1.35 ? "1440" : "1080";   // 1440p only on very large screens: decoding it costs scroll smoothness
}

export default function CineReel({
  id,
  chapters,
  accent,
  zone,
}: {
  id?: string;
  chapters: ReelChapter[];
  accent: keyof typeof ACCENTS;
  /** ambience while the reel is on stage (see lib/sound/engine ZONES) */
  zone?: Zone;
}) {
  const ref = useRef<HTMLElement>(null);
  const n = chapters.length;
  const near = useInView(ref, { margin: "100% 0px 100% 0px", once: true });
  const onStage = useInView(ref);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const a = ACCENTS[accent];

  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  // Furthest chapter whose clip is attached: the current one plus the next (never detached again).
  const [reach, setReach] = useState(1);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.min(n - 1, Math.max(0, Math.floor(v * n)));
    if (i !== activeRef.current) {
      activeRef.current = i;
      setActive(i);
      if (onStage) sound.whoosh(0.14, 0.6);
    }
    setReach((prev) => Math.max(prev, i + 1));
  });
  useSoundZone(onStage, zone ?? null);
  useEffect(() => {
    if (onStage) sound.intensity(n > 1 ? active / (n - 1) : 1);
  }, [onStage, active, n]);

  const [tier, setTier] = useState<Tier | null>(null);
  useEffect(() => {
    const mq = window.matchMedia("(max-aspect-ratio: 4/5)");
    const pick = () => setTier(pickTier());
    pick();
    mq.addEventListener("change", pick);
    return () => mq.removeEventListener("change", pick);
  }, []);

  // Play the chapter on stage from the top; everything else waits paused.
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const lastActive = useRef(-1);
  useEffect(() => {
    const changed = lastActive.current !== active;
    lastActive.current = active;
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (i === active && onStage && !reduced) {
        if (changed) v.currentTime = 0;
        if (v.paused) v.play().catch(() => {});
      } else if (!v.paused) {
        v.pause();
      }
    });
  }, [active, onStage, reduced, reach, near, tier]);

  const c = chapters[active];

  return (
    <section ref={ref} id={id} className="relative bg-bg" style={{ height: `${n * 100 + 40}svh` }}>
      <div className="sticky-stage">
        {chapters.map((ch, i) => (
          <div
            key={ch.clip}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${i === active ? "opacity-100" : "opacity-0"}`}
            aria-hidden={i !== active}
          >
            <picture>
              <source media="(max-aspect-ratio: 4/5)" srcSet={`${MEDIA}/${ch.clip}-tall.webp`} />
              <img src={`${MEDIA}/${ch.clip}.webp`} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
            </picture>
            {tier && near && i <= reach && (
              <video
                ref={(el) => {
                  videos.current[i] = el;
                }}
                key={tier}
                src={`${MEDIA}/${ch.clip}-${tier}.mp4`}
                muted
                loop
                playsInline
                preload="auto"
                disablePictureInPicture
                aria-label={`${ch.label} — ${ch.title} (recorded in the game)`}
                className="absolute inset-0 h-full w-full object-cover"
                onCanPlay={(e) => {
                  if (i === lastActive.current && !reduced) e.currentTarget.play().catch(() => {});
                }}
              />
            )}
          </div>
        ))}

        {/* scrims + cinema bars */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-bg/80 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-bg via-bg/60 to-transparent md:h-[55%] md:via-bg/30" />
        <div className="vignette pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-x-0 top-0 hidden h-[5svh] bg-black md:block" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[5svh] bg-black md:block" />

        {/* title card */}
        <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-12 md:px-10 md:pb-[calc(5svh+3rem)]">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="relative min-h-[15rem] w-full max-w-2xl md:min-h-[16rem] md:flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-x-0 bottom-0"
                >
                  <p className={`eyebrow mb-3 ${a.text}`}>
                    {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")} · {c.label}
                  </p>
                  <h3 className="h-display text-[clamp(1.8rem,4vw,3.4rem)] text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.55)]">
                    {c.title}
                  </h3>
                  <p className="lede mt-4 max-w-xl !text-white/75 max-sm:!text-[15px]">{c.body}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* chapter rail */}
            <ol className="flex gap-3 md:w-64 md:flex-col md:gap-4" aria-label="Chapters">
              {chapters.map((ch, i) => (
                <ChapterTick key={ch.clip} index={i} n={n} label={ch.label} active={i === active} progress={scrollYProgress} bar={a.bar} />
              ))}
            </ol>
          </div>
        </div>

        <div className="pointer-events-none absolute right-6 top-[calc(5svh+5rem)] hidden font-display text-[10px] tracking-[0.3em] text-white/50 md:right-10 md:block">
          RECORDED IN-GAME
        </div>
      </div>
    </section>
  );
}

function ChapterTick({
  index,
  n,
  label,
  active,
  progress,
  bar,
}: {
  index: number;
  n: number;
  label: string;
  active: boolean;
  progress: MotionValue<number>;
  bar: string;
}) {
  const fill = useTransform(progress, ...pad([index / n, (index + 1) / n], [0, 1]));
  return (
    <li className="min-w-0 flex-1 md:flex-none">
      <div
        className={`mb-2 hidden truncate font-display text-[10px] tracking-[0.25em] transition-colors duration-500 [text-shadow:0_1px_10px_rgba(0,0,0,0.85)] md:block ${
          active ? "text-white" : "text-white/60"
        }`}
      >
        {String(index + 1).padStart(2, "0")} {label.toUpperCase()}
      </div>
      <div className="h-[2px] overflow-hidden rounded-full bg-white/15">
        <motion.div className={`h-full origin-left ${bar}`} style={{ scaleX: fill }} />
      </div>
    </li>
  );
}
