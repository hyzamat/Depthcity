// Tell IndexNow search engines (Bing, Yandex, Seznam, Naver…) that the site's pages changed. Run after a deploy:
//   npm run build && node scripts/indexnow.mjs
// The key is the 32-hex-character file in public/ (served at the site root, which proves we own the host).
// Google does not use IndexNow: for Google, submit the sitemap in Search Console.
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const HOST = "depthcity.hizarc.com";
const publicDir = fileURLToPath(new URL("../public/", import.meta.url));
const keyFile = readdirSync(publicDir).find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) throw new Error("no IndexNow key file in public/");
const key = readFileSync(publicDir + keyFile, "utf8").trim();

// the URL list comes from the built sitemap (out/sitemap.xml), the same file the live site serves
const sitemap = readFileSync(fileURLToPath(new URL("../out/sitemap.xml", import.meta.url)), "utf8");
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key, keyLocation: `https://${HOST}/${keyFile}`, urlList }),
});
console.log(`IndexNow: HTTP ${res.status} for ${urlList.length} URLs`, urlList);
