import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/posts";

const dateFmt = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-2xl border border-border/60 bg-card overflow-hidden hover:border-accent hover:-translate-y-0.5 transition"
    >
      {post.cover && (
        <div className="aspect-[16/9] overflow-hidden bg-bg-elev">
          <Image
            src={post.cover}
            alt=""
            width={800}
            height={450}
            unoptimized
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        </div>
      )}
      <div className="flex-1 p-5 flex flex-col">
        <div className="text-xs text-fg-muted mb-2 flex items-center gap-2">
          <time dateTime={post.publishDate.toISOString()}>
            {dateFmt.format(post.publishDate)}
          </time>
          <span>·</span>
          <span>{post.readingMinutes} min read</span>
        </div>
        <h3 className="font-semibold text-lg leading-snug mb-2 group-hover:text-accent transition">
          {post.title}
        </h3>
        {post.description && (
          <p className="text-sm text-fg-muted line-clamp-2 mb-3">{post.description}</p>
        )}
        {post.tags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="text-xs px-2 py-0.5 rounded-full border border-border/60 text-fg-muted"
              >
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
