import { getContentBySlug } from "@/lib/content";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Docs | TechCatalogue",
  description: "Notes, guides, and reference material for software engineers.",
};

export default async function DocsIndex() {
  const doc = getContentBySlug("docs", ["intro"]);

  if (!doc) {
    return <p>No docs found.</p>;
  }

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">{doc.meta.title}</h1>
      {doc.meta.description && (
        <p className="mb-8 text-lg text-gray-500 dark:text-gray-400">
          {doc.meta.description}
        </p>
      )}
      <MDXRemote
        source={doc.content}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug],
          },
        }}
      />
    </div>
  );
}
