import { visit } from "unist-util-visit";
import type { Root, Element } from "hast";

/**
 * Reads `style="dracula"` (or `nord`, `solarized`, `monokai`) from a fenced
 * code block's meta string and copies it onto the wrapping
 * <figure data-rehype-pretty-code-figure> as `data-code-style="<value>"`.
 *
 * Pair this with CSS that uses --shiki-{key} variables to switch the rendered
 * tokens to a different Shiki theme on a per-block basis.
 *
 * Note: rehype-pretty-code stores the original meta on the inner <code>
 * element under data.meta — we read it from there.
 */
const STYLE_RE = /(?:^|\s)style="([^"]+)"/;

export function codeStyleMeta() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "figure") return;
      const props = (node.properties ?? {}) as Record<string, unknown>;
      if (!("dataRehypePrettyCodeFigure" in props)) return;

      // Find inner <code> with the original meta string
      const pre = node.children.find(
        (c) => c.type === "element" && (c as Element).tagName === "pre",
      ) as Element | undefined;
      const code = pre?.children.find(
        (c) => c.type === "element" && (c as Element).tagName === "code",
      ) as Element | undefined;
      const meta = (code?.data as { meta?: string } | undefined)?.meta ?? "";
      const m = STYLE_RE.exec(meta);
      if (!m) return;

      (node.properties ??= {})["data-code-style"] = m[1];
    });
  };
}
