"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Img from "./ui/Img";
import { Reveal } from "./ui/Reveal";
import SoundZone from "./sound/SoundZone";

/**
 * Horizontal scroll strip: the same street corner at three times of day, seen
 * from the avatar's shoes. Pinned; scrolling down slides the strip sideways.
 */
const CARDS = [
  { name: "avatar-day", title: "Noon on Petronas Avenue", body: "Drop your avatar anywhere — a rooftop, a park, the middle of a junction — and walk. The city is solid around you." },
  { name: "avatar-evening", title: "Golden hour", body: "The anime summer sky rolls overhead with real parallax. Cumulus drifts faster than the wisps behind it." },
  { name: "avatar-night", title: "Aurora night", body: "Stars come out as the rose drains from the sky. Some nights it's a galaxy; some nights a green curtain rises." },
  { name: "avatar-street-night", title: "Down the block", body: "Lamps throw moon-white pools. The curb lines glow. Somewhere a police cruiser idles." },
];

export default function StreetView() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0.08, 0.95], ["0%", "-72%"]);
  const xMobile = useTransform(scrollYProgress, [0.08, 0.95], ["0%", "-78%"]);

  return (
    <section ref={ref} id="street" className="relative bg-bg scroll-mt-24" style={{ height: "380svh" }}>
      <SoundZone zone="street" />
      <div className="sticky-stage flex flex-col justify-center">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
          <Reveal as="p" className="eyebrow mb-3">
            Avatar mode
          </Reveal>
          <h2 className="h-display text-[clamp(2rem,5vw,4.25rem)] text-gradient-sky">Step down to the street.</h2>
          <Reveal as="p" className="lede mt-4 max-w-xl max-sm:!text-[15px]" delay={1}>
            Every citizen on the pavement is a real body with real clips. Pick one and it becomes yours — same height as the
            crowd, same streets, a chase camera that leans in behind you.
          </Reveal>
        </div>

        <div className="mt-8 md:mt-12">
          <motion.div className="hidden gap-6 pl-6 md:flex md:pl-10" style={{ x }}>
            {CARDS.map((c, i) => (
              <Card key={c.name} {...c} index={i} />
            ))}
            <div className="w-[10vw] shrink-0" />
          </motion.div>
          <motion.div className="flex gap-4 pl-6 md:hidden" style={{ x: xMobile }}>
            {CARDS.map((c, i) => (
              <Card key={c.name} {...c} index={i} />
            ))}
            <div className="w-[8vw] shrink-0" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Card({ name, title, body, index }: { name: string; title: string; body: string; index: number }) {
  return (
    <figure className="group relative w-[78vw] shrink-0 overflow-hidden rounded-3xl ring-glow md:w-[58vw] lg:w-[46vw]">
      <div className="aspect-[4/5] max-h-[50svh] w-full overflow-hidden sm:aspect-[16/10] sm:max-h-none">
        <Img
          name={name}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
          sizes="(min-width: 1024px) 46vw, (min-width: 768px) 58vw, 78vw"
        />
      </div>
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-5 pt-16 md:p-7">
        <div className="mb-1 font-display text-[10px] tracking-[0.3em] text-sky">{String(index + 1).padStart(2, "0")}</div>
        <div className="font-display text-lg font-bold text-white md:text-2xl">{title}</div>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-white/75">{body}</p>
      </figcaption>
    </figure>
  );
}
