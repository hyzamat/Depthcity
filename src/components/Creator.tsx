/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Img from "./ui/Img";
import { Reveal, SplitWords } from "./ui/Reveal";
import { site } from "@/content/site";

export default function Creator() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-bg py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <Reveal className="relative overflow-hidden rounded-[2rem] ring-glow lg:col-span-6" amount={0.3}>
            <motion.div style={{ y }} className="aspect-[4/5] will-change-transform sm:aspect-[4/3] lg:aspect-[4/5]">
              <Img name="island-sea" alt="The whole island seen from the sea, ringed by beaches and turquoise shallows" className="h-[116%] w-full object-cover object-[50%_55%]" sizes="(min-width: 1280px) 760px, (min-width: 1024px) 60vw, (min-width: 640px) 100vw, 180vw" />
            </motion.div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <div className="font-display text-[10px] tracking-[0.3em] text-gold">RECORDED IN-ENGINE · VERSION 1.0</div>
              <div className="mt-1 text-sm text-white/75">Every clip and still on this page was recorded inside the game, from a real city.</div>
            </div>
          </Reveal>

          <div className="lg:col-span-6 lg:pl-6">
            <Reveal as="p" className="eyebrow mb-4">
              The maker
            </Reveal>
            <h2 className="h-display text-[clamp(2rem,5vw,4rem)] text-white">
              <SplitWords text="Built by one engineer, with an unreasonable amount of care." />
            </h2>
            <Reveal as="p" className="lede mt-6" delay={2}>
              <strong className="text-white">{site.creator.name}</strong> is an IT engineer who wanted a city game with
              more underneath, and built one: the economy and the war, the seasons and the weather, the Mayor and the
              family, the trains, the rocket, the robed order in the woods. Every system in {site.name} is there
              because the city needed it.
            </Reveal>
            <Reveal className="card mt-8 p-6 md:p-7" delay={3}>
              <blockquote className="text-[15px] leading-relaxed text-white/85 md:text-base">“{site.creator.quote}”</blockquote>
              <div className="mt-4 flex items-center gap-3">
                <img src="/brand/mark-192.webp" alt="" width={192} height={192} loading="lazy" className="h-9 w-9" />
                <div>
                  <div className="font-display text-sm font-bold text-white">{site.creator.name}</div>
                  <div className="text-xs text-muted">{site.creator.role}</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
