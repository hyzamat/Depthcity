import ReelSection from "./ReelSection";
import { wildReel } from "@/content/site";

/** Zoo & wildlife: a short intro, then the pinned reel of in-game footage. */
export default function WildSection() {
  return (
    <ReelSection
      id="wild"
      eyebrow="Zoo & wildlife"
      title="The city has a wild side."
      lede="Build the Classic Zoo Park and nineteen animals move in. Leave a forest standing and deer, bears, boars and wolves find it on their own. Every animal below was filmed inside the game."
      chapters={wildReel}
      accent="aurora"
      zone="jungle"
    />
  );
}
