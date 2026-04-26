import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";
import { MDXContent } from "@/lib/mdx";
import { siteConfig } from "@/lib/site";

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  const canonical = `${siteConfig.url}/projects/${project.slug}/`;
  return {
    title: project.title,
    description: project.description,
    alternates: { canonical },
    openGraph: {
      title: project.title,
      description: project.description,
      url: canonical,
      type: "article",
      images: project.cover ? [{ url: project.cover }] : undefined,
      tags: project.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      images: project.cover ? [project.cover] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <article data-pagefind-body className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1 text-sm text-fg-muted hover:text-accent mb-6"
        data-pagefind-ignore
      >
        <ArrowLeft className="size-4" /> Projects
      </Link>

      <header className="mb-8">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-[1.1]">
          {project.title}
        </h1>
        {project.description && (
          <p className="mt-4 text-lg text-fg-muted">{project.description}</p>
        )}
        {project.tags.length > 0 && (
          <div
            className="mt-5 flex flex-wrap gap-1.5"
            data-pagefind-ignore
          >
            {project.tags.map((t) => (
              <span
                key={t}
                className="text-xs px-2.5 py-1 rounded-md bg-bg border border-border/60 font-mono text-fg-muted"
              >
                {t}
              </span>
            ))}
          </div>
        )}
        {(project.github || project.link) && (
          <div className="mt-5 flex flex-wrap gap-3 text-sm" data-pagefind-ignore>
            {project.github && (
              <Link
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 hover:border-accent hover:text-accent transition"
              >
                <FaGithub className="size-4" /> Source
              </Link>
            )}
            {project.link && (
              <Link
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-accent-fg hover:opacity-90 transition"
              >
                Visit <ExternalLink className="size-4" />
              </Link>
            )}
          </div>
        )}
      </header>

      {project.cover && (
        <div className="mb-10 rounded-2xl overflow-hidden border border-border/60">
          <Image
            src={project.cover}
            alt=""
            width={1600}
            height={900}
            priority
            unoptimized
            className="w-full h-auto"
          />
        </div>
      )}

      <div className="prose-content min-w-0">
        <MDXContent source={project.content} slug={project.slug} base="projects" />
      </div>
    </article>
  );
}
