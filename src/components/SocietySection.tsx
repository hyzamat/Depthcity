"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Img from "./ui/Img";
import { Reveal } from "./ui/Reveal";
import SoundZone from "./sound/SoundZone";

/**
 * The secret society — deliberately quieter than every other section.
 * Grain, low contrast, a slow candle-coloured glow that follows the scroll.
 */
export default function SocietySection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const glowY = useTransform(scrollYProgress, [0, 1], ["-10%", "40%"]);
  const ritualY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section ref={ref} id="secrets" className="relative overflow-hidden bg-[#04060c] py-28 md:py-44 scroll-mt-24">
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

        <div className="mt-16 grid gap-4 md:grid-cols-12">
          <Reveal className="relative overflow-hidden rounded-3xl md:col-span-7" amount={0.25}>
            <motion.div style={{ y: ritualY }} className="aspect-[16/10] will-change-transform md:aspect-[4/3]">
              <Img name="society-ritual" alt="Robed figures in a circle around a bonfire in a forest clearing at night" className="h-[116%] w-full object-cover" sizes="(min-width: 768px) 58vw, 100vw" />
            </motion.div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-6 pt-20">
              <div className="font-display text-[10px] tracking-[0.3em] text-white/50">FOREST RITUAL · PERSISTENT</div>
              <div className="mt-2 max-w-md text-sm text-white/70">The circle stays as long as the clearing does. Build into it, or cut the ring open, and it melts away.</div>
            </div>
          </Reveal>

          <div className="grid gap-4 md:col-span-5">
            <Reveal className="relative overflow-hidden rounded-3xl" amount={0.25} delay={1}>
              <div className="aspect-[16/10]">
                <Img name="society-gathering" alt="Masked figures gathered around a candle beside the town hall after dark" className="h-full w-full object-cover" sizes="(min-width: 768px) 40vw, 100vw" />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-5 pt-16">
                <div className="font-display text-[10px] tracking-[0.3em] text-white/50">BACK-ALLEY GATHERING · NIGHT ONLY</div>
                <div className="mt-2 text-sm text-white/70">Figures materialise beside a building, stand around a candle for half a minute, then vanish one by one.</div>
              </div>
            </Reveal>

            <Reveal className="card relative overflow-hidden p-6" amount={0.4} delay={2}>
              <div className="font-display text-[10px] tracking-[0.3em] text-white/40">IN-GAME NOTIFICATION</div>
              <blockquote className="mt-3 font-display text-base leading-relaxed text-white/85 md:text-lg">
                “Masked figures were seen gathering near Town Hall after dark…”
              </blockquote>
              <p className="mt-3 text-xs text-white/45">Pure mystery set dressing — they never do anything. Probably.</p>
            </Reveal>
          </div>
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
