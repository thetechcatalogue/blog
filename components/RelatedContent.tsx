import Link from "next/link";
import type { DocMeta } from "@/lib/content";

interface RelatedItem {
  section: string;
  meta: DocMeta;
}

export default function RelatedContent({ items }: { items: RelatedItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="not-prose mt-16 border-t pt-8" style={{ borderColor: "var(--border-color)" }}>
      <h2 className="mb-4 text-lg font-bold" style={{ color: "var(--text-primary)" }}>
        Related Content
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map(({ section, meta }) => (
          <Link
            key={`${section}/${meta.slug.join("/")}`}
            href={`/${section}/${meta.slug.join("/")}`}
            className="rounded-lg border p-4 transition-colors hover:opacity-90"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--card-bg)",
            }}
          >
            <span
              className="mb-1.5 inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase"
              style={{ backgroundColor: "var(--accent-light)", color: "var(--accent-hex)" }}
            >
              {section}
            </span>
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              {meta.title}
            </h3>
            {meta.description && (
              <p
                className="mt-1 line-clamp-2 text-xs"
                style={{ color: "var(--text-secondary)" }}
              >
                {meta.description}
              </p>
            )}
            {meta.readingTime && (
              <span className="mt-2 inline-block text-xs" style={{ color: "var(--text-secondary)" }}>
                {meta.readingTime} min read
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
