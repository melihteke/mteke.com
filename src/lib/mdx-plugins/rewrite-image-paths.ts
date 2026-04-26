import { visit } from "unist-util-visit";
import type { Root } from "mdast";

/**
 * Markdown içinde `./image.png` gibi relatif image yollarını
 * `/blog/<slug>/image.png` olarak yeniden yazar. Hem klasik
 * `![alt](./x.png)` hem de `<Figure src="./x.png" />` gibi MDX
 * JSX attribute'larını ele alır.
 */
type JsxAttribute = { type: string; name?: string; value?: unknown };
type JsxNode = { type: string; attributes?: JsxAttribute[] };

export function rewriteImagePaths(slug: string) {
  const prefix = `/blog/${slug}/`;
  const isRelative = (url: unknown): url is string =>
    typeof url === "string" && url.startsWith("./");

  return () => (tree: Root) => {
    visit(tree, "image", (node) => {
      if (isRelative(node.url)) {
        node.url = prefix + node.url.slice(2);
      }
    });

    // mdast core tipleri MDX JSX node'larını içermediği için unknown'a kaçıyoruz.
    visit(tree as unknown as Root, (node: unknown) => {
      const n = node as JsxNode;
      if (n.type !== "mdxJsxFlowElement" && n.type !== "mdxJsxTextElement") return;
      for (const attr of n.attributes ?? []) {
        if (attr.type !== "mdxJsxAttribute" || !attr.name) continue;
        if (
          (attr.name === "src" || attr.name === "cover" || attr.name === "poster") &&
          isRelative(attr.value)
        ) {
          attr.value = prefix + (attr.value as string).slice(2);
        }
      }
    });
  };
}
