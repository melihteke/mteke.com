type SpotifyKind = "track" | "album" | "playlist" | "episode" | "show" | "artist";

export function Spotify({
  id,
  type = "track",
  height,
  theme,
}: {
  id: string;
  type?: SpotifyKind;
  height?: number | string;
  theme?: 0 | 1; // 0 = brand color, 1 = dark
}) {
  const defaultHeight = type === "track" || type === "episode" ? 152 : 380;
  const h = height ?? defaultHeight;
  const params = new URLSearchParams({ utm_source: "generator" });
  if (theme != null) params.set("theme", String(theme));
  const src = `https://open.spotify.com/embed/${type}/${id}?${params.toString()}`;
  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-border/60">
      <iframe
        src={src}
        width="100%"
        height={h}
        loading="lazy"
        title={`Spotify ${type}`}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        style={{ border: 0, display: "block" }}
      />
    </div>
  );
}
