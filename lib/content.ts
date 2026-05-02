import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(
  /*turbopackIgnore: true*/ process.cwd(),
  "content"
);

export interface DocMeta {
  slug: string[];
  title: string;
  description?: string;
  sidebar_position?: number;
  tags?: string[];
  readingTime?: number; // minutes
}

export interface DocPage {
  meta: DocMeta;
  content: string;
}

/** Estimate reading time in minutes (200 wpm average) */
function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Recursively get all .md / .mdx files under a content subdirectory.
 */
function getFilesRecursive(dir: string, base: string = ""): string[] {
  if (!/*turbopackIgnore: true*/ fs.existsSync(dir)) return [];
  const entries = /*turbopackIgnore: true*/ fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

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

/**
 * Get metadata for all docs in a section (e.g. "docs", "blog").
 */
export function getAllContent(section: string): DocMeta[] {
  const sectionDir = path.join(CONTENT_DIR, section);
  const files = getFilesRecursive(sectionDir);

  return files.map((file) => {
    const fullPath = path.join(sectionDir, file);
    const raw = /*turbopackIgnore: true*/ fs.readFileSync(fullPath, "utf-8");
    const { data, content } = matter(raw);

    // Convert file path to slug segments: "system-design/intro.md" → ["system-design", "intro"]
    const slug = file
      .replace(/\.(md|mdx)$/, "")
      .split(path.sep);

    return {
      slug,
      title: data.title || slugToTitle(slug[slug.length - 1]),
      description: data.description,
      sidebar_position: data.sidebar_position,
      tags: data.tags,
      readingTime: estimateReadingTime(content),
    };
  });
}

/**
 * Get a single doc's content and metadata by slug segments.
 */
export function getContentBySlug(section: string, slug: string[]): DocPage | null {
  const sectionDir = path.join(CONTENT_DIR, section);

  // Try exact file match, then index file in directory
  const candidates = [
    path.join(sectionDir, ...slug) + ".mdx",
    path.join(sectionDir, ...slug) + ".md",
    path.join(sectionDir, ...slug, "index.mdx"),
    path.join(sectionDir, ...slug, "index.md"),
  ];

  for (const fullPath of candidates) {
    if (/*turbopackIgnore: true*/ fs.existsSync(fullPath)) {
      const raw = /*turbopackIgnore: true*/ fs.readFileSync(fullPath, "utf-8");
      const { data, content } = matter(raw);

      return {
        meta: {
          slug,
          title: data.title || slugToTitle(slug[slug.length - 1]),
          description: data.description,
          sidebar_position: data.sidebar_position,
          tags: data.tags,
          readingTime: estimateReadingTime(content),
        },
        content,
      };
    }
  }
  return null;
}

/**
 * Build a sidebar tree from doc metadata.
 */
export interface SidebarItem {
  title: string;
  href: string;
  position: number;
  children?: SidebarItem[];
}

export function buildSidebar(section: string): SidebarItem[] {
  const docs = getAllContent(section);

  const tree: Record<string, SidebarItem> = {};

  for (const doc of docs) {
    if (doc.slug.length === 1) {
      // Top-level doc
      const key = doc.slug[0];
      tree[key] = {
        title: doc.title,
        href: `/${section}/${doc.slug.join("/")}`,
        position: doc.sidebar_position ?? 99,
      };
    } else {
      // Nested doc — group under first segment
      const groupKey = doc.slug[0];
      if (!tree[groupKey]) {
        tree[groupKey] = {
          title: slugToTitle(groupKey),
          href: `/${section}/${groupKey}`,
          position: 99,
          children: [],
        };
      }
      if (!tree[groupKey].children) {
        tree[groupKey].children = [];
      }
      tree[groupKey].children!.push({
        title: doc.title,
        href: `/${section}/${doc.slug.join("/")}`,
        position: doc.sidebar_position ?? 99,
      });
    }
  }

  // Sort everything by position
  const items = Object.values(tree).sort((a, b) => a.position - b.position);
  for (const item of items) {
    if (item.children) {
      item.children.sort((a, b) => a.position - b.position);
    }
  }
  return items;
}

function slugToTitle(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Get all unique tags across a section (or all sections).
 */
export function getAllTags(section?: string): { tag: string; count: number }[] {
  const sections = section ? [section] : ["docs", "blog"];
  const tagMap: Record<string, number> = {};

  for (const sec of sections) {
    for (const item of getAllContent(sec)) {
      for (const tag of item.tags ?? []) {
        tagMap[tag] = (tagMap[tag] || 0) + 1;
      }
    }
  }

  return Object.entries(tagMap)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get all content items matching a specific tag.
 */
export function getContentByTag(tag: string): { section: string; meta: DocMeta }[] {
  const results: { section: string; meta: DocMeta }[] = [];

  for (const section of ["docs", "blog"]) {
    for (const item of getAllContent(section)) {
      if (item.tags?.includes(tag)) {
        results.push({ section, meta: item });
      }
    }
  }

  return results;
}

/**
 * Get related content based on shared tags (excluding the current item).
 */
export function getRelatedContent(
  section: string,
  slug: string[],
  tags: string[],
  limit: number = 4
): { section: string; meta: DocMeta }[] {
  const currentKey = `${section}/${slug.join("/")}`;
  const scored: { key: string; section: string; meta: DocMeta; score: number }[] = [];

  for (const sec of ["docs", "blog"]) {
    for (const item of getAllContent(sec)) {
      const itemKey = `${sec}/${item.slug.join("/")}`;
      if (itemKey === currentKey) continue;

      const shared = (item.tags ?? []).filter((t) => tags.includes(t)).length;
      if (shared > 0) {
        scored.push({ key: itemKey, section: sec, meta: item, score: shared });
      }
    }
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ section, meta }) => ({ section, meta }));
}
