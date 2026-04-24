"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  // Extract headings from the page
  useEffect(() => {
    const article = document.querySelector("article") || document.querySelector("main");
    if (!article) return;

    const elements = article.querySelectorAll("h2, h3");
    const items: TocItem[] = Array.from(elements)
      .filter((el) => el.id)
      .map((el) => ({
        id: el.id,
        text: el.textContent || "",
        level: parseInt(el.tagName[1]),
      }));

    setHeadings(items);
  }, []);

  // Track active heading via IntersectionObserver
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first visible heading
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-80px 0px -70% 0px",
        threshold: 0,
      }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 3) return null; // Don't show for short pages

  return (
    <nav
      className="sticky top-20 hidden max-h-[calc(100vh-6rem)] w-56 shrink-0 overflow-y-auto xl:block"
      aria-label="Table of contents"
    >
      <h4
        className="mb-3 text-xs font-semibold uppercase tracking-wider"
        style={{ color: "var(--text-secondary)" }}
      >
        On this page
      </h4>
      <ul className="space-y-1 border-l" style={{ borderColor: "var(--border-color)" }}>
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(heading.id);
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                  setActiveId(heading.id);
                }
              }}
              className="block py-1 text-[13px] leading-snug transition-colors"
              style={{
                paddingLeft: heading.level === 3 ? "1.25rem" : "0.75rem",
                color: activeId === heading.id ? "var(--accent-hex)" : "var(--text-secondary)",
                borderLeft: activeId === heading.id ? "2px solid var(--accent-hex)" : "2px solid transparent",
                marginLeft: "-1px",
                fontWeight: activeId === heading.id ? 500 : 400,
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
