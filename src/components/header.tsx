import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { CodeThemePicker } from "@/components/code-theme-picker";
import { siteConfig } from "@/lib/site";

const nav = [
  { href: "/",          label: "Home" },
  { href: "/blog",      label: "Blog" },
  { href: "/projects",  label: "Projects" },
  { href: "/about",     label: "About me" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-bg/70 border-b border-border/60">
      <div className="mx-auto max-w-5xl px-4 h-16 flex items-center justify-between gap-6">
        <Link
          href="/"
          className="font-mono text-base font-semibold tracking-tight hover:text-accent transition"
        >
          {siteConfig.shortName}
          <span className="text-accent">.com</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-3 text-sm">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-2 py-1.5 rounded-md text-fg-muted hover:text-fg hover:bg-bg-elev transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <CodeThemePicker />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
