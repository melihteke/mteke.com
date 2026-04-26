// Copies content/<base>/<slug>/*.{png,jpg,gif,svg,webp,avif,mp4,webm,...}
// into public/<base>/<slug>/ for both blog posts and project pages, so MDX
// references like ./image.png resolve from the deployed site.

import fs from "node:fs/promises";
import path from "node:path";

const BASES = ["blog", "projects"];
const ALLOWED = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".avif",
  ".mp4", ".webm", ".mov",
  ".pdf", ".zip",
]);

async function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(full)));
    else if (ALLOWED.has(path.extname(e.name).toLowerCase())) out.push(full);
  }
  return out;
}

let totalCopied = 0;
for (const base of BASES) {
  const src = path.join(process.cwd(), "content", base);
  const dest = path.join(process.cwd(), "public", base);
  const files = await walk(src);
  for (const file of files) {
    const rel = path.relative(src, file);
    const target = path.join(dest, rel);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.copyFile(file, target);
    totalCopied++;
  }
  if (files.length > 0) {
    console.log(`✓ Copied ${files.length} content asset(s) to public/${base}/`);
  }
}
if (totalCopied === 0) console.log("✓ No content assets to copy");
