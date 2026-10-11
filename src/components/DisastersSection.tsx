import ReelSection from "./ReelSection";
import { disasterReel } from "@/content/site";

/** Disasters: a short intro, then the pinned reel filmed in the game. */
export default function DisastersSection() {
  return (
    <ReelSection
      id="disasters"
      eyebrow="Survive disasters"
      title="Then nature fights back."
      lede="Fire, tornado, volcano, flood, thunderstorm, earthquake and meteor strike. Start any of them yourself, or switch on Random Disasters for extra city income — and live with what comes."
      chapters={disasterReel}
      accent="ember"
      zone="storm"
    />
  );
}
