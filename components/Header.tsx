import Link from "next/link";
import ThemeSwitcher from "./ThemeSwitcher";
import Search from "./Search";

const leftNav = [
  { label: "Docs", href: "/docs" },
  { label: "Blog", href: "/blog" },
];

const rightNav = [
  { label: "GitHub", href: "https://github.com/thetechcatalogue", external: true },
];

export default function Header() {
  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-sm"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--header-bg)",
      }}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-8">
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
              className="text-sm font-medium transition-colors hover:opacity-100"
              style={{ color: "var(--text-secondary)" }}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
