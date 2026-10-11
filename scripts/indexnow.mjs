// Tell IndexNow search engines (Bing, Yandex, Seznam, Naver…) that the site's pages changed. Run after a deploy:
//   node scripts/indexnow.mjs
// The key is the 32-hex-character file in public/ (served at the site root, which proves we own the host).
// Google does not use IndexNow: for Google, submit the sitemap in Search Console.
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const HOST = "depthcity.hizarc.com";
const publicDir = fileURLToPath(new URL("../public/", import.meta.url));
const keyFile = readdirSync(publicDir).find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) throw new Error("no IndexNow key file in public/");
const key = readFileSync(publicDir + keyFile, "utf8").trim();

const sitemap = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key, keyLocation: `https://${HOST}/${keyFile}`, urlList }),
});
console.log(`IndexNow: HTTP ${res.status} for ${urlList.length} URLs`, urlList);
