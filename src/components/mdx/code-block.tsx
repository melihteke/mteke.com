"use client";

import { useRef, useState, type HTMLAttributes } from "react";
import { Check, Copy } from "lucide-react";

export function Pre(props: HTMLAttributes<HTMLPreElement>) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const text = ref.current?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(text.replace(/\n+$/, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="group relative">
      <pre
        ref={ref}
        {...props}
        className={`${props.className ?? ""} my-6 overflow-x-auto rounded-xl border border-border/60 bg-code-bg text-sm`}
      />
      <button
        type="button"
        aria-label={copied ? "Copied" : "Copy code"}
        onClick={handleCopy}
        className="absolute top-2 right-2 size-8 rounded-md border border-border/70 bg-bg-elev/90 backdrop-blur opacity-0 group-hover:opacity-100 focus:opacity-100 transition flex items-center justify-center"
      >
        {copied ? (
          <Check className="size-4 text-emerald-500" />
        ) : (
          <Copy className="size-4 text-fg-muted" />
        )}
      </button>
    </div>
  );
}

export function InlineCode(props: HTMLAttributes<HTMLElement>) {
  // rehype-pretty-code, inline highlight için kendi span'ını üretir.
  // Bu component sadece highlight olmayan inline `code`'lar için stil sağlar.
  const isHighlighted = "data-rehype-pretty-code-figure" in props;
  if (isHighlighted) return <code {...props} />;
  return (
    <code
      {...props}
      className={`${props.className ?? ""} rounded bg-code-bg px-[0.35em] py-[0.15em] text-[0.92em] font-mono before:content-[''] after:content-['']`}
    />
  );
}
