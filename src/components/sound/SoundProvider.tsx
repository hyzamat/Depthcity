"use client";

import { useEffect, useSyncExternalStore } from "react";
import { sound } from "@/lib/sound/engine";

/** Whether sound is on — re-renders the toggle and the hero pill when it changes. */
export function useSoundEnabled() {
  return useSyncExternalStore(
    sound.subscribe,
    () => sound.enabled,
    () => false,
  );
}

/**
 * Site-wide sound plumbing (renders nothing): every link and button ticks on hover (pointer devices
 * only) and clicks on press — audible only after the visitor has turned sound on for this visit.
 */
export default function SoundProvider() {
  useEffect(() => {
    const hoverable = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const target = (e: Event) => (e.target as Element | null)?.closest?.("a, button, [data-sfx]") as HTMLElement | null;
    let last: Element | null = null;
    const over = (e: Event) => {
      const el = target(e);
      if (!el || el === last) {
        if (!el) last = null;
        return;
      }
      last = el;
      if (el.dataset.sfx === "none") return;
      sound.play("hover", { gain: 0.16, rate: el.classList.contains("btn-primary") ? 1.15 : 1 });
    };
    const click = (e: Event) => {
      const el = target(e);
      if (!el || el.dataset.sfx === "none") return;
      sound.play("click", { gain: 0.4 });
    };
    if (hoverable) document.addEventListener("mouseover", over, { capture: true, passive: true });
    document.addEventListener("click", click, { capture: true, passive: true });
    return () => {
      document.removeEventListener("mouseover", over, { capture: true });
      document.removeEventListener("click", click, { capture: true });
    };
  }, []);

  return null;
}
