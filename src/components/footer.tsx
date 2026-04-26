import Link from "next/link";
import { socialLinks } from "@/lib/social";
import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="mx-auto max-w-5xl px-4 py-10 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between text-sm text-fg-muted">
        <div className="flex items-center gap-2">
          <span>© {new Date().getFullYear()} {siteConfig.name}.</span>
          <Link href="/rss.xml" className="hover:text-accent transition">RSS</Link>
        </div>

        <div className="flex flex-wrap gap-3">
          {socialLinks.map(({ name, href, icon: Icon }) => (
            <Link
              key={name}
              href={href}
              aria-label={name}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="size-9 inline-flex items-center justify-center rounded-full border border-border/60 hover:border-accent hover:text-accent transition"
            >
              <Icon className="size-4" />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
