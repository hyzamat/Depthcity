/**
 * Small helpers shared by every muted, looping <video> on the page (reels, gameplay phones, the scrub).
 */

const GESTURES = ["click", "touchend", "keydown"] as const;

/**
 * play(), and if the browser refuses (iOS Low Power Mode, some data savers), try again on the visitor's next
 * tap or key press — scrolling is not a user gesture, a tap is. `still()` says whether the clip should still be
 * playing by then (the visitor may have moved on).
 */
export function playWhenAllowed(v: HTMLVideoElement, still: () => boolean) {
  v.play().catch((e: unknown) => {
    if ((e as { name?: string })?.name !== "NotAllowedError") return;
    const retry = () => {
      for (const t of GESTURES) window.removeEventListener(t, retry);
      if (v.isConnected && still()) v.play().catch(() => {});
    };
    for (const t of GESTURES) window.addEventListener(t, retry, { passive: true });
  });
}

/**
 * Drop a <video>'s download and decoder right away. Chrome does this when the element is removed, but WebKit keeps a
 * detached element's player until garbage collection, and iOS only allows a few decoders at a time.
 */
export function releaseVideo(v: HTMLVideoElement | null) {
  if (!v) return;
  v.pause();
  v.removeAttribute("src");
  v.load();
}
