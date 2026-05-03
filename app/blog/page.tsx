import Link from "next/link";
import { getAllContent } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | TechCatalogue",
  description: "Articles on networking, cloud, system design, and more.",
};

export default function BlogIndex() {
  const posts = getAllContent("blog").sort(
    (a, b) => {
      // Sort by date descending, then by sidebar_position
      if (a.date && b.date) return new Date(b.date).getTime() - new Date(a.date).getTime();
      return (b.sidebar_position ?? 0) - (a.sidebar_position ?? 0);
    }
  );

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Blog</h1>
      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.slug.join("/")} className="group">
            <Link href={`/blog/${post.slug.join("/")}`} className="block">
              <h2 className="text-xl font-semibold transition-colors group-hover:text-accent" style={{ color: "var(--text-primary)" }}>
                {post.title}
              </h2>
              <div className="mt-1 flex items-center gap-3">
                {post.date && (
                  <time
                    dateTime={new Date(post.date).toISOString().split("T")[0]}
                    className="text-xs"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                )}
                {post.readingTime && (
                  <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    {post.readingTime} min read
                  </span>
                )}
                {post.description && (
                  <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    {post.description}
                  </span>
                )}
              </div>
            </Link>
            {post.tags && (
              <div className="mt-2 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${tag}`}
                    className="rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors hover:opacity-80"
                    style={{ backgroundColor: "var(--tag-bg)", color: "var(--tag-text)" }}
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
