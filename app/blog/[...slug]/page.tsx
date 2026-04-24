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
  const posts = getAllContent("blog");
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getContentBySlug("blog", slug);
  if (!post) return {};
  return {
    title: `${post.meta.title} | TechCatalogue`,
    description: post.meta.description,
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = getContentBySlug("blog", slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <article className="prose prose-gray max-w-none dark:prose-invert">
        <h1>{post.meta.title}</h1>
        {post.meta.tags && (
          <div className="not-prose mb-8 flex gap-2">
            {post.meta.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                style={{ backgroundColor: "var(--tag-bg)", color: "var(--tag-text)" }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <MDXRemote
          source={post.content}
          components={{ pre: Pre }}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeSlug],
            },
          }}
        />
      </article>
    </div>
  );
}
