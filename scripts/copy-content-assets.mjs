// content/blog/<slug>/*.{png,jpg,gif,svg,webp,avif,mp4,webm}
// dosyalarını public/blog/<slug>/ altına kopyalar. Böylece MDX
// içinde ./image.png yazılan dosyalar yayınlanan sitede çalışır.

import fs from "node:fs/promises";
import path from "node:path";

const SRC = path.join(process.cwd(), "content", "blog");
const DEST = path.join(process.cwd(), "public", "blog");
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

const files = await walk(SRC);
let copied = 0;
for (const file of files) {
  const rel = path.relative(SRC, file);
  const dest = path.join(DEST, rel);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.copyFile(file, dest);
  copied++;
}
console.log(`✓ Copied ${copied} content asset(s) to public/blog/`);
