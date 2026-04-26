#!/usr/bin/env node
// Convert a Ghost JSON export into MDX posts.
// Usage:
//   1) Ghost Admin → Settings → Labs → Export content (JSON)
//   2) Drop the file at the project root: ./ghost-export.json
//   3) node scripts/migrate-from-ghost.mjs ./ghost-export.json
//
// What it does:
//   - For each published post, creates content/blog/<slug>/index.mdx
//   - Converts the HTML body to Markdown via turndown
//   - Downloads feature_image (cover) and inline image URLs into the
//     post folder and rewrites references to relative paths
//   - Drafts are written with draft: true
//   - Slugify is locale-aware (Turkish characters supported)

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Buffer } from "node:buffer";
import TurndownService from "turndown";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

// Parse args: positional input + --ghost-url=...
const args = process.argv.slice(2);
const ghostUrlArg = args.find((a) => a.startsWith("--ghost-url="));
const positional = args.filter((a) => !a.startsWith("--"));
const inputArg = positional[0] ?? "ghost-export.json";
const inputPath = path.resolve(ROOT, inputArg);

// Ghost exports use the literal "__GHOST_URL__" placeholder for image URLs.
// Resolve it to the real Ghost host so images can be downloaded.
const GHOST_URL = (ghostUrlArg?.split("=")[1] ?? process.env.GHOST_URL ?? "").replace(/\/$/, "");

function resolveUrl(url) {
  if (!url) return url;
  if (url.startsWith("__GHOST_URL__")) {
    if (!GHOST_URL) return null; // signal: needs ghost url
    return GHOST_URL + url.slice("__GHOST_URL__".length);
  }
  return url;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function slugify(s) {
  return String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u")
    .replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function yamlString(v) {
  if (v == null) return '""';
  const s = String(v).replace(/"/g, '\\"');
  return `"${s}"`;
}

function frontmatter(obj) {
  const lines = ["---"];
  for (const [k, v] of Object.entries(obj)) {
    if (v == null || v === "") continue;
    if (Array.isArray(v)) {
      lines.push(`${k}: [${v.map((x) => yamlString(x)).join(", ")}]`);
    } else if (typeof v === "boolean") {
      lines.push(`${k}: ${v}`);
    } else if (k === "publishDate" || k === "updatedDate") {
      lines.push(`${k}: ${v}`);
    } else {
      lines.push(`${k}: ${yamlString(v)}`);
    }
  }
  lines.push("---", "");
  return lines.join("\n");
}

async function downloadImage(rawUrl, destDir) {
  const url = resolveUrl(rawUrl);
  if (!url) {
    console.warn(`  ! Skipped (no GHOST_URL set): ${rawUrl}`);
    return null;
  }
  try {
    const u = new URL(url);
    const baseName = path.basename(u.pathname).split("?")[0] || "image";
    const safeName = baseName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const dest = path.join(destDir, safeName);
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`  ! Image fetch failed (${res.status}): ${url}`);
      return null;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    await fs.writeFile(dest, buf);
    await sleep(120); // be polite — avoids rate-limits on Ghost CDN + GitHub OG endpoints
    return safeName;
  } catch (e) {
    console.warn(`  ! Image error: ${url} — ${e.message}`);
    return null;
  }
}

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
  emDelimiter: "_",
});

// Ghost <figure><img/><figcaption/></figure> → Markdown image + caption satırı
turndown.addRule("ghostFigure", {
  filter: (node) => node.nodeName === "FIGURE",
  replacement: (_content, node) => {
    const img = node.querySelector("img");
    const cap = node.querySelector("figcaption");
    if (!img) return _content;
    const src = img.getAttribute("src") ?? "";
    const alt = img.getAttribute("alt") ?? "";
    const caption = cap?.textContent?.trim() ?? "";
    const md = `![${alt}](${src})`;
    return caption ? `\n\n${md}\n\n_${caption}_\n\n` : `\n\n${md}\n\n`;
  },
});

// Ghost code card → fenced code block (dil bilgisi class'tan)
turndown.addRule("ghostCode", {
  filter: (node) =>
    node.nodeName === "PRE" && node.firstChild && node.firstChild.nodeName === "CODE",
  replacement: (_content, node) => {
    const code = node.firstChild;
    const cls = code.getAttribute("class") ?? "";
    const m = cls.match(/language-(\w+)/);
    const lang = m ? m[1] : "";
    const text = code.textContent ?? "";
    return `\n\n\`\`\`${lang}\n${text.replace(/\n$/, "")}\n\`\`\`\n\n`;
  },
});

async function main() {
  let raw;
  try {
    raw = await fs.readFile(inputPath, "utf8");
  } catch {
    console.error(`✗ Could not read file: ${inputPath}`);
    console.error('  Usage: node scripts/migrate-from-ghost.mjs ./ghost-export.json');
    process.exit(1);
  }

  const data = JSON.parse(raw);
  const db = data?.db?.[0]?.data ?? data?.data ?? data;
  const posts = db.posts ?? [];
  const tagsTable = db.tags ?? [];
  const postsTags = db.posts_tags ?? [];

  const tagById = new Map(tagsTable.map((t) => [t.id, t.slug ?? slugify(t.name)]));
  const tagsByPostId = new Map();
  for (const pt of postsTags) {
    const arr = tagsByPostId.get(pt.post_id) ?? [];
    const slug = tagById.get(pt.tag_id);
    if (slug) arr.push(slug);
    tagsByPostId.set(pt.post_id, arr);
  }

  let count = 0;
  for (const post of posts) {
    if (post.type && post.type !== "post") continue;
    const slug = post.slug || slugify(post.title || "post");
    const dir = path.join(ROOT, "content", "blog", slug);
    await fs.mkdir(dir, { recursive: true });

    // Cover image
    let coverFile = null;
    if (post.feature_image) {
      coverFile = await downloadImage(post.feature_image, dir);
    }

    // Body: prefer rendered HTML; fall back to a placeholder if only mobiledoc is present.
    let bodyMd = "";
    if (post.html) {
      // Download inline images and rewrite their src to a local relative path.
      const imgSrcs = [...post.html.matchAll(/<img[^>]+src="([^"]+)"/g)].map((m) => m[1]);
      const urlMap = new Map();
      for (const src of imgSrcs) {
        if (!src.startsWith("http") && !src.startsWith("__GHOST_URL__")) continue;
        const local = await downloadImage(src, dir);
        if (local) urlMap.set(src, `./${local}`);
      }
      let html = post.html;
      for (const [from, to] of urlMap) {
        html = html.split(from).join(to);
      }
      bodyMd = turndown.turndown(html);
    } else {
      bodyMd = "<!-- Ghost mobiledoc body — needs manual rewrite -->\n";
    }

    const tags = tagsByPostId.get(post.id) ?? [];
    const publishDate = (post.published_at ?? post.created_at ?? "").slice(0, 10);
    const updatedDate = (post.updated_at ?? "").slice(0, 10);

    const fm = frontmatter({
      title: post.title ?? slug,
      description: post.custom_excerpt ?? post.meta_description ?? post.excerpt ?? "",
      publishDate: publishDate || new Date().toISOString().slice(0, 10),
      updatedDate: updatedDate && updatedDate !== publishDate ? updatedDate : null,
      tags,
      cover: coverFile ? `./${coverFile}` : null,
      draft: post.status !== "published",
    });

    const file = path.join(dir, "index.mdx");
    await fs.writeFile(file, `${fm}${bodyMd.trim()}\n`, "utf8");
    count++;
    console.log(`✓ ${slug}`);
  }

  console.log(`\n${count} post(s) imported → content/blog/`);
  console.log("Next: open the first 2-3 posts and review the conversion quality.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
