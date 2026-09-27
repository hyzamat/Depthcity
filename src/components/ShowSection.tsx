import CineReel from "./ui/CineReel";
import { Reveal, SplitWords } from "./ui/Reveal";
import { showReel } from "@/content/site";

/** The Burj Khalifa New Year show: a short intro, then the pinned reel filmed in the game. */
export default function ShowSection() {
  return (
    <div id="show" className="relative bg-bg scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6 pb-14 pt-24 md:px-10 md:pb-20 md:pt-36">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal as="p" className="eyebrow mb-4">
              Special event
            </Reveal>
            <h2 className="h-display text-[clamp(2.2rem,5.6vw,4.6rem)] text-gradient-gold">
              <SplitWords text="Celebrate at the top of the world." />
            </h2>
          </div>
          <Reveal as="p" className="lede lg:col-span-5" delay={2}>
            Start the Special Event and night falls over the city. The tower&apos;s LED skin wakes floor by floor, the
            countdown runs down the facade — and at midnight the whole thing goes off the way the real one does.
          </Reveal>
        </div>
      </div>
      <CineReel chapters={showReel} accent="gold" zone="show" />
    </div>
  );
}
