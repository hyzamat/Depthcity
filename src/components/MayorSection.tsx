import ReelSection from "./ReelSection";
import { mayorReel } from "@/content/site";

/** Live as the Mayor (walk mode): a short intro, then the pinned reel filmed in the game. */
export default function MayorSection() {
  return (
    <ReelSection
      id="mayor"
      eyebrow="Live as the Mayor"
      title="Step down to the street."
      lede="Drop out of the map and into your own city. Walk it, drive it, fly over it, walk into its shops and homes — then find love, hold a wedding and take the family out."
      chapters={mayorReel}
      accent="sky"
      zone="street"
    />
  );
}
