"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

export type ThemeName =
  | "light"
  | "dark"
  | "ocean"
  | "sunset"
  | "forest"
  | "rose"
  | "midnight";

export interface ThemeConfig {
  name: ThemeName;
  label: string;
  isDark: boolean;
  preview: [string, string, string]; // [background, accent, text]
}

export const themes: ThemeConfig[] = [
  { name: "light", label: "Light", isDark: false, preview: ["#ffffff", "#3b82f6", "#0f172a"] },
  { name: "dark", label: "Dark", isDark: true, preview: ["#0f172a", "#60a5fa", "#e2e8f0"] },
  { name: "ocean", label: "Ocean", isDark: true, preview: ["#0c1222", "#22d3ee", "#c7d2fe"] },
  { name: "sunset", label: "Sunset", isDark: false, preview: ["#fffbeb", "#f59e0b", "#451a03"] },
  { name: "forest", label: "Forest", isDark: true, preview: ["#052e16", "#34d399", "#d1fae5"] },
  { name: "rose", label: "Rose", isDark: false, preview: ["#fff1f2", "#f43f5e", "#1c1917"] },
  { name: "midnight", label: "Midnight", isDark: true, preview: ["#09090b", "#a78bfa", "#e4e4e7"] },
];

const DARK_THEMES: ThemeName[] = ["dark", "ocean", "forest", "midnight"];

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme") as ThemeName | null;
    if (stored && themes.some((t) => t.name === stored)) {
      setThemeState(stored);
    }
    setMounted(true);
  }, []);

  const setTheme = useCallback((newTheme: ThemeName) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);

    const html = document.documentElement;
    html.setAttribute("data-theme", newTheme);

    if (DARK_THEMES.includes(newTheme)) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, []);

  // Sync on mount (the inline script already set the attribute before paint)
  useEffect(() => {
    if (mounted) {
      const html = document.documentElement;
      html.setAttribute("data-theme", theme);
      if (DARK_THEMES.includes(theme)) {
        html.classList.add("dark");
      } else {
        html.classList.remove("dark");
      }
    }
  }, [theme, mounted]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/** Inline script to prevent flash of wrong theme. Inject into <head>. */
export const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('theme') || 'light';
    var valid = ['light','dark','ocean','sunset','forest','rose','midnight'];
    if (valid.indexOf(t) === -1) t = 'light';
    document.documentElement.setAttribute('data-theme', t);
    var dark = ['dark','ocean','forest','midnight'];
    if (dark.indexOf(t) !== -1) document.documentElement.classList.add('dark');
  } catch(e){}
})();
`;
