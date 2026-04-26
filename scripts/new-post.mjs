#!/usr/bin/env node
// Scaffold a new blog post folder + MDX file.
// Usage: npm run new-post "Your Post Title"

import fs from "node:fs/promises";
import path from "node:path";

const title = process.argv.slice(2).join(" ").trim();
if (!title) {
  console.error('Usage: npm run new-post "Your Post Title"');
  process.exit(1);
}

function slugify(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const slug = slugify(title);
const dir = path.join(process.cwd(), "content", "blog", slug);
const file = path.join(dir, "index.mdx");

try {
  await fs.access(file);
  console.error(`✗ Already exists: ${path.relative(process.cwd(), file)}`);
  process.exit(1);
} catch {
  /* doesn't exist — continue */
}

const today = new Date().toISOString().slice(0, 10);
const template = `---
title: "${title.replace(/"/g, '\\"')}"
description: ""
publishDate: ${today}
tags: []
# cover: ./cover.png
draft: true
---

Write your content here...

<Callout type="tip">
  An important tip.
</Callout>

\`\`\`python
print("hello")
\`\`\`
`;

await fs.mkdir(dir, { recursive: true });
await fs.writeFile(file, template, "utf8");
console.log(`✓ Created: ${path.relative(process.cwd(), file)}`);
console.log(`  Slug: ${slug}`);
console.log(`  draft: true → set to false before publishing.`);
