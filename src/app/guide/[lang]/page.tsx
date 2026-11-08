/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import GuideAutoDownload from "@/components/GuideAutoDownload";
import StoreButtons from "@/components/StoreButtons";
import { guide, seo, site } from "@/content/site";

/**
 * /guide/en/, /guide/ml/, /guide/hi/, /guide/ar/ — the links to share with reviewers and creators. Opening one starts
 * the download of that language's Reviewer & Creator Guide straight away; the page itself is in the same language.
 * Not indexed (the PDFs and /guide/ are): it is a download trigger, not content.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return guide.languages.map((l) => ({ lang: l.code }));
}

type Props = { params: Promise<{ lang: string }> };

const find = (code: string) => guide.languages.find((l) => l.code === code);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const l = find((await params).lang);
  if (!l) return {};
  const title = `${site.name} — ${l.code === "en" ? guide.title : `${l.title} (${l.name})`}`;
  const description = `${guide.title} for ${site.name}: ${site.tagline} (${l.name}, PDF). ${guide.blurb}`;
  return {
    title,
    description,
    alternates: { canonical: `/guide/${l.code}/` },
    robots: { index: false, follow: true },
    openGraph: {
      url: `/guide/${l.code}/`,
      title,
      description,
      images: [{ url: seo.topView.og, width: 1200, height: 630, alt: seo.topView.alt }],
      type: "website",
      siteName: site.name,
    },
  };
}

export default async function GuideDownloadPage({ params }: Props) {
  const l = find((await params).lang);
  if (!l) notFound();
  // Orbitron has no Malayalam, Devanagari or Arabic letters, and letter-spacing breaks joined Arabic script
  const local = l.code === "en" ? "" : "!font-body !normal-case !tracking-normal !text-[15px]";

  return (
    <div lang={l.code} dir={l.dir} className="flex min-h-svh flex-col items-center justify-center bg-bg px-6 py-14 text-center">
      <Link href="/" className="flex items-center gap-3" aria-label={`${site.name} home`}>
        <img src="/brand/mark-192.webp" alt="" width={192} height={192} className="h-14 w-14" />
        <img src="/brand/wordmark-600.webp" alt={site.name} width={600} height={110} className="h-5 w-auto" />
      </Link>

      <main className="mt-10 flex max-w-md flex-col items-center">
        <p className="eyebrow" dir="ltr">
          {site.name}: {site.tagline}
        </p>
        <h1 className="mt-3 text-[clamp(1.9rem,7vw,2.8rem)] font-bold leading-tight text-white">{l.title}</h1>
        <p className="mt-6 text-lg text-white/85" role="status">
          {l.starting}
        </p>
        <p className="mt-2 text-sm text-muted">{l.hint}</p>

        <div className="mt-7 flex flex-col items-center gap-4">
          <GuideAutoDownload file={l.file} saveAs={l.saveAs} label={l.button} className={local} />
          <a href={l.file} target="_blank" rel="noopener" className="text-sm text-white/70 underline underline-offset-4 hover:text-white">
            {l.open}
          </a>
        </div>
      </main>

      <div className="mt-14" dir="ltr">
        <StoreButtons />
      </div>
      <p className="mt-8 text-xs text-white/50" dir="ltr">
        <Link href="/guide/" className="underline-offset-4 hover:text-white hover:underline">
          All languages
        </Link>{" "}
        ·{" "}
        <Link href="/" className="underline-offset-4 hover:text-white hover:underline">
          depthcity.hizarc.com
        </Link>
      </p>
    </div>
  );
}
