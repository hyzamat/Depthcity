"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { sound } from "@/lib/sound/engine";
import { site } from "@/content/site";

const MEDIA = "/media/trailer";

/** 1080p when the player is shown big enough to need it, 720p otherwise (and on a slow or metered link). */
function pickSource() {
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  const slow = !!conn && (conn.saveData || /(^|-)(2g|3g)$/.test(conn.effectiveType ?? ""));
  // the player is at most 72rem (1152 px) wide, and never wider than the viewport
  const px = Math.min(window.innerWidth, 1152) * Math.min(window.devicePixelRatio || 1, 2);
  return `${MEDIA}/official-${!slow && px > 1000 ? "1080" : "720"}.mp4`;
}

/**
 * "Watch the trailer" button + a full-screen player for the official trailer (with its own score).
 * Nothing is downloaded until the visitor asks for it; the site's ambient sound steps aside while it plays.
 * The player is portalled to <body>: the button sits inside transformed/animated hero layers, which would
 * otherwise become the containing block of its position: fixed overlay.
 */
export default function TrailerButton({ className = "btn btn-primary", label = "Watch the trailer" }: { className?: string; label?: string }) {
  const [open, setOpen] = useState(false);
  const [src, setSrc] = useState<string | null>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const resumeSound = useRef(false);

  useEffect(() => {
    if (!open) return;
    resumeSound.current = sound.enabled;
    if (sound.enabled) sound.disable();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    // keyboard users land on the dialog, and go back to the button afterwards
    const t = window.setTimeout(() => closeBtn.current?.focus(), 50);
    const back = trigger.current;
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      if (resumeSound.current) sound.enable();
      back?.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <>
      <button
        ref={trigger}
        type="button"
        data-sfx="none"
        onClick={() => {
          setSrc(pickSource());
          setOpen(true);
        }}
        className={className}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M7 4.5v15l13-7.5z" />
        </svg>
        {label}
      </button>

      {src &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                className="fixed inset-0 z-[70] flex items-center justify-center bg-black/92 p-3 md:p-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
                role="dialog"
                aria-modal="true"
                aria-label={`${site.name} official trailer`}
                data-lenis-prevent
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full max-w-6xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black ring-1 ring-white/10">
                    <video
                      src={src}
                      poster={`${MEDIA}/official-poster.webp`}
                      controls
                      autoPlay
                      playsInline
                      preload="auto"
                      className="h-full w-full"
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-4 text-xs text-white/60">
                    <span className="font-display tracking-[0.25em]">{site.name} · OFFICIAL TRAILER</span>
                    <span className="text-right">Recorded in the game · Original score</span>
                  </div>
                  <button
                    ref={closeBtn}
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close the trailer"
                    className="glass absolute -right-1 -top-12 flex h-11 w-11 items-center justify-center rounded-full text-white md:-right-5 md:-top-5 touch-manipulation active:scale-95"
                  >
                    ✕
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
