import ReelSection from "./ReelSection";
import { showReel } from "@/content/site";

/** City events, headed by the Skyreach Tower show: a short intro, then the pinned reel filmed in the game. */
export default function ShowSection() {
  return (
    <ReelSection
      id="events"
      eyebrow="Celebrate"
      title="Light up the night."
      lede="Eight city events, from a farmers market to a stadium concert. The biggest is the Special Event: the Skyreach Tower's LED skin wakes up and a record-breaking fireworks show climbs to the spire."
      chapters={showReel}
      accent="gold"
      zone="show"
    />
  );
}
