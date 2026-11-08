// Copy the Reviewer & Creator Guide PDFs from the game's Store folder into public/guide/, under the names the site links
// to (see `guide` in src/content/site.ts). Run it after the PDFs change, then build, commit and push:
//   node scripts/sync-guides.mjs
import { copyFileSync, existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";

const SRC = process.argv[2] ?? "C:/Users/dell/DEPTH CITY/Store/Influencer Kit";
const DEST = fileURLToPath(new URL("../public/guide/", import.meta.url));

for (const code of ["EN", "ML", "HI", "AR"]) {
  const from = `${SRC}/DEPTH CITY - Reviewer Guide - ${code}.pdf`;
  const to = `${DEST}depth-city-reviewer-guide-${code.toLowerCase()}.pdf`;
  if (!existsSync(from)) {
    console.error(`missing: ${from}`);
    process.exitCode = 1;
    continue;
  }
  copyFileSync(from, to);
  console.log(`${code}: ${(statSync(to).size / 1e6).toFixed(2)} MB → public/guide/`);
}
