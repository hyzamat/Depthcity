import Img from "./ui/Img";
import CineReel from "./ui/CineReel";
import { Reveal, SplitWords } from "./ui/Reveal";
import { battleReel, warFeatures } from "@/content/site";

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
            Eleven rival nations on a real relief map of the world. Recruit and drill, build air bases, place THAAD
            batteries. Fly a task force to raid a rival capital for loot — or watch the intel agency count down the days
            until they land on your shore.
          </Reveal>
        </div>
      </div>

      {/* the battle, filmed in the game: the drop, the assault, the defence */}
      <div className="relative mt-14 md:mt-20">
        <CineReel chapters={battleReel} accent="ember" zone="war" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        {/* features */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {warFeatures.map((f, i) => (
            <Reveal key={f.title} className="card p-6" delay={i}>
              <div className="mb-4 font-display text-[10px] tracking-[0.3em] text-ember">{String(i + 1).padStart(2, "0")}</div>
              <h3 className="font-display text-base font-bold text-white md:text-lg">{f.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{f.body}</p>
            </Reveal>
          ))}
        </div>

        {/* map + intel */}
        <div className="mt-10 grid gap-4 lg:grid-cols-12">
          <Reveal className="group relative overflow-hidden rounded-3xl ring-glow lg:col-span-7" amount={0.25}>
            <div className="aspect-[16/9]">
              <Img name="war-map-zoom" alt="The war map — a 3D relief world with eleven rival nations pinned to their landmasses" className="h-full w-full object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.03]" sizes="(min-width: 1024px) 60vw, 100vw" />
            </div>
            <Tag title="World War Region" body="NASA-elevation relief. Fly over it, pinch to zoom, orbit with a twist." />
          </Reveal>
          <Reveal className="group relative overflow-hidden rounded-3xl ring-glow lg:col-span-5" amount={0.25} delay={1}>
            <div className="aspect-[16/9] lg:aspect-auto lg:h-full">
              <Img name="war-nation" alt="Visiting the Iron Federation — treasury, military and people intel over their living city" className="h-full w-full object-cover object-left transition-transform duration-[1.6s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.03]" sizes="(min-width: 1024px) 40vw, 100vw" />
            </div>
            <Tag title="Nation intel" body="Every rival has a treasury, oil, gold, minerals, weapons — and an army that regenerates." />
          </Reveal>
        </div>

      </div>
    </section>
  );
}

function Tag({ title, body }: { title: string; body: string }) {
  return (
    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-5 pt-14 md:p-6">
      <div className="font-display text-sm font-bold text-white md:text-base">{title}</div>
      <p className="mt-1 max-w-md text-xs leading-relaxed text-white/70 md:text-sm">{body}</p>
    </div>
  );
}
