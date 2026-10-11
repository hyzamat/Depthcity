"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { pad } from "./ui/scrollRange";
import { sound } from "@/lib/sound/engine";
import { useSoundZone } from "./sound/SoundZone";
import { useDwell } from "./ui/useDwell";

/**
 * Scroll-scrubbed footage recorded in the real game (DEPTH CITY 1.0, trailer shoot 2026-10-10): a locked
 * camera over downtown while the day cycle runs from sunset to full night and the skyline switches on.
 * The phase label follows the frame on screen.
 */
const PHASES = [
  { until: 0.16, label: "Sunset", note: "Rose light over the island, the sea going pink." },
  { until: 0.46, label: "Dusk", note: "The sky runs violet. The first windows light up." },
  { until: 0.74, label: "Blue hour", note: "Towers glow against a deep blue sky." },
  { until: 1.01, label: "Night", note: "Every tower lit against the night sky." },
];

/** Recording metadata — A14_sunset_timelapse, 0 → 4.4 s at 30 fps. */
const CLIP = { fps: 30, frames: 132 };
const MEDIA = "/media/daynight";
const FILE = "city-dusk";

/**
 * The footage is recorded with a locked camera (so every frame compresses to almost nothing and the city stays
 * razor sharp); a slow push-in happens here instead, as a final/initial scale ratio.
 */
const PUSH_IN = { wide: 0.9, tall: 0.9 };

/**
 * Wide recordings by pixel width. Scrubbing decodes a frame on every scroll step, so the 1080p clip is used
 * up to a generous 1.6x stretch and 1440p only on very large screens — smooth scrolling beats the last pixel.
 */
const WIDE_TIERS = [1920, 2560] as const;
const TIER_FILE: Record<(typeof WIDE_TIERS)[number], string> = { 1920: "1080", 2560: "1440" };

/** `alt` is the next lighter recording, used when the download turns out to be slow. */
type Variant = { kind: "wide" | "tall"; file: string; alt?: string };

function pickVariant(): Variant {
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  const slow = !!conn && (conn.saveData || /(^|-)(2g|3g)$/.test(conn.effectiveType ?? ""));
  if (window.matchMedia("(max-aspect-ratio: 4/5)").matches) {
    // Phones: 1080×1920 (5.3 MB) for sharpness, 720×1280 (2 MB) when the connection is known or measured slow.
    return slow ? { kind: "tall", file: `${FILE}-tall-720.mp4` } : { kind: "tall", file: `${FILE}-tall.mp4`, alt: `${FILE}-tall-720.mp4` };
  }
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  // Device pixels the 16:9 clip must cover (object-cover) at the deepest point of the push-in.
  const need = (Math.max(window.innerWidth, (window.innerHeight * 16) / 9) * dpr) / PUSH_IN.wide;
  let i = WIDE_TIERS.findIndex((w) => need <= w * 1.6);
  if (i < 0) i = WIDE_TIERS.length - 1;
  if (slow) i = Math.max(0, i - 1);
  const wide = (j: number) => `${FILE}-wide-${TIER_FILE[WIDE_TIERS[j]]}.mp4`;
  return { kind: "wide", file: wide(i), alt: i > 0 ? wide(i - 1) : undefined };
}

function phaseAt(p: number) {
  return Math.max(0, PHASES.findIndex((ph) => p < ph.until));
}

export default function DayNight() {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const target = useRef(0);
  // The clip is 5-7 MB: start fetching two screens early so a phone on slow Wi-Fi has it before the section
  // arrives, and keep it (latched). The <video> itself, and its decoder, only lives while the section is near.
  const approaching = useDwell(useInView(ref, { margin: "200% 0px 200% 0px" }));
  const [near, setNear] = useState(false);
  if (approaching && !near) setNear(true); // latch: once fetched, the clip stays
  const live = useInView(ref, { margin: "150% 0px 150% 0px" });
  const inView = useInView(ref, { margin: "10% 0px 10% 0px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // Phones in portrait get the tall recording; everything else a wide one sized to the screen.
  const [variant, setVariant] = useState<Variant | null>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const readyRef = useRef(false);
  const primed = useRef(false);
  // Every new source is a fresh <video> (key={src}) that has to be primed again.
  const switchSrc = (s: string) => {
    primed.current = false;
    setSrc(s);
  };
  const loadBar = useRef<HTMLDivElement>(null);
  const debug = useRef<HTMLPreElement>(null);
  const [showDebug, setShowDebug] = useState(false);
  const log = useRef<string[]>([]);
  const note = useCallback((s: string) => {
    log.current = [...log.current.slice(-7), s];
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-aspect-ratio: 4/5)");
    const pick = () => setVariant((prev) => {
      const next = pickVariant();
      return prev && prev.file === next.file ? prev : next;
    });
    pick();
    mq.addEventListener("change", pick);
    // `?debug` prints the video's state on top of the stage — for checking a phone that stays on the poster.
    setShowDebug(/[?&]debug/.test(window.location.search));
    return () => mq.removeEventListener("change", pick);
  }, []);

  // Download the whole clip once the section is close, so every seek is local and instant. The thin bar at the
  // foot of the stage shows how far along it is; if anything about the blob fails, stream the file instead.
  const file = variant ? `${MEDIA}/${variant.file}` : null;
  useEffect(() => {
    if (!near || !file) return;
    let url: string | null = null;
    let cancelled = false;
    readyRef.current = false;
    setReady(false);
    if (loadBar.current) loadBar.current.style.transform = "scaleX(0)";
    (async () => {
      try {
        const r = await fetch(file);
        if (!r.ok || !r.body) throw new Error(`HTTP ${r.status}`);
        const total = +(r.headers.get("content-length") ?? 0);
        const reader = r.body.getReader();
        const chunks: Uint8Array[] = [];
        let got = 0;
        const started = performance.now();
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          if (cancelled) return reader.cancel();
          chunks.push(value);
          got += value.length;
          if (total && loadBar.current) loadBar.current.style.transform = `scaleX(${got / total})`;
          // A megabyte in, the rate is known: if the rest would take longer than a few seconds, take the lighter clip.
          if (variant?.alt && total && got > 1_000_000) {
            const eta = ((total - got) * (performance.now() - started)) / got / 1000;
            if (eta > 5) {
              note(`slow link (${Math.round(eta)}s left) → ${variant.alt}`);
              reader.cancel();
              setVariant({ kind: variant.kind, file: variant.alt });
              return;
            }
          }
        }
        if (cancelled) return;
        url = URL.createObjectURL(new Blob(chunks as BlobPart[], { type: "video/mp4" }));
        note(`fetched ${(got / 1048576).toFixed(1)} MB → blob`);
        switchSrc(url);
      } catch (e) {
        if (cancelled) return;
        note(`fetch failed (${e instanceof Error ? e.message : e}) → streaming`);
        switchSrc(file);
      }
    })();
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [near, file, variant, note]);

  // Phones will not paint a seeked frame (iOS) or even load one (Android with metadata-only preload) until the
  // clip has played once, so play/pause it silently as soon as it can. Low Power Mode refuses autoplay, in which
  // case the first touch on the page is used as the gesture.
  const prime = useCallback(() => {
    const v = videoRef.current;
    if (!v || primed.current) return;
    primed.current = true;
    v.play()
      .then(() => {
        v.pause();
        v.currentTime = target.current * (v.duration || 0);
        note("primed");
      })
      .catch((e) => {
        primed.current = false;
        note(`play refused: ${e?.name ?? e} — waiting for a touch`);
      });
  }, [note]);
  // Leaving the neighbourhood drops the <video>; a fresh one comes back with the same (blob) source.
  useEffect(() => {
    if (live) return;
    primed.current = false;
    readyRef.current = false;
    setReady(false);
  }, [live]);
  useEffect(() => {
    if (!src || !live) return;
    const v = videoRef.current;
    if (v && v.readyState >= 1) prime();
    const onTouch = () => prime();
    window.addEventListener("touchend", onTouch, { passive: true });
    window.addEventListener("pointerdown", onTouch, { passive: true });
    // A blob the browser cannot open gives no error and no metadata: switch to streaming the file.
    const bail = window.setTimeout(() => {
      if (src.startsWith("blob:") && file && (videoRef.current?.readyState ?? 0) < 1) {
        note("no metadata from blob in 6s → streaming");
        switchSrc(file);
      }
    }, 6000);
    return () => {
      window.removeEventListener("touchend", onTouch);
      window.removeEventListener("pointerdown", onTouch);
      window.clearTimeout(bail);
    };
  }, [src, live, file, prime, note]);

  // Scrub: follow the scroll position with a little easing, one seek at a time.
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    target.current = v;
  });
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !src || !inView) return;
    let raf = 0;
    let shown = v.currentTime;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (debug.current) {
        debug.current.textContent =
          `${variant?.file}  src=${src.startsWith("blob:") ? "blob" : "file"}  readyState=${v.readyState}  ` +
          `t=${v.currentTime.toFixed(2)}/${(v.duration || 0).toFixed(2)}  seeking=${v.seeking}  primed=${primed.current}  ` +
          `ready=${readyRef.current}  scroll=${target.current.toFixed(3)}  err=${v.error?.code ?? "-"}\n${log.current.join("\n")}`;
      }
      if (!v.duration || Number.isNaN(v.duration)) return;
      // Reveal as soon as a frame is decodable — not on a particular event, since phones fire them differently.
      if (!readyRef.current && v.readyState >= 2) {
        readyRef.current = true;
        setReady(true);
        note("ready");
      }
      const want = Math.min(v.duration - 1 / CLIP.fps / 2, target.current * v.duration);
      shown += (want - shown) * 0.35;
      if (Math.abs(want - shown) < 0.004) shown = want;
      if (!v.seeking && Math.abs(v.currentTime - shown) > 1 / CLIP.fps / 3) v.currentTime = shown;
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, inView, live]);

  // The sky dial moves every scroll frame, so it writes straight to the DOM; React only re-renders when the
  // phase label actually changes (four times over the whole section).
  const dialRef = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const idxRef = useRef(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const p = Math.min(1, Math.max(0, v));
    if (dialRef.current) dialRef.current.style.left = `${p * 100}%`;
    const i = phaseAt(p);
    if (i !== idxRef.current) {
      idxRef.current = i;
      setIdx(i);
      if (inView) sound.play("chime", { gain: 0.16, rate: [1.3, 1.0, 0.85, 0.7][i], reverb: 0.55 });
    }
  });
  useSoundZone(inView, idx >= 2 ? "city-night" : "city-day");

  // Night deepens the scrim a touch so the copy stays crisp over the lit city.
  const nightScrim = useTransform(scrollYProgress, ...pad([0.82, 1], [0, 0.08]));
  const introScale = useTransform(scrollYProgress, ...pad([0, 0.12], [1.06, 1]));

  // Same eased push-in the shot was framed with in-engine: ortho size smoothsteps start → end.
  const pushRatio = useRef(PUSH_IN.wide);
  pushRatio.current = variant?.kind === "tall" ? PUSH_IN.tall : PUSH_IN.wide;
  const pushIn = useTransform(scrollYProgress, (v) => {
    const p = Math.min(1, Math.max(0, v));
    const e = p * p * (3 - 2 * p);
    return 1 / (1 - e * (1 - pushRatio.current));
  });
  const stageScale = useTransform(() => introScale.get() * pushIn.get());

  const poster = variant ? `${MEDIA}/${FILE}-${variant.kind}-poster.webp` : undefined;

  return (
    <section ref={ref} id="daynight" className="relative scroll-mt-24" style={{ height: "620svh" }}>
      <div className="sticky-stage bg-bg">
        <motion.div className="absolute inset-0 will-change-transform" style={{ scale: stageScale }}>
          {/* poster first (instant paint), real footage fades in on top once it can seek */}
          <picture>
            <source media="(max-aspect-ratio: 4/5)" srcSet={`${MEDIA}/${FILE}-tall-poster.webp`} />
            <img
              src={`${MEDIA}/${FILE}-wide-poster.webp`}
              alt="DEPTH CITY downtown at sunset, recorded in the game"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </picture>
          {src && live && (
            <video
              ref={videoRef}
              key={src}
              src={src}
              poster={poster}
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              aria-label="The city turns from sunset to night and the skyline lights up — recorded in the game"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
              onLoadedMetadata={() => {
                note("loadedmetadata");
                prime();
              }}
              onLoadedData={() => note("loadeddata")}
              onError={(e) => {
                const err = e.currentTarget.error;
                note(`video error ${err?.code ?? "?"} ${err?.message ?? ""}`);
                // The blob could not be decoded/opened by this browser: stream the file instead (byte ranges).
                if (src.startsWith("blob:") && file) switchSrc(file);
              }}
            />
          )}
        </motion.div>

        {/* footage download progress — only visible until the clip can seek */}
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[3px] bg-white/10 transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`}
          aria-hidden
        >
          <div ref={loadBar} className="h-full origin-left bg-gold" style={{ transform: "scaleX(0)" }} />
        </div>
        {showDebug && (
          <pre
            ref={debug}
            className="pointer-events-none absolute left-3 top-24 z-30 max-w-[90vw] whitespace-pre-wrap rounded-lg bg-black/80 p-3 font-mono text-[11px] leading-snug text-green"
          />
        )}

        {/* scrims kept light — the footage is the point; they only guard the nav and the copy */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-bg/60 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[78%] bg-gradient-to-t from-bg via-bg/75 to-transparent md:h-[55%] md:via-bg/35" />
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[48%] bg-gradient-to-r from-bg/55 to-transparent md:block" />
        <motion.div className="pointer-events-none absolute inset-0 bg-bg" style={{ opacity: nightScrim }} />

        {/* copy */}
        <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-14 md:px-10 md:pb-16">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow mb-3">A city that keeps time</p>
              <h2 className="h-display text-[clamp(1.9rem,3.8vw,3.5rem)] text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
                Then the sun goes down, and the skyline switches on.
              </h2>
              <p className="lede mt-4 max-w-lg !text-white/75">
                A full day-and-night cycle runs over the island. Scroll to run the clock: rose sunset, violet dusk, a deep
                blue hour, and a city lit tower by tower. Filmed in the game with a locked camera.
              </p>
            </div>

            <div className="glass flex w-full flex-col gap-3 self-start rounded-2xl px-5 py-4 sm:w-72 md:self-auto">
              <div className="flex items-center justify-between font-display text-[10px] tracking-[0.3em] text-white/60">
                <span>SUNSET</span>
                <span>NIGHT</span>
              </div>
              {/* sky dial: the marker follows the frame on screen */}
              <div className="relative h-1.5 rounded-full bg-[linear-gradient(90deg,#f6b3a8,#b98bd6_35%,#3b4fa8_65%,#0d1640)]">
                <div ref={dialRef} className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-gold shadow-[0_0_14px_rgba(245,194,66,0.8)]" style={{ left: "0%" }} />
              </div>
              <div className="relative h-11">
                <motion.div key={idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                  <div className="font-display text-sm font-bold tracking-wider text-gold">{PHASES[idx].label.toUpperCase()}</div>
                  <div className="mt-1 text-xs leading-snug text-white/70">{PHASES[idx].note}</div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
