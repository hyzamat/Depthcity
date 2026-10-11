import { seo, site } from "@/content/site";

/**
 * schema.org structured data for the home page: the website (its name and alternate spellings are what Google
 * shows as the site name), the game itself, its trailer, and the studio — the same @id hizarc.com publishes, so
 * search engines can tie DEPTH CITY to HIZARC Games. Only facts that are true today: no price, no ratings.
 */
export default function StructuredData() {
  const url = `${seo.url}/`;
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${url}#website`,
        url,
        name: site.name,
        alternateName: seo.alternateNames,
        description: seo.description,
        inLanguage: "en",
        publisher: { "@id": seo.studio.id },
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: seo.title,
        description: seo.description,
        isPartOf: { "@id": `${url}#website` },
        about: { "@id": `${url}#game` },
        primaryImageOfPage: { "@id": `${url}#image` },
        inLanguage: "en",
      },
      {
        "@type": "ImageObject",
        "@id": `${url}#image`,
        url: `${seo.url}/brand/og.jpg`,
        contentUrl: `${seo.url}/brand/og.jpg`,
        width: 1200,
        height: 630,
        caption: `${site.name} — ${site.motto}`,
      },
      {
        "@type": "VideoGame",
        "@id": `${url}#game`,
        name: site.name,
        alternateName: seo.alternateNames,
        url,
        description: site.description,
        image: [`${seo.url}/brand/og.jpg`, `${seo.url}/media/hero-skyline-1600.webp`],
        genre: ["City builder", "Simulation", "Strategy"],
        gamePlatform: ["Android", "iOS", "Windows"],
        operatingSystem: "Android, iOS, Windows",
        applicationCategory: "Game",
        playMode: "SinglePlayer",
        inLanguage: "en",
        author: { "@type": "Person", name: site.creator.name },
        publisher: { "@id": seo.studio.id },
        trailer: { "@id": `${url}#trailer` },
      },
      {
        "@type": "VideoObject",
        "@id": `${url}#trailer`,
        name: `${site.name} — Official Trailer`,
        description: `The official trailer for ${site.name}, recorded in the game: building the city, the seasons, the Mayor's life, celebrations, disasters and war.`,
        thumbnailUrl: `${seo.url}/media/trailer/official-poster.webp`,
        contentUrl: `${seo.url}/media/trailer/official-1080.mp4`,
        uploadDate: "2026-10-11",
        duration: "PT1M36S",
        publisher: { "@id": seo.studio.id },
      },
      {
        "@type": "Organization",
        "@id": seo.studio.id,
        name: seo.studio.name,
        alternateName: ["HIZARC"],
        url: seo.studio.url,
        logo: seo.studio.logo,
        email: site.supportEmail,
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      // JSON-LD is data, not markup: escape "<" so no string in it can close the script tag
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
    />
  );
}
