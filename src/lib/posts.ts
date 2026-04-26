import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { compile } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";

export type Heading = { depth: number; text: string; slug: string };

export type Post = {
  slug: string;
  title: string;
  description: string;
  publishDate: Date;
  updatedDate?: Date;
  tags: string[];
  cover?: string;
  draft: boolean;
  readingTime: string;
  readingMinutes: number;
  content: string;
  headings: Heading[];
};

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function extractHeadings(md: string): Heading[] {
  const lines = md.split("\n");
  const headings: Heading[] = [];
  let inFence = false;
  for (const line of lines) {
    if (/^```/.test(line)) inFence = !inFence;
    if (inFence) continue;
    const match = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (match) {
      const depth = match[1].length;
      const text = match[2].replace(/`([^`]+)`/g, "$1").trim();
      headings.push({ depth, text, slug: slugify(text) });
    }
  }
  return headings;
}

async function listPostSlugs(): Promise<string[]> {
  try {
    const entries = await fs.readdir(CONTENT_DIR, { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((e) => e.name);
  } catch {
    return [];
  }
}

// Cache MDX compile results so we only validate each post once per build.
const compileCache = new Map<string, boolean>();

async function isCompilable(slug: string, content: string): Promise<boolean> {
  const cached = compileCache.get(slug);
  if (cached !== undefined) return cached;
  try {
    await compile(content, {
      remarkPlugins: [remarkGfm],
      // No rehype plugins needed — we're only validating the MDX/JSX/Markdown grammar.
    });
    compileCache.set(slug, true);
    return true;
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[posts] skipping "${slug}" — MDX compile failed: ${msg.split("\n")[0]}`);
    }
    compileCache.set(slug, false);
    return false;
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const filePath = path.join(CONTENT_DIR, slug, "index.mdx");
  let raw: string;
  try {
    raw = await fs.readFile(filePath, "utf8");
  } catch {
    return null;
  }
  const { data, content } = matter(raw);
  if (!(await isCompilable(slug, content))) return null;
  const cover =
    typeof data.cover === "string"
      ? data.cover.startsWith("./")
        ? `/blog/${slug}/${data.cover.slice(2)}`
        : data.cover
      : undefined;
  const rt = readingTime(content);

  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    publishDate: data.publishDate ? new Date(data.publishDate) : new Date(0),
    updatedDate: data.updatedDate ? new Date(data.updatedDate) : undefined,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    cover,
    draft: Boolean(data.draft),
    readingTime: rt.text,
    readingMinutes: Math.max(1, Math.round(rt.minutes)),
    content,
    headings: extractHeadings(content),
  };
}

export async function getAllPosts({ includeDrafts = false } = {}): Promise<Post[]> {
  const slugs = await listPostSlugs();
  const posts = (await Promise.all(slugs.map((s) => getPostBySlug(s)))).filter(
    (p): p is Post => Boolean(p) && (includeDrafts || !p!.draft),
  );
  return posts.sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
}

export async function getAdjacentPosts(
  slug: string,
): Promise<{ prev: Post | null; next: Post | null }> {
  const posts = await getAllPosts();
  const idx = posts.findIndex((p) => p.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: posts[idx + 1] ?? null,
    next: posts[idx - 1] ?? null,
  };
}

export async function getAllTags(): Promise<{ tag: string; count: number }[]> {
  const posts = await getAllPosts();
  const counts = new Map<string, number>();
  for (const p of posts) for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter((p) => p.tags.includes(tag));
}

export function tagToSlug(tag: string): string {
  return slugify(tag);
}
