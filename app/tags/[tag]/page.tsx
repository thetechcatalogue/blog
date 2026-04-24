import Link from "next/link";
import { getAllTags, getContentByTag } from "@/lib/content";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map(({ tag }) => ({ tag }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `${tag} | Tags | TechCatalogue`,
    description: `All docs and posts tagged with "${tag}".`,
  };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const items = getContentByTag(tag);

  if (items.length === 0) {
    notFound();
  }

  const docs = items.filter((i) => i.section === "docs");
  const posts = items.filter((i) => i.section === "blog");

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/tags"
        className="mb-4 inline-flex items-center gap-1 text-sm transition-colors hover:opacity-80"
        style={{ color: "var(--accent-hex)" }}
      >
        ← All tags
      </Link>
      <h1 className="mb-8 text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
        <span
          className="mr-3 rounded-full px-3 py-1 text-lg"
          style={{ backgroundColor: "var(--accent-light)", color: "var(--accent-hex)" }}
        >
          #
        </span>
        {tag}
      </h1>

      {docs.length > 0 && (
        <section className="mb-10">
          <h2
            className="mb-4 text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--text-secondary)" }}
          >
            Docs ({docs.length})
          </h2>
          <div className="space-y-3">
            {docs.map(({ meta }) => (
              <Link
                key={meta.slug.join("/")}
                href={`/docs/${meta.slug.join("/")}`}
                className="block rounded-lg border p-4 transition-colors hover:opacity-90"
                style={{
                  borderColor: "var(--border-color)",
                  backgroundColor: "var(--card-bg)",
                }}
              >
                <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>
                  {meta.title}
                </h3>
                {meta.description && (
                  <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                    {meta.description}
                  </p>
                )}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {meta.tags?.map((t) => (
                    <span
                      key={t}
                      className="rounded-full px-2 py-0.5 text-xs font-medium"
                      style={{
                        backgroundColor: t === tag ? "var(--accent-light)" : "var(--tag-bg)",
                        color: t === tag ? "var(--accent-hex)" : "var(--tag-text)",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {posts.length > 0 && (
        <section>
          <h2
            className="mb-4 text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--text-secondary)" }}
          >
            Blog ({posts.length})
          </h2>
          <div className="space-y-3">
            {posts.map(({ meta }) => (
              <Link
                key={meta.slug.join("/")}
                href={`/blog/${meta.slug.join("/")}`}
                className="block rounded-lg border p-4 transition-colors hover:opacity-90"
                style={{
                  borderColor: "var(--border-color)",
                  backgroundColor: "var(--card-bg)",
                }}
              >
                <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>
                  {meta.title}
                </h3>
                {meta.description && (
                  <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                    {meta.description}
                  </p>
                )}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {meta.tags?.map((t) => (
                    <span
                      key={t}
                      className="rounded-full px-2 py-0.5 text-xs font-medium"
                      style={{
                        backgroundColor: t === tag ? "var(--accent-light)" : "var(--tag-bg)",
                        color: t === tag ? "var(--accent-hex)" : "var(--tag-text)",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
