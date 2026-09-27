"use client";

import { motion } from "framer-motion";
import { pillars } from "@/content/site";
import { Reveal } from "./ui/Reveal";
import SectionHeading from "./ui/SectionHeading";

const ACCENT: Record<string, string> = {
  sky: "from-sky/25 to-blue/5 text-sky",
  ember: "from-ember/25 to-orange/5 text-ember",
  aurora: "from-aurora/25 to-teal/5 text-aurora",
};

export default function Pillars() {
  return (
    <section className="cv-auto relative bg-bg py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeading
          eyebrow="Why “Depth”"
          title="More than a city builder."
          lede="Most city games stop at the skyline. This one keeps going — down to the street, out to the world map, and into the woods after dark."
        />
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal key={p.title} className="card group relative overflow-hidden p-7 md:p-8" delay={i}>
              <div className={`pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${ACCENT[p.accent]} blur-2xl opacity-70 transition-opacity duration-700 group-hover:opacity-100`} />
              <motion.div
                className={`font-display text-[10px] tracking-[0.3em] ${ACCENT[p.accent].split(" ").pop()}`}
              >
                {String(i + 1).padStart(2, "0")}
              </motion.div>
              <h3 className="mt-5 font-display text-xl font-bold text-white md:text-2xl">{p.title}</h3>
              <p className="mt-4 text-[15px] leading-relaxed text-muted">{p.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
