"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { sound } from "@/lib/sound/engine";

export default function Counter({ value, suffix = "", className }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 60, damping: 20, mass: 1 });
  const text = useTransform(spring, (v) => Math.round(v).toLocaleString() + suffix);

  useEffect(() => {
    if (inView) mv.set(value);
  }, [inView, mv, value]);

  useEffect(() => {
    let at = 0;
    const unsub = text.on("change", (v) => {
      if (ref.current) ref.current.textContent = v;
      const now = performance.now();
      if (now - at > 45) {
        at = now;
        sound.play("tick", { gain: 0.18, rate: 1.6 });
      }
    });
    return unsub;
  }, [text]);

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  );
}
