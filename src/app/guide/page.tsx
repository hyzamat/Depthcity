import type { Metadata } from "next";
import GuideButtons from "@/components/GuideButtons";
import LegalPage from "@/components/LegalPage";
import StoreButtons from "@/components/StoreButtons";
import { guide, seo, site } from "@/content/site";

const title = `${guide.title} — ${site.name}`;
const description = `Download the ${site.name} ${guide.title} (PDF) in English, Malayalam, Hindi or Arabic. ${guide.blurb}`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/guide/" },
  openGraph: {
    url: "/guide/",
    title,
    description,
    images: [{ url: seo.topView.og, width: 1200, height: 630, alt: seo.topView.alt }],
    type: "website",
    siteName: site.name,
  },
};

/** Pick a language and download the guide. Each language also has its own share link that downloads on open. */
export default function GuidePage() {
  return (
    <LegalPage eyebrow="For reviewers & creators" title={guide.title}>
      <div className="summary">
        <p>
          {guide.blurb} {site.name}: {site.tagline} is out now on Google Play and the App Store.
        </p>
      </div>

      <h2>Choose your language</h2>
      <GuideButtons className="mt-5 !list-none !pl-0" cols="grid-cols-2" />

      <h2>Links to share</h2>
      <p>Each link opens a page in that language and starts the download straight away.</p>
      <ul>
        {guide.languages.map((l) => (
          <li key={l.code}>
            <strong>{l.name}:</strong>{" "}
            <a href={`/guide/${l.code}/`}>
              {seo.url.replace("https://", "")}/guide/{l.code}/
            </a>
          </li>
        ))}
      </ul>

      <h2>Get the game</h2>
      <StoreButtons className="!justify-start" />
      <p>
        Questions, review copies or interviews: <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>
      </p>
    </LegalPage>
  );
}
