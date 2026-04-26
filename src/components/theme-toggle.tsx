"use client";

import { Anchor, Moon, Sun, type LucideIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type ThemeKey = "light" | "dark" | "navy";

const options: { key: ThemeKey; label: string; Icon: LucideIcon }[] = [
  { key: "light", label: "Light",  Icon: Sun },
  { key: "dark",  label: "Dark",   Icon: Moon },
  { key: "navy",  label: "Navy",   Icon: Anchor },
];

const VALID = new Set<ThemeKey>(["light", "dark", "navy"]);

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Self-heal: if a stale or unknown value is in storage (e.g. "system"
    // from an older config), snap it to the default theme.
    if (theme && !VALID.has(theme as ThemeKey)) setTheme("navy");
  }, [theme, setTheme]);

  const active: ThemeKey =
    mounted && VALID.has(theme as ThemeKey) ? (theme as ThemeKey) : "navy";

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="inline-flex items-center gap-0.5 rounded-full border border-border/70 bg-bg-elev p-0.5"
    >
      {options.map(({ key, label, Icon }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={`${label} theme`}
            title={`${label} theme`}
            onClick={() => setTheme(key)}
            className={[
              "size-8 inline-flex items-center justify-center rounded-full transition",
              isActive
                ? "bg-accent text-accent-fg"
                : "text-fg-muted hover:text-fg hover:bg-bg",
            ].join(" ")}
          >
            <Icon className="size-4" />
          </button>
        );
      })}
    </div>
  );
}
