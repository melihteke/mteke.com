import { Package } from "lucide-react";

export function PyPI({
  pkg,
  description,
  version,
  python,
}: {
  pkg: string;
  description?: string;
  version?: string;
  python?: string;
}) {
  const href = `https://pypi.org/project/${pkg}/`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="not-prose my-6 block rounded-2xl border border-border/70 bg-bg-elev px-5 py-4 transition hover:border-accent hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/5 no-underline"
    >
      <div className="flex items-start gap-4">
        <div className="size-10 rounded-xl bg-bg flex items-center justify-center shrink-0 border border-border/60">
          <Package className="size-5 text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-mono text-sm text-fg-muted truncate">pypi.org</div>
          <div className="font-semibold text-fg truncate">{pkg}</div>
          {description && (
            <p className="mt-1 text-sm text-fg-muted line-clamp-2">{description}</p>
          )}
          {(version || python) && (
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-fg-muted">
              {version && (
                <span className="inline-flex items-center gap-1">v{version}</span>
              )}
              {python && (
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-accent-2" />
                  {python}
                </span>
              )}
              <span className="inline-flex items-center gap-1 font-mono">
                pip install {pkg}
              </span>
            </div>
          )}
        </div>
      </div>
    </a>
  );
}
