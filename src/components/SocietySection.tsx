"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "./ui/Reveal";
import SoundZone from "./sound/SoundZone";

/**
 * The secret society — deliberately quieter than every other section, and the only one without footage:
 * the robed order is something for players to find. A slow candle-coloured glow follows the scroll.
 */
export default function SocietySection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const glowY = useTransform(scrollYProgress, [0, 1], ["-10%", "40%"]);

  return (
    <section ref={ref} id="secrets" className="relative overflow-hidden bg-[#04060c] py-24 md:py-36 scroll-mt-24">
      <SoundZone zone="forest-night" />
      <motion.div
        className="pointer-events-none absolute left-1/2 top-0 h-[70vh] w-[90vw] -translate-x-1/2 rounded-full"
        style={{ y: glowY, background: "radial-gradient(ellipse at center, rgba(255,170,80,0.10), transparent 65%)" }}
      />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal as="p" className="eyebrow mb-4 !text-white/40">
            Nobody will tell you this
          </Reveal>
          <h2 className="h-display text-[clamp(2.2rem,6vw,5rem)] text-white/90">
            <Whisper text="Something is watching." />
          </h2>
          <Reveal as="p" className="lede mx-auto mt-6 max-w-lg !text-white/55" delay={2}>
            Leave a clearing in the forest — a patch of grass ringed by trees — and you may find a circle already standing
            in it. Robed. Armed. Facing a fire. They were there before you looked. They will be there tomorrow.
          </Reveal>
        </div>

        {/* No pictures on purpose: they are for players to find. */}
        <div className="mx-auto mt-14 grid max-w-5xl gap-4 md:grid-cols-3">
          <Reveal className="card relative overflow-hidden p-6" amount={0.4}>
            <div className="font-display text-[10px] tracking-[0.3em] text-white/45">FOREST RITUAL · PERSISTENT</div>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              The circle stays as long as the clearing does. Build into it, or cut the ring open, and it melts away.
            </p>
          </Reveal>
          <Reveal className="card relative overflow-hidden p-6" amount={0.4} delay={1}>
            <div className="font-display text-[10px] tracking-[0.3em] text-white/45">BACK-ALLEY GATHERING · NIGHT ONLY</div>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Figures appear beside a building after dark, stand around a candle for half a minute, then vanish one by one.
            </p>
          </Reveal>
          <Reveal className="card relative overflow-hidden p-6" amount={0.4} delay={2}>
            <div className="font-display text-[10px] tracking-[0.3em] text-white/40">IN-GAME NOTIFICATION</div>
            <blockquote className="mt-3 font-display text-sm leading-relaxed text-white/85 md:text-base">
              “Masked figures were seen gathering near Town Hall after dark…”
            </blockquote>
            <p className="mt-3 text-xs text-white/45">Pure mystery set dressing — they never do anything. Probably.</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** Letters fade in out of order, like a whisper resolving. Words stay unbreakable. */
function Whisper({ text }: { text: string }) {
  const total = text.replace(/ /g, "").length;
  const words = text.split(" ");
  const starts = words.map((_, w) => words.slice(0, w).join("").length);
  return (
    <span aria-label={text}>
      {words.map((word, w) => (
        <span key={w} className="inline-block whitespace-nowrap" aria-hidden>
          {word.split("").map((ch, j) => {
            const i = starts[w] + j;
            return (
              <motion.span
                key={j}
                className="inline-block"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 1.2, delay: (((i * 7) % total) / total) * 1.2, ease: "easeOut" }}
              >
                {ch}
              </motion.span>
            );
          })}
          {w < words.length - 1 ? "\u00a0" : ""}
        </span>
      ))}
    </span>
  );
}
