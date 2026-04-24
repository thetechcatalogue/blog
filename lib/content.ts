import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

export interface DocMeta {
  slug: string[];
  title: string;
  description?: string;
  sidebar_position?: number;
  tags?: string[];
}

export interface DocPage {
  meta: DocMeta;
  content: string;
}

/**
 * Recursively get all .md / .mdx files under a content subdirectory.
 */
function getFilesRecursive(dir: string, base: string = ""): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
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
    const raw = fs.readFileSync(fullPath, "utf-8");
    const { data } = matter(raw);

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
    if (fs.existsSync(fullPath)) {
      const raw = fs.readFileSync(fullPath, "utf-8");
      const { data, content } = matter(raw);

      return {
        meta: {
          slug,
          title: data.title || slugToTitle(slug[slug.length - 1]),
          description: data.description,
          sidebar_position: data.sidebar_position,
          tags: data.tags,
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
