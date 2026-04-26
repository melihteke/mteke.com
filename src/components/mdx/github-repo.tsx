import { FaGithub } from "react-icons/fa6";

export function GitHubRepo({
  repo,
  description,
  language,
  stars,
}: {
  repo: string;
  description?: string;
  language?: string;
  stars?: number | string;
}) {
  const href = `https://github.com/${repo}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="not-prose my-6 block rounded-2xl border border-border/70 bg-bg-elev px-5 py-4 transition hover:border-accent hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/5 no-underline"
    >
      <div className="flex items-start gap-4">
        <div className="size-10 rounded-xl bg-bg flex items-center justify-center shrink-0 border border-border/60">
          <FaGithub className="size-5 text-fg" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-mono text-sm text-fg-muted truncate">github.com</div>
          <div className="font-semibold text-fg truncate">{repo}</div>
          {description && (
            <p className="mt-1 text-sm text-fg-muted line-clamp-2">{description}</p>
          )}
          {(language || stars != null) && (
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-fg-muted">
              {language && (
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-accent" />
                  {language}
                </span>
              )}
              {stars != null && (
                <span className="inline-flex items-center gap-1">★ {stars}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </a>
  );
}
