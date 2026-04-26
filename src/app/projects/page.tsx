import Link from "next/link";
import { ArrowUpRight, ExternalLink, Sparkles } from "lucide-react";
import { FaGithub } from "react-icons/fa6";

export const metadata = {
  title: "Projects",
  description: "Open-source experiments, automation tooling, and side projects.",
};

type Project = {
  name: string;
  tagline: string;
  description: string;
  tags: string[];
  github?: string;
  link?: string;
  /** Mark as a featured / hero project — gets the larger card treatment. */
  featured?: boolean;
};

// To add a project, append to this array.
// Use `featured: true` for the hero list (top), otherwise it lands in the
// compact list below.
const projects: Project[] = [
  {
    name: "Network Engineer Jokes Twitter Bot",
    tagline: "AI-driven netjokes, every 60 minutes.",
    description:
      "A Twitter bot that generates and posts network-engineering humor using a self-hosted Llama 3 model. Runs on a home Proxmox lab in an LXC container, provisioned with Terraform.",
    tags: ["Python", "Tweepy", "Llama 3", "Terraform", "Proxmox", "LXC"],
    link: "https://x.com/melyteke",
    featured: true,
  },
  {
    name: "Subnet Calculator MCP Server",
    tagline: "Bring subnet math into Claude, Goose & n8n.",
    description:
      "A Model Context Protocol server that exposes subnet calculations as tools — integrates with n8n flows and Claude / Goose agents for one-shot CIDR, mask, and host-range answers.",
    tags: ["MCP", "TypeScript", "Networking", "n8n", "Claude"],
    featured: true,
  },
  {
    name: "Source of Truth — Network Inventory",
    tagline: "From spreadsheets to a queryable inventory.",
    description:
      "Reference architecture for building a single source of truth for network devices: NetBox + Git, with Ansible and CI hooks that keep production in sync with the SoT.",
    tags: ["NetBox", "Ansible", "Git", "NetDevOps"],
    featured: true,
  },
  {
    name: "Real-time GPS Tracker for Business Travel",
    tagline: "Live travel telemetry → expense reports.",
    description:
      "Collects GPS samples from a phone, ships them to a backend, and produces shareable travel reports. Useful for accurate business-travel logging without manual entry.",
    tags: ["GPS", "Realtime", "Python"],
  },
  {
    name: "Wine Review Application",
    tagline: "A small Flask app — rate, review, search.",
    description:
      "A weekend project to learn full-stack basics: Flask backend, SQLite store, Bootstrap UI, plus a Docker image so it deploys anywhere with one command.",
    tags: ["Flask", "Python", "SQLite", "Docker"],
  },
  {
    name: "WTI SDK Library",
    tagline: "Pythonic client for WTI console servers.",
    description:
      "Open-source SDK around the Western Telematic API for managing console servers programmatically — auth, plug control, status reads, and rebooting devices from scripts.",
    tags: ["Python", "SDK", "REST", "Networking"],
  },
];

const featured = projects.filter((p) => p.featured);
const more = projects.filter((p) => !p.featured);

export default function ProjectsPage() {
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

      {/* Featured — large alternating cards. Distinct from blog tiles. */}
      {featured.length > 0 && (
        <section className="grid gap-6 mb-16">
          {featured.map((p, i) => (
            <article
              key={p.name}
              className="group relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-bg-elev via-card to-bg p-8 sm:p-10 transition hover:border-accent"
            >
              <div className="grid sm:grid-cols-[1fr_auto] gap-6 items-start">
                <div className="min-w-0">
                  <div className="text-xs font-mono text-accent mb-2">
                    /{String(i + 1).padStart(2, "0")} — Featured
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
                    {p.name}
                  </h2>
                  <p className="text-base text-fg-muted italic mb-4">{p.tagline}</p>
                  <p className="text-fg-muted/90 leading-relaxed mb-5 max-w-2xl">
                    {p.description}
                  </p>
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
                  <div className="flex flex-wrap gap-3 text-sm">
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

      {/* More — compact list with row hover, no thumbnails */}
      {more.length > 0 && (
        <section>
          <h2 className="text-xs uppercase tracking-widest text-fg-muted mb-4">
            More
          </h2>
          <ul className="rounded-2xl border border-border/60 overflow-hidden">
            {more.map((p) => {
              const href = p.link ?? p.github ?? null;
              const Row = href ? "a" : "div";
              const rowProps = href
                ? {
                    href,
                    target: "_blank" as const,
                    rel: "noopener noreferrer" as const,
                  }
                : {};
              return (
                <li key={p.name} className="border-b border-border/60 last:border-b-0">
                  <Row
                    {...rowProps}
                    className="group grid grid-cols-[1fr_auto] gap-4 items-center px-5 py-4 hover:bg-bg-elev transition"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-fg group-hover:text-accent transition">
                        {p.name}
                      </div>
                      <div className="text-sm text-fg-muted truncate">
                        {p.tagline}
                      </div>
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
                    </div>
                    {href && (
                      <ArrowUpRight className="size-5 text-fg-muted group-hover:text-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition shrink-0" />
                    )}
                  </Row>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
