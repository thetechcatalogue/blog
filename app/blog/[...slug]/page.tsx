import { getAllContent, getContentBySlug, getRelatedContent } from "@/lib/content";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Pre, Diagram } from "@/components/MdxComponents";
import ReadingProgress from "@/components/ReadingProgress";
import BookmarkButton from "@/components/BookmarkButton";
import TableOfContents from "@/components/TableOfContents";
import RelatedContent from "@/components/RelatedContent";

interface Props {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  const posts = getAllContent("blog");
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getContentBySlug("blog", slug);
  if (!post) return {};
  const ogImage = `/og/blog/${slug.join("/")}.png`;
  return {
    title: `${post.meta.title} | TechCatalogue`,
    description: post.meta.description,
    openGraph: {
      title: post.meta.title,
      description: post.meta.description,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.meta.title,
      description: post.meta.description,
      images: [ogImage],
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = getContentBySlug("blog", slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.meta.title,
    description: post.meta.description,
    image: `https://thetechcatalogue.github.io/og/blog/${slug.join("/")}.png`,
    author: { "@type": "Person", name: "Ashish Kumar" },
    publisher: { "@type": "Organization", name: "TechCatalogue" },
    keywords: post.meta.tags?.join(", "),
    url: `https://thetechcatalogue.github.io/blog/${slug.join("/")}`,
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReadingProgress />
      <div className="flex gap-8">
        <article className="prose prose-gray max-w-none flex-1 dark:prose-invert">
        <h1>{post.meta.title}</h1>
        <div className="not-prose mb-8 flex flex-wrap items-center gap-3">
          {post.meta.readingTime && (
            <span
              className="inline-flex items-center gap-1 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {post.meta.readingTime} min read
            </span>
          )}
          <BookmarkButton slug={`blog/${slug.join("/")}`} title={post.meta.title} />
          {post.meta.tags && (
            <div className="flex flex-wrap gap-2">
              {post.meta.tags.map((tag) => (
                <a
                  key={tag}
                  href={`/tags/${tag}`}
                  className="rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors hover:opacity-80"
                  style={{ backgroundColor: "var(--tag-bg)", color: "var(--tag-text)" }}
                >
                  {tag}
                </a>
              ))}
            </div>
          )}
        </div>
        <MDXRemote
          source={post.content}
          components={{ pre: Pre, Diagram }}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeSlug],
            },
          }}
        />
        <RelatedContent items={getRelatedContent("blog", slug, post.meta.tags ?? [])} />
      </article>
      <TableOfContents />
      </div>
    </div>
  );
}
