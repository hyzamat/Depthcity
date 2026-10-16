import { faq, seo, site } from "@/content/site";

/**
 * schema.org structured data for the home page: the website (its name and alternate spellings are what Google
 * shows as the site name), the game itself, its trailer, and the studio — the same @id hizarc.com publishes, so
 * search engines can tie DEPTH CITY to HIZARC Games — plus the FAQ shown on the page. Only facts that are true
 * today: no price, no ratings.
 */
export default function StructuredData() {
  const url = `${seo.url}/`;
  // the game's own profiles (YouTube, Instagram, store pages…) once they are filled in, so they join to this game
  const profiles = Object.values(site.links).filter((l) => l.startsWith("http"));
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
        "@type": ["WebPage", "FAQPage"],
        "@id": `${url}#webpage`,
        url,
        name: seo.title,
        description: seo.description,
        isPartOf: { "@id": `${url}#website` },
        about: { "@id": `${url}#game` },
        // the home page carries the FAQ section, so it is also the FAQPage
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
        primaryImageOfPage: { "@id": `${url}#image` },
        inLanguage: "en",
      },
      {
        "@type": "ImageObject",
        "@id": `${url}#image`,
        url: `${seo.url}${seo.topView.crops[0]}`,
        contentUrl: `${seo.url}${seo.topView.crops[0]}`,
        width: 1920,
        height: 1080,
        caption: seo.topView.alt,
      },
      {
        "@type": "VideoGame",
        "@id": `${url}#game`,
        name: site.name,
        alternateName: seo.alternateNames,
        url,
        description: site.description,
        image: [...seo.topView.crops.map((c) => `${seo.url}${c}`), `${seo.url}${seo.topView.og}`],
        screenshot: [`${seo.url}${seo.topView.crops[0]}`, `${seo.url}/media/island-sea-1600.webp`, `${seo.url}/media/hero-skyline-1600.webp`],
        genre: ["City-building game", "Open world", "Simulation", "Strategy", "War"],
        keywords: seo.keywords.join(", "),
        gamePlatform: ["Android", "iOS", "iPadOS", "Windows PC"],
        operatingSystem: "Android, iOS, iPadOS, Windows",
        applicationCategory: "Game",
        playMode: "SinglePlayer",
        featureList: [
          "Open-world city building: build from above, then walk, drive and fly through your own city",
          "Avatar Mayor mode with interiors, a mansion, a wedding and a family",
          "War against nine rival nations: invasions, air and missile defence, raids, colonies",
          "170+ buildings in 11 categories and 125 city levels",
          "Economy with taxes, 21 policies, research, debt and austerity",
          "Day and night, four seasons, monsoon, eight city events and seven disasters",
          "Plays offline, no ads, no in-app purchases",
        ],
        inLanguage: "en",
        author: { "@type": "Person", name: site.creator.name },
        publisher: { "@id": seo.studio.id },
        trailer: { "@id": `${url}#trailer` },
        ...(profiles.length ? { sameAs: profiles } : {}),
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
