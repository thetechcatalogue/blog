"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeSwitcher from "./ThemeSwitcher";
import Search from "./Search";

const leftNav = [
  { label: "Docs", href: "/docs" },
  { label: "Blog", href: "/blog" },
  { label: "Series", href: "/series" },
  { label: "Tags", href: "/tags" },
];

const rightNav = [
  { label: "GitHub", href: "https://github.com/thetechcatalogue", external: true },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-sm"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--header-bg)",
      }}
    >
      <nav className="mx-auto flex max-w-[90rem] items-center justify-between px-6 py-3">
        <div className="flex items-center gap-8">
          {/* Mobile hamburger */}
          <button
            className="sm:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            style={{ color: "var(--text-primary)" }}
          >
            {mobileOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          <Link
            href="/"
            className="text-xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            TechCatalogue
          </Link>
          <div className="hidden gap-6 sm:flex">
            {leftNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium transition-colors hover:opacity-100"
                style={{ color: "var(--text-secondary)" }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Search />
          <ThemeSwitcher />
          {rightNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden text-sm font-medium transition-colors hover:opacity-100 sm:inline"
              style={{ color: "var(--text-secondary)" }}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div
          className="animate-in border-t px-6 pb-4 pt-2 sm:hidden"
          style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg)" }}
        >
          <div className="flex flex-col gap-1">
            {leftNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
                style={{
                  color: pathname.startsWith(item.href) ? "var(--accent-hex)" : "var(--text-primary)",
                  backgroundColor: pathname.startsWith(item.href) ? "var(--accent-light)" : "transparent",
                }}
              >
                {item.label}
              </Link>
            ))}
            {rightNav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg px-3 py-2.5 text-sm font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                {item.label} ↗
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
