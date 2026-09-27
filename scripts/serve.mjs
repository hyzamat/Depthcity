// Serves the production build (the static export in ./out) the way a real host would: correct media types,
// byte ranges for the videos, and long caching for the hashed JS/CSS. usage: node scripts/serve.mjs [port]
import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { networkInterfaces } from "node:os";
import { fileURLToPath } from "node:url";

const dir = fileURLToPath(new URL("../out/", import.meta.url));
const port = +(process.argv[2] ?? process.env.PORT ?? 3000);
const types = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".png": "image/png", ".webp": "image/webp", ".avif": "image/avif", ".jpg": "image/jpeg", ".svg": "image/svg+xml",
  ".woff2": "font/woff2", ".ico": "image/x-icon", ".txt": "text/plain", ".mp4": "video/mp4",
};

createServer(async (req, res) => {
  const p = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^([/\\])+/, "");
  let file = join(dir, p);
  let st;
  try {
    st = await stat(file);
    if (st.isDirectory()) { file = join(file, "index.html"); st = await stat(file); }
  } catch {
    try {
      file = join(dir, "404.html");
      st = await stat(file);
    } catch {
      res.writeHead(404).end("Not found — run `npm run build` first.");
      return;
    }
  }
  const headers = { "Content-Type": types[extname(file)] ?? "application/octet-stream", "Accept-Ranges": "bytes" };
  if (p.startsWith("_next")) headers["Cache-Control"] = "public, max-age=31536000, immutable";
  const range = req.headers.range?.match(/bytes=(\d*)-(\d*)/);
  if (range) {
    const start = range[1] ? +range[1] : 0;
    const end = range[2] ? Math.min(+range[2], st.size - 1) : st.size - 1;
    res.writeHead(206, { ...headers, "Content-Range": `bytes ${start}-${end}/${st.size}`, "Content-Length": end - start + 1 });
    createReadStream(file, { start, end }).pipe(res);
  } else {
    res.writeHead(200, { ...headers, "Content-Length": st.size });
    createReadStream(file).pipe(res);
  }
}).listen(port, () => {
  console.log(`Depth City (production build) on http://localhost:${port}`);
  // Also reachable from phones on the same Wi-Fi/LAN (virtual adapters skipped, they are not on the network).
  for (const [name, addrs] of Object.entries(networkInterfaces())) {
    if (/vmware|virtual|vethernet|hyper-v|wsl|loopback/i.test(name)) continue;
    for (const a of addrs) if (a.family === "IPv4" && !a.internal) console.log(`  on your phone (same Wi-Fi): http://${a.address}:${port}`);
  }
});
