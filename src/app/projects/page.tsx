import Link from "next/link";
import { ArrowUpRight, ExternalLink, Sparkles } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { getAllProjects } from "@/lib/projects";

export const metadata = {
  title: "Projects",
  description: "Open-source experiments, automation tooling, and side projects.",
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();
  const featured = projects.filter((p) => p.featured);
  const more = projects.filter((p) => !p.featured);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <header className="mb-12">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-fg-muted mb-3">
          <Sparkles className="size-4 text-accent" />
          Selected work
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
          Projects
        </h1>
        <p className="text-fg-muted max-w-2xl">
          A mix of automation tooling, networking utilities, and AI experiments —
          mostly the little things I build on the weekends and write up later in
          the blog.
        </p>
      </header>

      {featured.length > 0 && (
        <section className="grid gap-6 mb-16">
          {featured.map((p, i) => (
            <article
              key={p.slug}
              className="group relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-bg-elev via-card to-bg p-8 sm:p-10 transition hover:border-accent"
            >
              <div className="grid sm:grid-cols-[1fr_auto] gap-6 items-start">
                <div className="min-w-0">
                  <div className="text-xs font-mono text-accent mb-2">
                    /{String(i + 1).padStart(2, "0")} — Featured
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
                    <Link
                      href={`/projects/${p.slug}`}
                      className="hover:text-accent transition"
                    >
                      {p.title}
                    </Link>
                  </h2>
                  {p.description && (
                    <p className="text-fg-muted/90 leading-relaxed mb-5 max-w-2xl">
                      {p.description}
                    </p>
                  )}
                  {p.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-5">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="text-xs px-2.5 py-1 rounded-md bg-bg border border-border/60 font-mono text-fg-muted"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-3 text-sm">
                    <Link
                      href={`/projects/${p.slug}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 hover:border-accent hover:text-accent transition"
                    >
                      Read more <ArrowUpRight className="size-4" />
                    </Link>
                    {p.github && (
                      <Link
                        href={p.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 hover:border-accent hover:text-accent transition"
                      >
                        <FaGithub className="size-4" /> Source
                      </Link>
                    )}
                    {p.link && (
                      <Link
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-accent-fg hover:opacity-90 transition"
                      >
                        Visit <ExternalLink className="size-4" />
                      </Link>
                    )}
                  </div>
                </div>
                <div
                  aria-hidden
                  className="hidden sm:flex size-28 rounded-2xl bg-bg border border-border/60 items-center justify-center font-mono text-3xl text-fg-muted group-hover:text-accent transition"
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      {more.length > 0 && (
        <section>
          <h2 className="text-xs uppercase tracking-widest text-fg-muted mb-4">
            More
          </h2>
          <ul className="rounded-2xl border border-border/60 overflow-hidden">
            {more.map((p) => (
              <li key={p.slug} className="border-b border-border/60 last:border-b-0">
                <Link
                  href={`/projects/${p.slug}`}
                  className="group grid grid-cols-[1fr_auto] gap-4 items-center px-5 py-4 hover:bg-bg-elev transition"
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-fg group-hover:text-accent transition">
                      {p.title}
                    </div>
                    {p.description && (
                      <div className="text-sm text-fg-muted line-clamp-2">
                        {p.description}
                      </div>
                    )}
                    {p.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {p.tags.slice(0, 5).map((t) => (
                          <span
                            key={t}
                            className="text-[11px] px-1.5 py-0.5 rounded-md bg-bg border border-border/60 font-mono text-fg-muted"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <ArrowUpRight className="size-5 text-fg-muted group-hover:text-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
