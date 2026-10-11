/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { site } from "@/content/site";

/** The links every legal / help page shows at the bottom. */
export const LEGAL_LINKS = [
  { href: "/support/", label: "Support" },
  { href: "/privacy/", label: "Privacy Policy" },
  { href: "/delete-data/", label: "Delete my data" },
];

/**
 * Plain, readable shell for the Privacy, Support and Delete-data pages: the brand bar, one column of text,
 * and the legal links. No scroll effects or sound — these pages are read, linked from the stores and printed.
 */
export default function LegalPage({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-svh bg-bg">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-6 pt-6 md:px-10">
        <Link href="/" className="flex items-center gap-3" aria-label={`${site.name} home`}>
          <img src="/brand/mark-192.webp" alt="" width={192} height={192} className="h-9 w-9" />
          <img src="/brand/wordmark-600.webp" alt={site.name} width={600} height={110} className="h-4 w-auto" />
        </Link>
        <Link href="/" className="glass rounded-full px-4 py-2 text-xs text-white/80 transition hover:text-white">
          ← Back to site
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-16 pt-12 md:px-10">
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h1 className="h-display text-[clamp(2rem,5vw,3.2rem)] text-white">{title}</h1>
        {updated && <p className="mt-3 text-sm text-muted">{updated}</p>}
        <div className="legal mt-10">{children}</div>
      </main>

      <footer className="mx-auto max-w-3xl px-6 pb-10 md:px-10">
        <div className="flex flex-col gap-4 border-t border-white/8 pt-6 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
          <nav className="flex flex-wrap gap-2" aria-label="Help and legal">
            {LEGAL_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="glass rounded-full px-4 py-2 text-white/75 transition hover:text-white">
                {l.label}
              </Link>
            ))}
          </nav>
          <span>
            © {new Date().getFullYear()} {site.company}. {site.name}.
          </span>
        </div>
      </footer>
    </div>
  );
}
