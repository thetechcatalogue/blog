import { getAllContent, getContentBySlug, getRelatedContent } from "@/lib/content";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Pre, Diagram } from "@/components/MdxComponents";
import ReadingProgress from "@/components/ReadingProgress";
import BookmarkButton from "@/components/BookmarkButton";
import RelatedContent from "@/components/RelatedContent";

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
  const ogImage = `/og/docs/${slug.join("/")}.png`;
  const canonical = `https://thetechcatalogue.github.io/docs/${slug.join("/")}`;
  return {
    title: `${doc.meta.title} | TechCatalogue`,
    description: doc.meta.description,
    alternates: { canonical },
    openGraph: {
      title: doc.meta.title,
      description: doc.meta.description,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: doc.meta.title,
      description: doc.meta.description,
      images: [ogImage],
    },
  };
}

export default async function DocPage({ params }: Props) {
  const { slug } = await params;
  const doc = getContentBySlug("docs", slug);

  if (!doc) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: doc.meta.title,
    description: doc.meta.description,
    author: { "@type": "Person", name: "Ashish Kumar" },
    publisher: { "@type": "Organization", name: "TechCatalogue" },
    keywords: doc.meta.tags?.join(", "),
    url: `https://thetechcatalogue.github.io/docs/${slug.join("/")}`,
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReadingProgress />
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="mr-auto text-3xl font-bold">{doc.meta.title}</h1>
        {doc.meta.readingTime && (
          <span
            className="inline-flex items-center gap-1 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {doc.meta.readingTime} min read
          </span>
        )}
        <BookmarkButton slug={`docs/${slug.join("/")}`} title={doc.meta.title} />
      </div>
      {doc.meta.description && (
        <p className="mb-8 text-lg" style={{ color: "var(--text-secondary)" }}>
          {doc.meta.description}
        </p>
      )}
      <MDXRemote
        source={doc.content}
        components={{ pre: Pre, Diagram }}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug],
          },
        }}
      />
      <RelatedContent items={getRelatedContent("docs", slug, doc.meta.tags ?? [])} />
    </div>
  );
}
