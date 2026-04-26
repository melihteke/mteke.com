import { getAllPosts, getAllTags } from "@/lib/posts";
import { BlogList } from "@/components/blog-list";

export const metadata = {
  title: "Blog",
  description: "Posts on networking, automation, and more.",
};

export default async function BlogPage() {
  const [posts, tags] = await Promise.all([getAllPosts(), getAllTags()]);

  // Date isn't a serializable prop — convert to ISO strings for the client.
  const serialized = posts.map((p) => ({
    ...p,
    publishDate: p.publishDate.toISOString(),
    updatedDate: p.updatedDate?.toISOString(),
  }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-2">Blog</h1>
      <p className="text-fg-muted mb-8">
        {posts.length} post{posts.length === 1 ? "" : "s"}
      </p>
      <BlogList posts={serialized} tags={tags} />
    </div>
  );
}
