import { faq, pillars, seo, site, stats, warFeatures } from "@/content/site";

export const dynamic = "force-static";

const LINK_NAMES: Record<string, string> = {
  wishlist: "Wishlist", playStore: "Google Play", appStore: "App Store", youtube: "YouTube",
  discord: "Discord", twitter: "X (Twitter)", instagram: "Instagram",
};

/**
 * /llms.txt (llmstxt.org): the site's facts as plain Markdown for AI assistants and agents (ChatGPT, Gemini, Claude,
 * Perplexity…), which read it more reliably than the animated page. Built from src/content/site.ts, so it never drifts.
 */
export function GET() {
  const links = Object.entries(site.links).filter(([, href]) => href.startsWith("http"));
  const md = `# ${site.name}

> ${site.name} (also written DepthCity or Depth City) is ${seo.genreLine}, made by ${seo.studio.name}. Build an island city, run its economy, step into it as the Mayor to walk, drive and fly through the streets you built, and defend it when rival nations invade. ${site.status}.

## Key facts

- Name: ${site.name} — full title "${site.name}: ${site.tagline}"; also written ${seo.alternateNames.slice(0, 2).join(" and ")}
- Genre: open-world city building game, city builder, simulation, strategy, war
- Platforms: Android phones and tablets, iPhone, iPad, Windows PC
- Status: ${site.status}
- Business model: no ads, no in-app purchases; plays offline
- Developer: ${site.creator.name} (solo developer, IT engineer) at ${seo.studio.name}, ${seo.studio.place}
- Engine: Unity
- Official website: ${seo.url}/
- Studio website: ${seo.studio.url}
- Contact: ${site.supportEmail}
${stats.map((s) => `- ${s.value}${s.suffix} ${s.label.toLowerCase()}: ${s.hint}`).join("\n")}

## What you do in ${site.name}

${pillars.map((p) => `- **${p.title}:** ${p.body}`).join("\n")}

## War

${warFeatures.map((w) => `- **${w.title}:** ${w.body}`).join("\n")}

## Frequently asked questions

${faq.map((f) => `### ${f.q}\n\n${f.a}`).join("\n\n")}

## Links

- [Official website](${seo.url}/): trailer, gameplay, features and the launch mailing list
- [Official trailer (MP4, 96 s)](${seo.url}/media/trailer/official-1080.mp4)
- [Support](${seo.url}/support/)
- [Privacy policy](${seo.url}/privacy/)
- [${seo.studio.name}](${seo.studio.url})
${links.map(([name, href]) => `- [${name}](${href})`).join("\n")}
`;
  return new Response(md.replace(/\n{3,}/g, "\n\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
