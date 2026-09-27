"use client";

import { useEffect, useId, useRef } from "react";
import { useInView } from "framer-motion";
import { sound, type Zone } from "@/lib/sound/engine";

/**
 * Drop inside any `relative` section: while that section covers the middle of the screen, its
 * ambience plays. The overlay spans the section, and the observer's root is shrunk to the central
 * band of the viewport, so tall pinned sections hand over exactly when they take the screen.
 */
export default function SoundZone({ zone }: { zone: Zone }) {
  const ref = useRef<HTMLDivElement>(null);
  const key = useId();
  const on = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => {
    if (on) sound.enter(key, zone);
    else sound.leave(key);
    return () => sound.leave(key);
  }, [on, zone, key]);
  return <div ref={ref} className="pointer-events-none absolute inset-0" aria-hidden />;
}

/** Same, for sections that already track their own visibility (pinned stages). */
export function useSoundZone(active: boolean, zone: Zone | null) {
  const key = useId();
  useEffect(() => {
    if (active && zone) sound.enter(key, zone);
    else sound.leave(key);
    return () => sound.leave(key);
  }, [active, zone, key]);
}
