import Link from "next/link";
import { getAllContent } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | TechCatalogue",
  description: "Articles on networking, cloud, system design, and more.",
};

export default function BlogIndex() {
  const posts = getAllContent("blog").sort(
    (a, b) => (b.sidebar_position ?? 0) - (a.sidebar_position ?? 0)
  );

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">Blog</h1>
      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.slug.join("/")} className="group">
            <Link href={`/blog/${post.slug.join("/")}`}>
              <h2 className="text-xl font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                {post.title}
              </h2>
              {post.description && (
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  {post.description}
                </p>
              )}
              {post.tags && (
                <div className="mt-2 flex gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
