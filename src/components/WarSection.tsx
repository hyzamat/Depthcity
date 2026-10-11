import CineReel from "./ui/CineReel";
import { Reveal, SplitWords } from "./ui/Reveal";
import { Phone } from "./GameplaySection";
import { armyClip, battleReel, warFeatures } from "@/content/site";

const ARMY = armyClip;

export default function WarSection() {
  return (
    // overflow-x-clip (not hidden): a hidden overflow would turn the section into a scroll box and break the pinned reel
    <section id="war" className="relative overflow-x-clip bg-bg py-24 md:py-36 scroll-mt-24">
      {/* ember glow */}
      <div className="pointer-events-none absolute -left-40 top-40 h-[60vh] w-[60vh] rounded-full bg-[radial-gradient(circle,rgba(255,106,61,0.14),transparent_65%)]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[50vh] w-[50vh] rounded-full bg-[radial-gradient(circle,rgba(245,165,36,0.1),transparent_65%)]" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal as="p" className="eyebrow mb-4 !text-ember">
              War with consequences
            </Reveal>
            <h2 className="h-display text-[clamp(2.2rem,5.6vw,4.6rem)] text-gradient-ember">
              <SplitWords text="Defend it. Or take theirs." />
            </h2>
          </div>
          <Reveal as="p" className="lede lg:col-span-5" delay={2}>
            Nine rival nations on a world map of islands. Recruit soldiers, commandos and special forces, build air
            bases and missile defence, then raid a rival from the sea — or watch your Intelligence Agency count down the
            days until they land on your beaches.
          </Reveal>
        </div>
      </div>

      {/* the battle, filmed in the game: the landing, the air, the streets, the defence, the Town Hall */}
      <div className="relative mt-14 md:mt-20">
        <CineReel chapters={battleReel} accent="ember" zone="war" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        {/* features + the army screen, recorded in the game */}
        <div className="mt-14 grid items-start gap-10 lg:grid-cols-12">
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
            {warFeatures.map((f, i) => (
              <Reveal key={f.title} className="card p-6" delay={i}>
                <div className="mb-4 font-display text-[10px] tracking-[0.3em] text-ember">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="font-display text-base font-bold text-white md:text-lg">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{f.body}</p>
              </Reveal>
            ))}
          </div>
          <div className="flex justify-center lg:col-span-4">
            <Phone clip={ARMY.clip} title={ARMY.title} body={ARMY.body} index={-1} className="w-[68vw] max-w-[300px] sm:w-[300px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
