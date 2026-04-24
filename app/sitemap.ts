import type { MetadataRoute } from "next";
import { getAllContent, getAllTags } from "@/lib/content";

const BASE = "https://thetechcatalogue.github.io";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/docs`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/tags`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
  ];

  // Docs
  const docs = getAllContent("docs").map((doc) => ({
    url: `${BASE}/docs/${doc.slug.join("/")}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Blog posts
  const posts = getAllContent("blog").map((post) => ({
    url: `${BASE}/blog/${post.slug.join("/")}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Tag pages
  const tags = getAllTags().map(({ tag }) => ({
    url: `${BASE}/tags/${tag}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...docs, ...posts, ...tags];
}
