/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { site } from "@/content/site";
import SoundToggle from "./sound/SoundToggle";
import { sound } from "@/lib/sound/engine";

const LINKS = [
  { href: "#city", label: "City" },
  { href: "#daynight", label: "Day & Night" },
  { href: "#street", label: "Street" },
  { href: "#wild", label: "Wild" },
  { href: "#war", label: "War" },
  { href: "#space", label: "Space" },
  { href: "#secrets", label: "Secrets" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setSolid(y > 40));

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={`mx-3 mt-3 flex max-w-7xl items-center justify-between rounded-full border px-4 py-2 transition-[background-color,border-color,box-shadow] duration-500 md:mx-auto md:mt-4 md:px-5 ${
            solid
              ? "border-white/10 bg-[rgba(7,11,20,0.92)] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.7)]"
              : "border-white/12 bg-[rgba(7,11,20,0.62)] shadow-[0_10px_30px_-14px_rgba(0,0,0,0.6)]"
          }`}
        >
          <a href="#top" className="flex items-center gap-3" aria-label={site.name}>
            <img src="/brand/mark-192.png" alt="" className="h-9 w-9 md:h-10 md:w-10" />
            <img src="/brand/wordmark-1200.png" alt={site.name} className="hidden h-5 md:block" />
          </a>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Sections">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-full px-4 py-2 font-display text-[11px] tracking-[0.2em] text-white/70 transition hover:bg-white/8 hover:text-white"
              >
                {l.label.toUpperCase()}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <SoundToggle />
            <a href="#follow" className="btn btn-primary hidden !px-5 !py-2.5 md:inline-flex active:scale-95 touch-manipulation">
              Wishlist
            </a>
            <button
              onClick={() => {
                sound.whoosh(open ? 0.18 : 0.28);
                setOpen((v) => !v);
              }}
              className="glass flex h-11 w-11 items-center justify-center rounded-full lg:hidden touch-manipulation active:scale-95 active:bg-white/20 transition-transform"
              aria-label="Menu"
              aria-expanded={open}
            >
              <span className="relative block h-3 w-4">
                <span className={`absolute left-0 top-0 h-[2px] w-4 bg-white transition ${open ? "translate-y-[5px] rotate-45" : ""}`} />
                <span className={`absolute left-0 top-[5px] h-[2px] w-4 bg-white transition ${open ? "opacity-0" : ""}`} />
                <span className={`absolute left-0 top-[10px] h-[2px] w-4 bg-white transition ${open ? "-translate-y-[5px] -rotate-45" : ""}`} />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-end bg-bg/85 p-6 pb-10 backdrop-blur-xl"
            data-lenis-prevent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ul className="space-y-2">
              {LINKS.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 font-display text-3xl font-bold tracking-wide text-white"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <a href="#follow" onClick={() => setOpen(false)} className="btn btn-primary mt-8 justify-center">
              Wishlist · Coming soon
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
