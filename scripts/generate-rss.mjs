/**
 * Build-time RSS feed generator.
 * Generates RSS 2.0 and Atom feeds from blog content.
 * Run: node scripts/generate-rss.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content", "blog");
const OUT_DIR = path.join(ROOT, "public");

const SITE_URL = "https://thetechcatalogue.github.io";
const SITE_TITLE = "TechCatalogue";
const SITE_DESCRIPTION =
  "Notes, guides, and reference material covering system design, interviews, AI/ML, and software engineering.";

function getFilesRecursive(dir, base = "") {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const rel = path.join(base, entry.name);
    if (entry.isDirectory()) {
      files.push(...getFilesRecursive(path.join(dir, entry.name), rel));
    } else if (/\.(md|mdx)$/.test(entry.name)) {
      files.push(rel);
    }
  }
  return files;
}

function escapeXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function getAllPosts() {
  const files = getFilesRecursive(CONTENT_DIR);
  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
      const { data, content } = matter(raw);
      const slug = file.replace(/\.(md|mdx)$/, "");

      // Try to extract date from filename (2024-05-28-...)
      const dateMatch = slug.match(/^(\d{4}[-.]?\d{2}[-.]?\d{2})/);
      const date = dateMatch
        ? new Date(dateMatch[1].replace(/\./g, "-"))
        : new Date("2024-01-01");

      return {
        title: data.title || slug,
        description: data.description || "",
        slug,
        url: `${SITE_URL}/blog/${slug}`,
        date,
        tags: data.tags || [],
        // Take first 500 chars as excerpt
        excerpt: content.replace(/[#*`\[\]]/g, "").slice(0, 500).trim(),
      };
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

function generateRSS(posts) {
  const now = new Date().toUTCString();
  const items = posts
    .map(
      (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${post.url}</link>
      <guid>${post.url}</guid>
      <pubDate>${post.date.toUTCString()}</pubDate>
      <description>${escapeXml(post.description || post.excerpt)}</description>
      ${post.tags.map((t) => `<category>${escapeXml(t)}</category>`).join("\n      ")}
    </item>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;
}

function generateAtom(posts) {
  const now = new Date().toISOString();
  const entries = posts
    .map(
      (post) => `  <entry>
    <title>${escapeXml(post.title)}</title>
    <link href="${post.url}"/>
    <id>${post.url}</id>
    <updated>${post.date.toISOString()}</updated>
    <summary>${escapeXml(post.description || post.excerpt)}</summary>
    ${post.tags.map((t) => `<category term="${escapeXml(t)}"/>`).join("\n    ")}
  </entry>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(SITE_TITLE)}</title>
  <link href="${SITE_URL}"/>
  <link href="${SITE_URL}/atom.xml" rel="self"/>
  <id>${SITE_URL}/</id>
  <updated>${now}</updated>
  <subtitle>${escapeXml(SITE_DESCRIPTION)}</subtitle>
${entries}
</feed>`;
}

function main() {
  console.log("📡 Generating RSS feeds...");
  const posts = getAllPosts();

  fs.writeFileSync(path.join(OUT_DIR, "rss.xml"), generateRSS(posts));
  fs.writeFileSync(path.join(OUT_DIR, "atom.xml"), generateAtom(posts));

  console.log(`✅ Generated RSS (${posts.length} posts) → public/rss.xml & public/atom.xml`);
}

main();
