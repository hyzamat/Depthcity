import { Reveal, SplitWords } from "./ui/Reveal";
import { faq } from "@/content/site";

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

        <div className="mt-12 flex flex-col gap-3">
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
