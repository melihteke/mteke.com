import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code";
import { rewriteImagePaths } from "@/lib/mdx-plugins/rewrite-image-paths";
import { codeStyleMeta } from "@/lib/mdx-plugins/code-style-meta";
import { mdxComponents } from "@/components/mdx";

// Multi-theme code highlighting:
//   - light / dark / navy → site-wide, picked by the active theme class
//   - dracula / nord / solarized / monokai → per-block opt-in via `style="..."`
const prettyCodeOptions: PrettyCodeOptions = {
  theme: {
    light: "github-light",
    dark: "github-dark-dimmed",
    navy: "github-dark",
    dracula: "dracula",
    nord: "nord",
    solarized: "solarized-dark",
    monokai: "monokai",
  },
  keepBackground: false,
  defaultLang: "plaintext",
};

export function MDXContent({ source, slug }: { source: string; slug: string }) {
  return (
    <MDXRemote
      source={source}
      components={mdxComponents}
      options={{
        parseFrontmatter: false,
        mdxOptions: {
          remarkPlugins: [remarkGfm, rewriteImagePaths(slug)],
          rehypePlugins: [
            rehypeSlug,
            [
              rehypeAutolinkHeadings,
              {
                behavior: "append",
                properties: { className: ["heading-anchor"], ariaHidden: "true", tabIndex: -1 },
                content: { type: "text", value: " #" },
              },
            ],
            [rehypePrettyCode, prettyCodeOptions],
            codeStyleMeta,
          ],
        },
      }}
    />
  );
}
