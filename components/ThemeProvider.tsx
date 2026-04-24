"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

export type ThemeName =
  | "light"
  | "dark"
  | "sepia"
  | "nord"
  | "sunset"
  | "forest"
  | "rose"
  | "midnight"
  | "sage"
  | "ocean";

export interface ThemeConfig {
  name: ThemeName;
  label: string;
  isDark: boolean;
  preview: [string, string, string]; // [background, accent, text]
}

export const themes: ThemeConfig[] = [
  { name: "light",    label: "Light",    isDark: false, preview: ["#fafaf9", "#3b82f6", "#1c1917"] },
  { name: "dark",     label: "Dark",     isDark: true,  preview: ["#1a1a2e", "#60a5fa", "#e0dfe4"] },
  { name: "sepia",    label: "Sepia",    isDark: false, preview: ["#f4ede4", "#b46c34", "#3e3228"] },
  { name: "nord",     label: "Nord",     isDark: true,  preview: ["#2e3440", "#88c0d0", "#d8dee9"] },
  { name: "sunset",   label: "Sunset",   isDark: false, preview: ["#fdf6f0", "#d97757", "#3d2e22"] },
  { name: "forest",   label: "Forest",   isDark: true,  preview: ["#1a2820", "#6abc84", "#d4ddd5"] },
  { name: "rose",     label: "Rosé",     isDark: false, preview: ["#faf5f5", "#be6478", "#2d2325"] },
  { name: "midnight", label: "Midnight", isDark: true,  preview: ["#151520", "#a78bfa", "#d5d3e0"] },
  { name: "sage",     label: "Sage",     isDark: false, preview: ["#f2f4ef", "#6c8c64", "#2c3028"] },
  { name: "ocean",    label: "Ocean",    isDark: true,  preview: ["#141e2b", "#48bdc4", "#cdd8e0"] },
];

const DARK_THEMES: ThemeName[] = ["dark", "nord", "forest", "midnight", "ocean"];

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
    var valid = ['light','dark','sepia','nord','sunset','forest','rose','midnight','sage','ocean'];
    if (valid.indexOf(t) === -1) t = 'light';
    document.documentElement.setAttribute('data-theme', t);
    var dark = ['dark','nord','forest','midnight','ocean'];
    if (dark.indexOf(t) !== -1) document.documentElement.classList.add('dark');
  } catch(e){}
})();
`;
