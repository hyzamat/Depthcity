import Img from "./ui/Img";
import { Reveal, SplitWords } from "./ui/Reveal";
import { faq, seo, site } from "@/content/site";

/**
 * Plain questions and answers about the game. Native <details>, so every answer is in the HTML for search engines
 * and AI crawlers even while collapsed, and opening one needs no JavaScript. The same list is the page's FAQPage
 * structured data (StructuredData.tsx) and part of /llms.txt.
 */
export default function FaqSection() {
  return (
    <section id="faq" className="relative bg-bg py-24 md:py-32 scroll-mt-24">
      <div className="mx-auto max-w-4xl px-6 md:px-10">
        <div className="text-center">
          <Reveal as="p" className="eyebrow mb-4">
            Questions
          </Reveal>
          <h2 className="h-display text-[clamp(2rem,5vw,4rem)] text-white">
            <SplitWords text="The open-world city builder, explained." />
          </h2>
        </div>

        {/* the whole city from above: the picture search engines show for the site (seo.topView) */}
        <Reveal as="div" className="mt-12" amount={0.2}>
          <figure className="overflow-hidden rounded-[1.5rem] ring-glow">
            <Img
              name={seo.topView.name}
              alt={seo.topView.alt}
              className="aspect-video h-auto w-full object-cover"
              sizes="(min-width: 960px) 896px, 100vw"
            />
            <figcaption className="card !rounded-none !border-x-0 !border-b-0 px-5 py-3 text-xs text-muted md:px-7">
              <span className="font-display tracking-[0.2em] text-gold">TOP VIEW</span> · A whole {site.name} city from
              above, built in the game: towers, roads, a stadium, a theme park and a river.
            </figcaption>
          </figure>
        </Reveal>

        <div className="mt-8 flex flex-col gap-3">
          {faq.map((item, i) => (
            <Reveal key={item.q} delay={Math.min(i, 4)}>
              <details className="faq card group px-5 py-1 md:px-7" open={i === 0}>
                <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 py-3 font-display text-[15px] font-bold text-white md:text-base">
                  <h3>{item.q}</h3>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    aria-hidden
                    className="shrink-0 text-gold transition-transform duration-300 group-open:rotate-45"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </summary>
                <p className="pb-5 pr-6 text-[15px] leading-relaxed text-muted md:text-base">{item.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
