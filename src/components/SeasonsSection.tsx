import ReelSection from "./ReelSection";
import { seasonsReel } from "@/content/site";

/** Four special seasons over a 115-day year: a short intro, then the pinned reel filmed in the game. */
export default function SeasonsSection() {
  return (
    <ReelSection
      id="seasons"
      eyebrow="Seasons & weather"
      title="A year on the island."
      lede="A year is 115 game days. Spring blossom, monsoon rain, autumn gold and winter snow come round in turn, and the city changes with them: wet roads, snowplows, grounded planes in a storm."
      chapters={seasonsReel}
      accent="rose"
      zone="city-day"
    />
  );
}
