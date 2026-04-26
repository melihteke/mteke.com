import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, tags] = await Promise.all([getAllPosts(), getAllTags()]);
  const base = siteConfig.url;
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, priority: 1 },
    { url: `${base}/blog/`, lastModified: now, priority: 0.9 },
    { url: `${base}/about/`, lastModified: now, priority: 0.7 },
    { url: `${base}/projects/`, lastModified: now, priority: 0.7 },
    ...posts.map((p) => ({
      url: `${base}/blog/${p.slug}/`,
      lastModified: p.updatedDate ?? p.publishDate,
      priority: 0.8,
    })),
    ...tags.map(({ tag }) => ({
      url: `${base}/tags/${encodeURIComponent(tag)}/`,
      lastModified: now,
      priority: 0.5,
    })),
  ];
}
