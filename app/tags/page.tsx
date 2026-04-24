import Link from "next/link";
import { getAllTags } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tags | TechCatalogue",
  description: "Browse all topics and tags across docs and blog posts.",
};

export default function TagsIndex() {
  const tags = getAllTags();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-2 text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
        Tags
      </h1>
      <p className="mb-8 text-sm" style={{ color: "var(--text-secondary)" }}>
        Browse all topics across docs and blog posts.
      </p>
      <div className="flex flex-wrap gap-3">
        {tags.map(({ tag, count }) => (
          <Link
            key={tag}
            href={`/tags/${tag}`}
            className="rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:opacity-80"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--card-bg)",
              color: "var(--text-primary)",
            }}
          >
            {tag}
            <span
              className="ml-2 rounded-full px-1.5 py-0.5 text-xs"
              style={{ backgroundColor: "var(--accent-light)", color: "var(--accent-hex)" }}
            >
              {count}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
