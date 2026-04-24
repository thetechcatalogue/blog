"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme, themes, type ThemeName } from "./ThemeProvider";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const current = themes.find((t) => t.name === theme)!;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg border border-[var(--border-color)] px-2.5 py-1.5 text-sm font-medium transition-all hover:shadow-sm"
        style={{ color: "var(--text-secondary)" }}
        aria-label="Change theme"
        aria-expanded={open}
      >
        <span
          className="h-4 w-4 rounded-full ring-1 ring-black/10"
          style={{ backgroundColor: current.preview[1] }}
        />
        <svg
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-52 origin-top-right animate-in rounded-xl border border-[var(--border-color)] p-1.5 shadow-xl backdrop-blur-xl"
          style={{ backgroundColor: "var(--bg)" }}
        >
          {themes.map((t) => (
            <button
              key={t.name}
              onClick={() => {
                setTheme(t.name);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${
                theme === t.name
                  ? "font-semibold"
                  : "opacity-75 hover:opacity-100"
              }`}
              style={{
                color: theme === t.name ? "var(--accent-hex)" : "var(--text-primary)",
                backgroundColor: theme === t.name ? "var(--accent-light)" : "transparent",
              }}
            >
              {/* Color preview circles */}
              <div className="flex -space-x-1">
                {t.preview.map((color, i) => (
                  <span
                    key={i}
                    className="h-5 w-5 rounded-full ring-2 ring-white/20"
                    style={{
                      backgroundColor: color,
                      zIndex: 3 - i,
                    }}
                  />
                ))}
              </div>

              <span className="flex-1 text-left">{t.label}</span>

              {theme === t.name && (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
