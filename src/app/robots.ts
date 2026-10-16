import type { MetadataRoute } from "next";
import { seo } from "@/content/site";

export const dynamic = "force-static";

/**
 * Everyone may crawl everything. The AI search and assistant crawlers are also named one by one, so it is explicit
 * that ChatGPT, Gemini, Claude, Perplexity, Copilot and Apple Intelligence may read and cite the site (see /llms.txt).
 */
const AI_CRAWLERS = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User", // OpenAI / ChatGPT search
  "Google-Extended", "GoogleOther", // Gemini
  "ClaudeBot", "Claude-SearchBot", "Claude-User", // Anthropic
  "PerplexityBot", "Perplexity-User",
  "Bingbot", "msnbot", // Bing, Copilot and ChatGPT search results
  "Applebot", "Applebot-Extended",
  "DuckAssistBot", "meta-externalagent", "Amazonbot", "CCBot", "YouBot", "MistralAI-User",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: AI_CRAWLERS, allow: "/" },
    ],
    sitemap: `${seo.url}/sitemap.xml`,
    host: seo.url,
  };
}
