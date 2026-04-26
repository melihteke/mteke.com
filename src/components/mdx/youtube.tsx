"use client";

import { useState } from "react";
import { Play } from "lucide-react";

type Align = "left" | "center" | "right";

export function YouTube({
  id,
  title = "YouTube video",
  width,
  align = "center",
  start,
}: {
  id: string;
  title?: string;
  /** "60%", 480, "320px" — outer width. Omit for full width. */
  width?: number | string;
  align?: Align;
  /** Start offset in seconds. */
  start?: number;
}) {
  const [active, setActive] = useState(false);

  const widthStyle =
    width !== undefined
      ? { width: typeof width === "number" ? `${width}px` : width, maxWidth: "100%" }
      : undefined;
  const alignClass =
    align === "left" ? "mr-auto" : align === "right" ? "ml-auto" : "mx-auto";

  const src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1${
    start ? `&start=${start}` : ""
  }`;
  // hqdefault is universally available and loads fast.
  // maxresdefault sometimes 404s for shorter / older videos.
  const poster = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

  return (
    <div className={`not-prose my-6 ${alignClass}`} style={widthStyle}>
      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border/60 shadow-sm bg-black">
        {active ? (
          <iframe
            src={src}
            title={title}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 size-full"
          />
        ) : (
          <button
            type="button"
            aria-label={`Play ${title}`}
            onClick={() => setActive(true)}
            className="group absolute inset-0 size-full cursor-pointer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={poster}
              alt={title}
              loading="lazy"
              className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <span className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            <span
              aria-hidden
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center size-16 rounded-full bg-white/95 text-red-600 shadow-xl transition-transform duration-200 group-hover:scale-110"
            >
              <Play className="size-7 ml-1 fill-current" />
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
