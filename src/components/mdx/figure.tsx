import Image from "next/image";

type Align = "left" | "center" | "right";

export function Figure({
  src,
  alt = "",
  caption,
  width = 1200,
  height = 675,
  align = "center",
}: {
  src: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
  align?: Align;
}) {
  const alignClass =
    align === "left" ? "mr-auto" : align === "right" ? "ml-auto" : "mx-auto";

  return (
    <figure className={`my-6 ${alignClass}`} style={{ maxWidth: width }}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="rounded-xl border border-border/60 w-full h-auto"
        unoptimized
      />
      {caption && (
        <figcaption className="mt-2 text-sm text-fg-muted text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
