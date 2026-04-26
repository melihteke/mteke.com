import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { compile } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";

export type Project = {
  slug: string;
  title: string;
  description: string;
  publishDate: Date;
  updatedDate?: Date;
  tags: string[];
  cover?: string;
  featured: boolean;
  draft: boolean;
  github?: string;
  link?: string;
  content: string;
};

const CONTENT_DIR = path.join(process.cwd(), "content", "projects");

async function listProjectSlugs(): Promise<string[]> {
  try {
    const entries = await fs.readdir(CONTENT_DIR, { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((e) => e.name);
  } catch {
    return [];
  }
}

const compileCache = new Map<string, boolean>();

async function isCompilable(slug: string, content: string): Promise<boolean> {
  const cached = compileCache.get(slug);
  if (cached !== undefined) return cached;
  try {
    await compile(content, { remarkPlugins: [remarkGfm] });
    compileCache.set(slug, true);
    return true;
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(
        `[projects] skipping "${slug}" — MDX compile failed: ${msg.split("\n")[0]}`,
      );
    }
    compileCache.set(slug, false);
    return false;
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
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
        ? `/projects/${slug}/${data.cover.slice(2)}`
        : data.cover
      : undefined;

  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    publishDate: data.publishDate ? new Date(data.publishDate) : new Date(0),
    updatedDate: data.updatedDate ? new Date(data.updatedDate) : undefined,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    cover,
    featured: Boolean(data.featured),
    draft: Boolean(data.draft),
    github: typeof data.github === "string" ? data.github : undefined,
    link: typeof data.link === "string" ? data.link : undefined,
    content,
  };
}

export async function getAllProjects({ includeDrafts = false } = {}): Promise<Project[]> {
  const slugs = await listProjectSlugs();
  const projects = (await Promise.all(slugs.map((s) => getProjectBySlug(s)))).filter(
    (p): p is Project => Boolean(p) && (includeDrafts || !p!.draft),
  );
  return projects.sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
}
