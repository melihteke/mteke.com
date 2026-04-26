import Link from "next/link";
import { socialLinks } from "@/lib/social";

export const metadata = {
  title: "About me",
  description:
    "Melih Teke — 15+ years in network engineering, NetDevOps, and automation.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-2">About me</h1>
      <p className="text-fg-muted text-lg mb-10">Network Engineer & NetDevOps</p>

      <div className="text-base sm:text-lg leading-relaxed text-fg space-y-4 mb-12">
        <p>
          Hi! I&apos;m <strong>Melih Teke</strong>. I&apos;ve been a network engineer for
          15+ years and over the last few years I&apos;ve shifted my focus to network
          automation and <em>NetDevOps</em>.
        </p>
        <p>
          I&apos;m passionate about learning new technologies and applying creative
          solutions to optimize network performance. This site is where I share what
          I&apos;m learning about Cisco, Python, automation, AI/LLMs, and cloud services.
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-4">Get in touch</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {socialLinks
          .filter((s) => s.name !== "RSS")
          .map(({ name, href, icon: Icon, handle }) => (
            <Link
              key={name}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="flex items-center gap-3 p-4 rounded-xl border border-border/60 bg-card hover:border-accent hover:-translate-y-0.5 transition"
            >
              <Icon className="size-5 text-accent shrink-0" />
              <div className="min-w-0">
                <div className="font-medium leading-tight">{name}</div>
                <div className="text-sm text-fg-muted truncate">{handle}</div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
