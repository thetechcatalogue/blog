"use client";

import { useState, useEffect, useCallback } from "react";

interface BookmarkButtonProps {
  slug: string;
  title: string;
}

export default function BookmarkButton({ slug, title }: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const bookmarks: string[] = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    setBookmarked(bookmarks.includes(slug));
  }, [slug]);

  const toggle = useCallback(() => {
    const bookmarks: string[] = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    let next: string[];
    if (bookmarks.includes(slug)) {
      next = bookmarks.filter((b) => b !== slug);
    } else {
      next = [...bookmarks, slug];
    }
    localStorage.setItem("bookmarks", JSON.stringify(next));
    setBookmarked(next.includes(slug));
  }, [slug]);

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all hover:shadow-sm"
      style={{
        borderColor: bookmarked ? "var(--accent-hex)" : "var(--border-color)",
        color: bookmarked ? "var(--accent-hex)" : "var(--text-secondary)",
        backgroundColor: bookmarked ? "var(--accent-light)" : "transparent",
      }}
      aria-label={bookmarked ? "Remove bookmark" : "Bookmark this page"}
    >
      {bookmarked ? (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M5 2h14a1 1 0 011 1v19.143a.5.5 0 01-.766.424L12 18.03l-7.234 4.536A.5.5 0 014 22.143V3a1 1 0 011-1z" />
        </svg>
      ) : (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      )}
      {bookmarked ? "Bookmarked" : "Bookmark"}
    </button>
  );
}
