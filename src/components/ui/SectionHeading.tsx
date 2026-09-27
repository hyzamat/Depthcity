import { Reveal, SplitWords } from "./Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  gradient = "gold",
  className = "",
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  align?: "left" | "center";
  gradient?: "gold" | "sky" | "aurora" | "ember" | "none";
  className?: string;
}) {
  const grad = gradient === "none" ? "" : `text-gradient-${gradient}`;
  return (
    <div className={`${align === "center" ? "text-center mx-auto" : ""} max-w-3xl ${className}`}>
      <Reveal as="p" className="eyebrow mb-4">
        {eyebrow}
      </Reveal>
      <h2 className={`h-display text-[clamp(2rem,5vw,4.25rem)] ${grad}`}>
        <SplitWords text={title} />
      </h2>
      {lede && (
        <Reveal as="p" className="lede mt-6" delay={2}>
          {lede}
        </Reveal>
      )}
    </div>
  );
}
