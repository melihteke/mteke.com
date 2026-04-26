"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import Link from "next/link";
import { PostCard } from "@/components/post-card";
import type { Post } from "@/lib/posts";

type PagefindResult = {
  url: string;
  excerpt: string;
  meta: { title: string };
};
type Pagefind = {
  init: () => Promise<void>;
  search: (
    q: string,
  ) => Promise<{ results: { id: string; data: () => Promise<PagefindResult> }[] }>;
};
declare global {
  interface Window {
    __pagefind?: Pagefind;
  }
}

type SerializablePost = Omit<Post, "publishDate" | "updatedDate"> & {
  publishDate: string;
  updatedDate?: string;
};

export function BlogList({
  posts: serialized,
  tags,
}: {
  posts: SerializablePost[];
  tags: { tag: string; count: number }[];
}) {
  // Restore Date objects (server can't ship them through props directly).
  const posts: Post[] = useMemo(
    () =>
      serialized.map((p) => ({
        ...p,
        publishDate: new Date(p.publishDate),
        updatedDate: p.updatedDate ? new Date(p.updatedDate) : undefined,
      })),
    [serialized],
  );

  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [pagefind, setPagefind] = useState<Pagefind | null>(null);
  const [pfResults, setPfResults] = useState<PagefindResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // ⌘K / Ctrl+K shortcut
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lazy-load Pagefind for full-text suggestions (production only — dev has no /pagefind/).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (window.__pagefind) {
        setPagefind(window.__pagefind);
        return;
      }
      try {
        const mod = (await new Function(
          'return import("/pagefind/pagefind.js")',
        )()) as Pagefind;
        await mod.init();
        if (cancelled) return;
        window.__pagefind = mod;
        setPagefind(mod);
      } catch {
        /* dev or pre-build — clientside grid filter still works */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Pagefind suggestions for the dropdown (best-match jumps).
  useEffect(() => {
    if (!pagefind || !query.trim()) {
      setPfResults([]);
      return;
    }
    let cancelled = false;
    pagefind.search(query).then(async (r) => {
      if (cancelled || !r) return;
      const data = await Promise.all(r.results.slice(0, 5).map((x) => x.data()));
      setPfResults(data);
    });
    return () => {
      cancelled = true;
    };
  }, [query, pagefind]);

  // Live grid filter — title / description / tag substring match.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (activeTag && !p.tags.includes(activeTag)) return false;
      if (!q) return true;
      const hay = [
        p.title,
        p.description,
        ...p.tags,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [posts, query, activeTag]);

  return (
    <>
      <div className="relative">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-fg-muted" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts… (⌘K)"
            className="w-full rounded-xl border border-border/70 bg-bg-elev pl-10 pr-10 py-3 text-sm focus:outline-none focus:border-accent transition"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 size-7 inline-flex items-center justify-center rounded-md text-fg-muted hover:text-fg"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        {pfResults.length > 0 && (
          <ul className="absolute left-0 right-0 mt-2 z-10 rounded-xl border border-border bg-bg-elev shadow-xl overflow-hidden">
            {pfResults.map((r) => (
              <li key={r.url}>
                <a
                  href={r.url}
                  className="block px-4 py-3 hover:bg-bg transition border-b border-border/50 last:border-b-0"
                >
                  <div className="font-medium text-sm">{r.meta.title}</div>
                  <div
                    className="text-xs text-fg-muted line-clamp-2 mt-0.5 [&_mark]:bg-accent/20 [&_mark]:text-accent [&_mark]:rounded [&_mark]:px-1"
                    dangerouslySetInnerHTML={{ __html: r.excerpt }}
                  />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      {tags.length > 0 && (
        <div className="mt-6 mb-10 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            className={[
              "text-xs px-3 py-1 rounded-full border transition",
              activeTag === null
                ? "border-accent text-accent"
                : "border-border/60 hover:border-accent hover:text-accent",
            ].join(" ")}
          >
            All
          </button>
          {tags.map(({ tag, count }) => {
            const isActive = activeTag === tag;
            return (
              <div key={tag} className="inline-flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTag(isActive ? null : tag)}
                  className={[
                    "text-xs px-3 py-1 rounded-full border transition",
                    isActive
                      ? "border-accent text-accent bg-accent/10"
                      : "border-border/60 hover:border-accent hover:text-accent",
                  ].join(" ")}
                >
                  #{tag} <span className="text-fg-muted">({count})</span>
                </button>
                <Link
                  href={`/tags/${encodeURIComponent(tag)}`}
                  aria-label={`Open #${tag} tag page`}
                  className="text-[10px] text-fg-muted hover:text-accent"
                >
                  ↗
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 p-10 text-center text-fg-muted">
          No matches for &ldquo;{query}&rdquo;
          {activeTag ? <> in <span className="text-accent">#{activeTag}</span></> : null}.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      )}
    </>
  );
}
