"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/posts";

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState<string | null>(headings[0]?.slug ?? null);

  useEffect(() => {
    if (!headings.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: [0, 1] },
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.slug);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="text-sm sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2"
    >
      <div className="font-semibold text-fg mb-3 text-xs uppercase tracking-wider text-fg-muted">
        On this page
      </div>
      <ul className="space-y-1 border-l border-border/60">
        {headings.map((h) => (
          <li key={h.slug}>
            <a
              href={`#${h.slug}`}
              className={`block py-1 -ml-px border-l-2 transition leading-snug ${
                active === h.slug
                  ? "border-accent text-accent font-medium"
                  : "border-transparent text-fg-muted hover:text-fg"
              } ${h.depth === 3 ? "pl-7" : "pl-3"}`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
