import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, Calendar, Clock } from "lucide-react";
import { getAllPosts, getPostBySlug, getAdjacentPosts } from "@/lib/posts";
import { MDXContent } from "@/lib/mdx";
import { TableOfContents } from "@/components/table-of-contents";
import { siteConfig } from "@/lib/site";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  const canonical = `${siteConfig.url}/blog/${post.slug}/`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical },
    openGraph: {
      title: post.title,
      description: post.description,
      url: canonical,
      type: "article",
      publishedTime: post.publishDate.toISOString(),
      modifiedTime: post.updatedDate?.toISOString(),
      images: post.cover ? [{ url: post.cover }] : undefined,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.cover ? [post.cover] : undefined,
    },
  };
}

export default async function PostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  const { prev, next } = await getAdjacentPosts(slug);

  return (
    <article data-pagefind-body className="mx-auto max-w-5xl px-4 py-10">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-sm text-fg-muted hover:text-accent mb-6"
        data-pagefind-ignore
      >
        <ArrowLeft className="size-4" /> Blog
      </Link>

      <header className="mb-8">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-[1.1]">
          {post.title}
        </h1>
        {post.description && (
          <p className="mt-4 text-lg text-fg-muted">{post.description}</p>
        )}
        <div
          className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-fg-muted"
          data-pagefind-ignore
        >
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="size-4" />
            <time dateTime={post.publishDate.toISOString()}>
              {post.publishDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-4" /> {post.readingMinutes} min read
          </span>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((t) => (
                <Link
                  key={t}
                  href={`/tags/${encodeURIComponent(t)}`}
                  className="text-xs px-2 py-0.5 rounded-full border border-border/60 hover:border-accent hover:text-accent transition"
                >
                  #{t}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      {post.cover && (
        <div className="mb-10 rounded-2xl overflow-hidden border border-border/60">
          <Image
            src={post.cover}
            alt=""
            width={1600}
            height={900}
            priority
            unoptimized
            className="w-full h-auto"
          />
        </div>
      )}

      <div className="grid lg:grid-cols-[minmax(0,1fr)_220px] gap-10">
        <div className="prose-content min-w-0">
          <MDXContent source={post.content} slug={post.slug} />
        </div>
        <aside className="hidden lg:block" data-pagefind-ignore>
          <TableOfContents headings={post.headings} />
        </aside>
      </div>

      <hr className="my-12 border-border/60" data-pagefind-ignore />

      <nav
        className="grid sm:grid-cols-2 gap-4 mb-12"
        data-pagefind-ignore="all"
      >
        {prev ? (
          <Link
            href={`/blog/${prev.slug}`}
            className="block p-5 rounded-2xl border border-border/60 hover:border-accent transition"
          >
            <div className="text-xs text-fg-muted mb-1 inline-flex items-center gap-1">
              <ArrowLeft className="size-3" /> Previous
            </div>
            <div className="font-medium">{prev.title}</div>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/blog/${next.slug}`}
            className="block sm:col-start-2 p-5 rounded-2xl border border-border/60 hover:border-accent transition sm:text-right"
          >
            <div className="text-xs text-fg-muted mb-1 inline-flex items-center gap-1 sm:flex-row-reverse">
              <ArrowRight className="size-3" /> Next
            </div>
            <div className="font-medium">{next.title}</div>
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
