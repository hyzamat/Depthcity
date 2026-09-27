"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { sound } from "@/lib/sound/engine";

const variants: Variants = {
  // opacity + transform only: both stay on the compositor (a blur-in repainted every revealed block)
  hidden: { opacity: 0, y: 28 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 },
  }),
};

export function Reveal({
  children,
  className,
  delay = 0,
  once = true,
  amount = 0.1, // Reduced amount for better mobile triggering
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
  amount?: number | "some" | "all";
  as?: "div" | "p" | "h1" | "h2" | "h3" | "span" | "li";
}) {
  const M = motion[as] as typeof motion.div;
  return (
    <M
      className={className}
      variants={variants}
      custom={delay}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount, margin: "0px 0px -50px 0px" }} // Add negative margin to trigger slightly before scrolling into view completely
    >
      {children}
    </M>
  );
}

const wordWrap: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const word: Variants = {
  hidden: { y: "110%", rotate: 3 },
  show: { y: "0%", rotate: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

/**
 * Splits a heading into words that rise in one after the other.
 * The viewport observer sits on the wrapper (the clipped words themselves would
 * never intersect), and variants propagate down to each word.
 */
export function SplitWords({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <motion.span
      className={className}
      aria-label={text}
      variants={wordWrap}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1, margin: "0px 0px -50px 0px" }} // Same adjustments for words
      transition={{ delayChildren: delay }}
      onViewportEnter={() => sound.whoosh(0.12, 0.7)}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]">
          <motion.span className="split-word inline-block" variants={word}>
            {w}
          </motion.span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </motion.span>
  );
}
