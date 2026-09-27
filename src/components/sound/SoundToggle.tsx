"use client";

import { sound } from "@/lib/sound/engine";
import { useSoundEnabled } from "./SoundProvider";

/** Speaker button for the nav: three bars dance while sound is on. */
export default function SoundToggle({ className = "" }: { className?: string }) {
  const on = useSoundEnabled();
  return (
    <button
      type="button"
      data-sfx="none"
      onClick={() => {
        if (on) {
          sound.play("click", { gain: 0.35, rate: 0.8 });
          sound.disable();
        } else {
          sound.enable();
          sound.play("chime", { gain: 0.2, rate: 1.5, reverb: 0.4 });
        }
      }}
      className={`glass flex h-11 min-w-[44px] items-center justify-center gap-2 rounded-full px-3 transition @media(hover:hover):hover:bg-white/10 active:scale-95 active:bg-white/20 touch-manipulation ${className}`}
      aria-label={on ? "Turn sound off" : "Turn sound on"}
      aria-pressed={on}
      title={on ? "Sound on" : "Sound off"}
    >
      <span className="flex h-3.5 items-end gap-[3px]" aria-hidden>
        {[0.9, 0.5, 1, 0.7].map((h, i) => (
          <span
            key={i}
            className={`w-[3px] rounded-full ${on ? "eq-bar bg-gold" : "bg-white/45"}`}
            style={{ height: on ? "100%" : `${35 + h * 40}%`, animationDelay: `${i * 0.13}s`, animationDuration: `${0.7 + h * 0.5}s` }}
          />
        ))}
      </span>
      <span className="hidden font-display text-[10px] tracking-[0.22em] text-white/80 sm:block">{on ? "SOUND" : "MUTED"}</span>
    </button>
  );
}
