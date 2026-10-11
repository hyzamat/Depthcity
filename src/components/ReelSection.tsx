import CineReel, { type ReelAccent } from "./ui/CineReel";
import { Reveal, SplitWords } from "./ui/Reveal";
import type { ReelChapter } from "@/content/site";
import type { Zone } from "@/lib/sound/engine";

const EYEBROW: Record<ReelAccent, string> = {
  gold: "",
  ember: "!text-ember",
  aurora: "!text-aurora",
  sky: "!text-sky",
  rose: "!text-rose",
};

const GLOW: Record<ReelAccent, string> = {
  gold: "rgba(245,194,66,0.12)",
  ember: "rgba(255,106,61,0.14)",
  aurora: "rgba(124,245,195,0.12)",
  sky: "rgba(124,196,255,0.12)",
  rose: "rgba(247,166,200,0.12)",
};

/** A feature chapter: a short intro, then the pinned reel of footage recorded in the game. */
export default function ReelSection({
  id,
  eyebrow,
  title,
  lede,
  chapters,
  accent,
  zone,
}: {
  id: string;
  eyebrow: string;
  title: string;
  lede: string;
  chapters: ReelChapter[];
  accent: ReelAccent;
  zone?: Zone;
}) {
  return (
    <div id={id} className="relative bg-bg scroll-mt-24">
      <div
        className="pointer-events-none absolute -right-40 top-10 h-[55vh] w-[55vh] rounded-full"
        style={{ background: `radial-gradient(circle, ${GLOW[accent]}, transparent 65%)` }}
      />
      <div className="relative mx-auto max-w-7xl px-6 pb-14 pt-24 md:px-10 md:pb-20 md:pt-36">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal as="p" className={`eyebrow mb-4 ${EYEBROW[accent]}`}>
              {eyebrow}
            </Reveal>
            <h2 className={`h-display text-[clamp(2.2rem,5.6vw,4.6rem)] text-gradient-${accent}`}>
              <SplitWords text={title} />
            </h2>
          </div>
          <Reveal as="p" className="lede lg:col-span-5" delay={2}>
            {lede}
          </Reveal>
        </div>
      </div>
      <CineReel chapters={chapters} accent={accent} zone={zone} />
    </div>
  );
}
