import type { MetadataRoute } from "next";
import { seo, site } from "@/content/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name}: ${site.tagline}`,
    short_name: site.name,
    description: seo.description,
    start_url: "/",
    display: "browser",
    background_color: "#06090f",
    theme_color: "#06090f",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    // the game itself, so browsers and crawlers can tie this site to the store apps
    related_applications: [
      { platform: "play", url: site.links.playStore, id: site.androidPackage },
      { platform: "itunes", url: site.links.appStore },
    ],
    prefer_related_applications: false,
  };
}
