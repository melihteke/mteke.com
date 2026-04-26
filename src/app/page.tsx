import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/post-card";
import { socialLinks } from "@/lib/social";

export default async function HomePage() {
  const posts = (await getAllPosts()).slice(0, 6);

  return (
    <div className="mx-auto max-w-5xl px-4">
      <section className="py-20 sm:py-28">
        <p className="text-sm font-mono text-accent mb-3">Hi there 👋</p>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.05]">
          Network Engineer.
          <br />
          <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">
            NetDevOps. Automation.
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-fg-muted">
          15+ years in network engineering, Python/Cisco automation, and recent
          experiments with LLMs. I write about it here.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-accent text-accent-fg font-medium hover:opacity-90 transition"
          >
            Read the blog <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-border hover:border-accent hover:text-accent transition"
          >
            About me
          </Link>
        </div>
        <div className="mt-10 flex flex-wrap gap-2">
          {socialLinks
            .filter((s) => s.name !== "RSS")
            .map(({ name, href, icon: Icon }) => (
              <Link
                key={name}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={name}
                className="size-10 rounded-full border border-border/60 hover:border-accent hover:text-accent inline-flex items-center justify-center transition"
              >
                <Icon className="size-4" />
              </Link>
            ))}
        </div>
      </section>

      <section className="pb-20">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl font-bold">Latest posts</h2>
          <Link href="/blog" className="text-sm text-accent hover:underline">
            View all →
          </Link>
        </div>
        {posts.length === 0 ? (
          <p className="text-fg-muted">
            No posts yet. Drop your first MDX file under{" "}
            <code className="bg-code-bg px-1.5 py-0.5 rounded">content/blog/</code>.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
