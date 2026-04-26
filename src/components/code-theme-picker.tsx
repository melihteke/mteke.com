"use client";

import { Check, Code2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type CodeTheme =
  | "auto"
  | "github-light"
  | "github-dark"
  | "dracula"
  | "nord"
  | "solarized"
  | "monokai";

const options: { key: CodeTheme; label: string; swatch: string }[] = [
  { key: "auto",         label: "Match site",     swatch: "linear-gradient(135deg,#ffffff 0 50%,#0b0b0d 50% 100%)" },
  { key: "github-light", label: "GitHub Light",   swatch: "#f6f8fa" },
  { key: "github-dark",  label: "GitHub Dark",    swatch: "#24292e" },
  { key: "dracula",      label: "Dracula",        swatch: "#282a36" },
  { key: "nord",         label: "Nord",           swatch: "#2e3440" },
  { key: "solarized",    label: "Solarized Dark", swatch: "#002b36" },
  { key: "monokai",      label: "Monokai",        swatch: "#272822" },
];

const STORAGE_KEY = "mteke-code-theme";
const VALID = new Set<CodeTheme>(options.map((o) => o.key));

export function CodeThemePicker() {
  const [theme, setThemeState] = useState<CodeTheme>("auto");
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && VALID.has(saved as CodeTheme)) {
      setThemeState(saved as CodeTheme);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function setTheme(key: CodeTheme) {
    setThemeState(key);
    if (key === "auto") {
      document.documentElement.removeAttribute("data-code-theme");
      localStorage.removeItem(STORAGE_KEY);
    } else {
      document.documentElement.setAttribute("data-code-theme", key);
      localStorage.setItem(STORAGE_KEY, key);
    }
    setOpen(false);
  }

  const active = mounted ? theme : "auto";
  const activeOption = options.find((o) => o.key === active) ?? options[0];

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Code theme — ${activeOption.label}`}
        title={`Code theme — ${activeOption.label}`}
        className="size-8 inline-flex items-center justify-center rounded-full border border-border/70 bg-bg-elev text-fg-muted hover:text-fg hover:border-accent transition"
      >
        <Code2 className="size-4" />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Code theme options"
          className="absolute right-0 top-10 z-50 min-w-48 rounded-lg border border-border/70 bg-bg-elev p-1 shadow-lg shadow-black/10"
        >
          {options.map(({ key, label, swatch }) => {
            const isActive = active === key;
            return (
              <button
                key={key}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => setTheme(key)}
                className={[
                  "w-full text-left text-sm px-2.5 py-1.5 rounded-md flex items-center gap-2.5 transition",
                  isActive ? "bg-bg text-fg" : "text-fg-muted hover:bg-bg hover:text-fg",
                ].join(" ")}
              >
                <span
                  aria-hidden
                  className="size-4 shrink-0 rounded-md border border-border/70"
                  style={{ background: swatch }}
                />
                <span className="flex-1">{label}</span>
                {isActive && <Check className="size-3.5 text-accent" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
