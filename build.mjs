// Generates the deployable `public/` directory.
//
// This is a single-page app: `index.html` is the whole game. The build just copies
// it (and the optional images/ directory) into `public/` so the Cloudflare
// static-assets Worker has a clean directory to serve.

import { rm, mkdir, copyFile, cp, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = join(ROOT, "public");

async function exists(p) {
  try { await stat(p); return true; } catch { return false; }
}

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

await copyFile(join(ROOT, "index.html"), join(OUT, "index.html"));

// Copy per-square images if any are present.
if (await exists(join(ROOT, "images"))) {
  await cp(join(ROOT, "images"), join(OUT, "images"), { recursive: true });
}

console.log("Built public/ (index.html" + ((await exists(join(OUT, "images"))) ? " + images/" : "") + ")");
