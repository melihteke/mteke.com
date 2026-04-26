import { Headphones, ExternalLink } from "lucide-react";

type Provider = "apple" | "overcast" | "youtube" | "rss";

export function Podcast({
  src,
  provider,
  title,
  height = 175,
}: {
  src: string;
  provider?: Provider;
  title?: string;
  height?: number | string;
}) {
  // For Apple Podcasts you can paste either the embed URL
  // (https://embed.podcasts.apple.com/...) or the page URL — we
  // upgrade page URLs to embeds automatically.
  let iframeSrc = src;
  if (provider === "apple" && src.includes("podcasts.apple.com") && !src.includes("embed.podcasts.apple.com")) {
    iframeSrc = src.replace("podcasts.apple.com", "embed.podcasts.apple.com");
  }

  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-border/60 bg-bg-elev">
      {title && (
        <div className="flex items-center justify-between gap-3 px-4 py-2 border-b border-border/60 text-sm">
          <div className="flex items-center gap-2 text-fg-muted">
            <Headphones className="size-4 text-accent" />
            <span className="font-medium text-fg truncate">{title}</span>
          </div>
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-fg-muted hover:text-accent"
          >
            Open <ExternalLink className="size-3" />
          </a>
        </div>
      )}
      <iframe
        src={iframeSrc}
        width="100%"
        height={height}
        loading="lazy"
        title={title ?? "Podcast episode"}
        allow="autoplay *; encrypted-media *; clipboard-write"
        style={{ border: 0, display: "block" }}
      />
    </div>
  );
}
