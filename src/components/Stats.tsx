import Counter from "./ui/Counter";
import { Reveal } from "./ui/Reveal";
import { stats } from "@/content/site";

export default function Stats() {
  return (
    <section className="cv-auto relative bg-bg py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="card grid divide-y divide-white/8 md:grid-cols-4 md:divide-x md:divide-y-0">
          {stats.map((s, i) => (
            <Reveal key={s.label} className="p-7 md:p-9" delay={i}>
              <div className="font-display text-5xl font-black text-gradient-gold md:text-6xl">
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-3 font-display text-xs tracking-[0.2em] text-white">{s.label.toUpperCase()}</div>
              <div className="mt-2 text-sm text-muted">{s.hint}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
