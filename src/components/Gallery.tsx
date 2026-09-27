"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Img from "./ui/Img";
import { Reveal } from "./ui/Reveal";
import SectionHeading from "./ui/SectionHeading";
import { gallery } from "@/content/site";
import { sound } from "@/lib/sound/engine";

export default function Gallery() {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (open !== null && e.key === "ArrowRight") setOpen((open + 1) % gallery.length);
      if (open !== null && e.key === "ArrowLeft") setOpen((open - 1 + gallery.length) % gallery.length);
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = open !== null ? "hidden" : "";
    if (open !== null) sound.whoosh(0.22, 0.45);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <section id="gallery" className="relative bg-bg py-24 md:py-36 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeading
          eyebrow="Everything you can build"
          title="Landmarks from everywhere. Districts of your own."
          lede="Amusement parks, airports, nuclear plants, castles, mountains, beach resorts, army bases, the Eiffel Tower next to a space center. 181 pieces and counting."
          gradient="sky"
        />

        <div className="mt-14 grid auto-rows-[42vw] grid-cols-2 gap-3 [grid-auto-flow:dense] md:auto-rows-[clamp(150px,15.5vw,250px)] md:grid-cols-4 md:gap-4">
          {gallery.map((g, i) => {
            const span = g.span === "big" ? "col-span-2 row-span-2" : g.span === "wide" ? "col-span-2" : "";
            return (
              <Reveal
                key={g.src}
                className={`group relative cursor-zoom-in overflow-hidden rounded-2xl ring-glow md:rounded-3xl ${span}`}
                delay={i % 4}
                amount={0.15}
              >
                <button onClick={() => setOpen(i)} className="absolute inset-0 block text-left" aria-label={`Open ${g.caption}`}>
                  <Img
                    name={g.src}
                    alt={g.caption}
                    className="h-full w-full object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.06]"
                    sizes={g.span ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent p-3 pt-10 transition duration-500 md:translate-y-2 md:p-5 md:pt-14 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                    <div className="font-display text-[10px] font-bold leading-snug text-white sm:text-xs md:text-sm">{g.caption}</div>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <motion.figure
              key={open}
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-h-full max-w-6xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Img name={gallery[open].src} alt={gallery[open].caption} className="max-h-[80svh] w-auto rounded-2xl object-contain" sizes="90vw" />
              <figcaption className="mt-3 flex items-center justify-between text-sm text-white/70">
                <span>{gallery[open].caption}</span>
                <span className="font-display text-xs tracking-widest">
                  {open + 1} / {gallery.length}
                </span>
              </figcaption>
              <button
                className="glass absolute -right-2 -top-2 flex h-11 w-11 items-center justify-center rounded-full text-white md:-right-5 md:-top-5 touch-manipulation active:scale-95 active:bg-white/20"
                onClick={() => setOpen(null)}
                aria-label="Close"
              >
                ✕
              </button>
              <button
                className="glass absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-white md:-left-14 touch-manipulation active:scale-95 active:bg-white/20"
                onClick={() => setOpen((open - 1 + gallery.length) % gallery.length)}
                aria-label="Previous"
              >
                ‹
              </button>
              <button
                className="glass absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-white md:-right-14 touch-manipulation active:scale-95 active:bg-white/20"
                onClick={() => setOpen((open + 1) % gallery.length)}
                aria-label="Next"
              >
                ›
              </button>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
