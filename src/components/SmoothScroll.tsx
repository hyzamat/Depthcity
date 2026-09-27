"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/**
 * Inertial smooth scrolling for mouse wheels and trackpads (Lenis). Phones and tablets are left on
 * native scrolling on purpose: the OS's own momentum is already smooth, and hijacking touch is what
 * makes scroll-driven pages feel laggy on mobile. Lenis moves the real window scroll position, so
 * every scroll-linked animation and the sticky stages keep working unchanged.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      smoothWheel: true,
      syncTouch: false,
      anchors: { offset: 0 },
      autoRaf: true,
      autoToggle: true, // pauses itself while a menu or the gallery sets overflow: hidden
      respectReducedMotion: true,
    });
    return () => lenis.destroy();
  }, []);
  return null;
}
