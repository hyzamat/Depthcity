import { guide } from "@/content/site";

/**
 * One download button per language of the Reviewer & Creator Guide. The `download` attribute saves the PDF (with a
 * readable file name) instead of opening it in the browser's viewer.
 */
export default function GuideButtons({ className = "", cols = "grid-cols-2 lg:grid-cols-4" }: { className?: string; cols?: string }) {
  return (
    <ul className={`grid gap-3 ${cols} ${className}`}>
      {guide.languages.map((l) => (
        <li key={l.code}>
          <a
            href={l.file}
            download={l.saveAs}
            className="card group flex h-full min-h-[76px] items-center justify-between gap-2 px-3 py-3 transition hover:border-gold/50 hover:bg-white/[0.06] touch-manipulation sm:gap-3 sm:px-4 md:px-5"
            aria-label={`Download the ${guide.title} in ${l.name} (PDF)`}
          >
            <span className="flex min-w-0 flex-col text-left">
              <span lang={l.code} dir={l.dir} className="truncate text-[16px] font-bold text-white sm:text-[17px]">
                {l.native}
              </span>
              <span className="mt-0.5 whitespace-nowrap text-[10px] tracking-[0.08em] text-muted sm:text-[11px] sm:tracking-[0.12em]">
                {l.code === "en" ? "PDF · 4 PAGES" : l.name.toUpperCase()}
              </span>
            </span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
              className="shrink-0 text-gold transition-transform duration-300 group-hover:translate-y-0.5"
            >
              <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
