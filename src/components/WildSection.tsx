import CineReel from "./ui/CineReel";
import { Reveal, SplitWords } from "./ui/Reveal";
import { wildReel } from "@/content/site";

/** Zoo & wildlife: a short intro, then the pinned reel of in-game footage. */
export default function WildSection() {
  return (
    <div id="wild" className="relative bg-bg scroll-mt-24">
      <div className="pointer-events-none absolute -right-40 top-10 h-[55vh] w-[55vh] rounded-full bg-[radial-gradient(circle,rgba(124,245,195,0.12),transparent_65%)]" />
      <div className="relative mx-auto max-w-7xl px-6 pb-14 pt-24 md:px-10 md:pb-20 md:pt-36">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal as="p" className="eyebrow mb-4 !text-aurora">
              Zoo &amp; wildlife
            </Reveal>
            <h2 className="h-display text-[clamp(2.2rem,5.6vw,4.6rem)] text-gradient-aurora">
              <SplitWords text="The city has a wild side." />
            </h2>
          </div>
          <Reveal as="p" className="lede lg:col-span-5" delay={2}>
            Build the Big Zoo Park and sixteen species move in. Leave a forest standing and deer, foxes and bears find it on
            their own. Every animal below was filmed inside the game.
          </Reveal>
        </div>
      </div>
      <CineReel chapters={wildReel} accent="aurora" zone="jungle" />
    </div>
  );
}
