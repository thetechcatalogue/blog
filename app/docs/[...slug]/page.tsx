import { getAllContent, getContentBySlug } from "@/lib/content";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Pre } from "@/components/MdxComponents";

interface Props {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  const docs = getAllContent("docs");
  return docs.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = getContentBySlug("docs", slug);
  if (!doc) return {};
  return {
    title: `${doc.meta.title} | TechCatalogue`,
    description: doc.meta.description,
  };
}

export default async function DocPage({ params }: Props) {
  const { slug } = await params;
  const doc = getContentBySlug("docs", slug);

  if (!doc) {
    notFound();
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
        components={{ pre: Pre }}
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
