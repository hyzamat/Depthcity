import type { MetadataRoute } from "next";
import { seo } from "@/content/site";

export const dynamic = "force-static";

/** Every public page. lastModified is the build time, i.e. the last deploy. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: `${seo.url}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
      images: [`${seo.url}/brand/og.jpg`, `${seo.url}/media/hero-skyline-1600.webp`],
      videos: [
        {
          title: "DEPTH CITY — Official Trailer",
          thumbnail_loc: `${seo.url}/media/trailer/official-poster.webp`,
          description: "The official trailer for DEPTH CITY, recorded in the game.",
          content_loc: `${seo.url}/media/trailer/official-1080.mp4`,
          duration: 96,
        },
      ],
    },
    { url: `${seo.url}/support/`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${seo.url}/privacy/`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${seo.url}/delete-data/`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
