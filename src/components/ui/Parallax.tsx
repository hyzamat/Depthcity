"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/** Wraps a block and shifts it vertically as it crosses the viewport. */
export default function Parallax({
  children,
  className,
  amount = 80,
  scale = 1,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
  scale?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount]);
  const s = useTransform(scrollYProgress, [0, 1], [scale, 1]);
  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y, scale: s }} className="h-full w-full will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}
