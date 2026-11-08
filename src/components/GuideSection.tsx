import Link from "next/link";
import GuideButtons from "./GuideButtons";
import { Reveal } from "./ui/Reveal";
import { guide } from "@/content/site";

/** For reviewers and creators: the guide PDF in four languages, plus the share-link page (/guide/). */
export default function GuideSection() {
  return (
    <section id="guide" className="relative bg-bg pb-8 pt-4 md:pb-12 scroll-mt-24">
      <div className="mx-auto max-w-4xl px-6 md:px-10">
        <div className="card px-4 py-7 sm:px-5 md:px-9 md:py-9">
          <Reveal as="p" className="eyebrow mb-3">
            For reviewers &amp; creators
          </Reveal>
          <h2 className="font-display text-[clamp(1.35rem,3.4vw,2rem)] font-bold text-white">{guide.title}</h2>
          <Reveal as="p" className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted md:text-base" delay={1}>
            {guide.blurb} Pick your language to download the PDF.
          </Reveal>
          <Reveal delay={2}>
            <GuideButtons className="mt-6" />
          </Reveal>
          <p className="mt-5 text-sm">
            <Link href="/guide/" className="text-sky underline-offset-4 hover:underline">
              Share links for each language →
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
