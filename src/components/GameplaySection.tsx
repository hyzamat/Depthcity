"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { gameplay } from "@/content/site";
import { Reveal } from "./ui/Reveal";
import SectionHeading from "./ui/SectionHeading";
import { playWhenAllowed, releaseVideo } from "./ui/media";

const MEDIA = "/media/play";

/**
 * Real gameplay, recorded on the game's own screen (portrait, HUD and all), in a swipeable rail of phones.
 * A phone's clip only loads when the rail comes close, and only the phones actually on screen play.
 */
export default function GameplaySection() {
  const rail = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const onScroll = () => {
    const r = rail.current;
    if (!r) return;
    const start = r.scrollLeft < 8;
    const end = r.scrollLeft + r.clientWidth > r.scrollWidth - 8;
    setEdge((p) => (p.start === start && p.end === end ? p : { start, end }));
  };
  const step = (dir: 1 | -1) => {
    const r = rail.current;
    if (!r) return;
    const card = r.querySelector<HTMLElement>("[data-phone]");
    r.scrollBy({ left: dir * (card ? card.offsetWidth + 24 : r.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <section id="play" className="relative overflow-hidden bg-bg py-24 md:py-36 scroll-mt-24">
      <div className="pointer-events-none absolute left-1/2 top-24 h-[50vh] w-[80vw] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(124,196,255,0.10),transparent_65%)]" />
      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Real gameplay"
            title="Play it in your hand."
            lede="Recorded straight off the game's screen, HUD and all. Draw a road, drop a landmark, set the tax rate, raise an army. Portrait or landscape, phone or tablet — and you can play it entirely offline."
            gradient="sky"
          />
          <div className="hidden shrink-0 gap-2 md:flex">
            <button type="button" onClick={() => step(-1)} disabled={edge.start} aria-label="Previous clips" className="glass flex h-12 w-12 items-center justify-center rounded-full text-white transition hover:bg-white/10 disabled:opacity-30">
              ‹
            </button>
            <button type="button" onClick={() => step(1)} disabled={edge.end} aria-label="More clips" className="glass flex h-12 w-12 items-center justify-center rounded-full text-white transition hover:bg-white/10 disabled:opacity-30">
              ›
            </button>
          </div>
        </div>
      </div>

      <div
        ref={rail}
        onScroll={onScroll}
        className="relative mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-6 [scrollbar-width:none] md:mt-16 md:px-10 lg:px-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))] [&::-webkit-scrollbar]:hidden"
      >
        {gameplay.map((g, i) => (
          <Phone key={g.clip} index={i} {...g} />
        ))}
        <div className="w-px shrink-0" aria-hidden />
      </div>
    </section>
  );
}

/** A phone playing one gameplay clip (only while it is mostly on screen). Also used by the War section. */
export function Phone({ clip, title, body, index, className = "w-[68vw] max-w-[300px] shrink-0 sm:w-[300px]" }: { clip: string; title: string; body: string; index: number; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement | null>(null);
  const visible = useRef(false);
  const [near, setNear] = useState(false);
  const reduced = useReducedMotion();
  // stable callback ref: its cleanup frees the clip when the phone goes away
  const videoRef = useCallback((el: HTMLVideoElement | null) => {
    video.current = el;
    return () => releaseVideo(el);
  }, []);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    // attach the clip a little before the phone scrolls into the page (the rail's own overflow is not widened) ...
    const nearIo = new IntersectionObserver((entries) => entries[entries.length - 1].isIntersecting && setNear(true), { rootMargin: "300px" });
    // ... and play only while most of the phone is on screen
    const playIo = new IntersectionObserver(
      (entries) => {
        const e = entries[entries.length - 1];
        visible.current = e.intersectionRatio > 0.6;
        const v = video.current;
        if (!v) return;
        if (visible.current) playWhenAllowed(v, () => visible.current);
        else v.pause();
      },
      { threshold: [0, 0.6, 1] },
    );
    nearIo.observe(el);
    playIo.observe(el);
    return () => {
      nearIo.disconnect();
      playIo.disconnect();
    };
  }, [reduced, near]);

  return (
    <Reveal className="snap-start" delay={Math.max(0, index) % 4} amount={0.2}>
      <figure data-phone className={className}>
        <div ref={box} className="relative aspect-[9/16] overflow-hidden rounded-[2.1rem] border-[7px] border-[#1a2132] bg-black shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.06)]">
          {/* poster paints at once; the clip replaces it when it can play */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${MEDIA}/${clip}.webp`} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
          {near && !reduced && (
            <video
              ref={videoRef}
              src={`${MEDIA}/${clip}.mp4`}
              muted
              loop
              playsInline
              preload="auto"
              disablePictureInPicture
              aria-label={`${title} — recorded in the game`}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </div>
        <figcaption className="mt-5 px-1">
          {index >= 0 && <div className="font-display text-[10px] tracking-[0.3em] text-sky">{String(index + 1).padStart(2, "0")}</div>}
          <div className="mt-2 font-display text-base font-bold text-white md:text-lg">{title}</div>
          <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
        </figcaption>
      </figure>
    </Reveal>
  );
}
