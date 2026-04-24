"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: string;
  url: string;
  meta: { title?: string };
  excerpt: string;
}

export default function Search() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [pagefind, setPagefind] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Load pagefind on first open
  useEffect(() => {
    if (!open) return;
    if (pagefind) {
      inputRef.current?.focus();
      return;
    }
    (async () => {
      try {
        const pf = await import(
          // @ts-ignore – pagefind is generated at build time
          /* webpackIgnore: true */ "/pagefind/pagefind.js"
        );
        await pf.init();
        setPagefind(pf);
        inputRef.current?.focus();
      } catch {
        // Pagefind not available (dev mode)
      }
    })();
  }, [open, pagefind]);

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const doSearch = useCallback(
    async (q: string) => {
      setQuery(q);
      if (!pagefind || q.length < 2) {
        setResults([]);
        return;
      }
      const search = await pagefind.search(q);
      const data = await Promise.all(
        search.results.slice(0, 8).map((r: any) => r.data())
      );
      setResults(data);
    },
    [pagefind]
  );

  const navigate = useCallback(
    (url: string) => {
      setOpen(false);
      setQuery("");
      setResults([]);
      router.push(url);
    },
    [router]
  );

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-all hover:shadow-sm"
        style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
        aria-label="Search"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="hidden sm:inline">Search</span>
        <kbd
          className="ml-1 hidden rounded border px-1.5 py-0.5 text-[10px] font-medium sm:inline-block"
          style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
        >
          ⌘K
        </kbd>
      </button>

      {/* Modal overlay */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 pt-[15vh] backdrop-blur-sm">
          <div
            ref={dialogRef}
            className="animate-in w-full max-w-xl rounded-2xl border shadow-2xl"
            style={{
              backgroundColor: "var(--bg)",
              borderColor: "var(--border-color)",
            }}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 border-b px-4 py-3" style={{ borderColor: "var(--border-color)" }}>
              <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "var(--text-secondary)" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => doSearch(e.target.value)}
                placeholder="Search docs and posts..."
                className="flex-1 bg-transparent text-base outline-none placeholder:text-[var(--text-secondary)]"
                style={{ color: "var(--text-primary)" }}
              />
              <kbd
                className="rounded border px-2 py-0.5 text-xs font-medium"
                style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
              >
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[50vh] overflow-y-auto p-2">
              {query.length > 0 && results.length === 0 && pagefind && (
                <p className="px-4 py-8 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
                  No results for &ldquo;{query}&rdquo;
                </p>
              )}
              {query.length > 0 && !pagefind && (
                <p className="px-4 py-8 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
                  Search is available after build. Run <code>pnpm build</code> first.
                </p>
              )}
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => navigate(result.url)}
                  className="w-full rounded-lg px-4 py-3 text-left transition-colors hover:bg-[var(--bg-secondary)]"
                >
                  <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    {result.meta.title || result.url}
                  </div>
                  <div
                    className="mt-1 line-clamp-2 text-xs"
                    style={{ color: "var(--text-secondary)" }}
                    dangerouslySetInnerHTML={{ __html: result.excerpt }}
                  />
                </button>
              ))}
              {query.length === 0 && (
                <p className="px-4 py-8 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
                  Type to search across all docs and blog posts
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
