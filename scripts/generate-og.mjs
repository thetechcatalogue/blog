/**
 * Build-time OG image generator.
 * Reads all content, generates a 1200×630 PNG for each page.
 * Run: node scripts/generate-og.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content");
const OUT_DIR = path.join(ROOT, "public", "og");

// ── Collect all content files ──

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

function getAllPages() {
  const pages = [];
  for (const section of ["docs", "blog"]) {
    const sectionDir = path.join(CONTENT_DIR, section);
    for (const file of getFilesRecursive(sectionDir)) {
      const raw = fs.readFileSync(path.join(sectionDir, file), "utf-8");
      const { data } = matter(raw);
      const slug = file.replace(/\.(md|mdx)$/, "").split(path.sep);
      pages.push({
        section,
        slug,
        title: data.title || slug[slug.length - 1],
        description: data.description || "",
        tags: data.tags || [],
      });
    }
  }
  return pages;
}

// ── Load a font for satori ──

async function loadFont() {
  return fs.readFileSync(path.join(__dirname, "fonts", "Inter-Regular.ttf"));
}

async function loadFontBold() {
  return fs.readFileSync(path.join(__dirname, "fonts", "Inter-Bold.ttf"));
}

// ── Generate OG image ──

async function generateOgImage(page, fontRegular, fontBold) {
  const tag = page.section === "blog" ? "BLOG" : "DOCS";
  const tagColor = page.section === "blog" ? "#f59e0b" : "#3b82f6";

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 70px",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          fontFamily: "Inter",
        },
        children: [
          // Top section
          {
            type: "div",
            props: {
              style: { display: "flex", flexDirection: "column", gap: "20px" },
              children: [
                // Tag badge
                {
                  type: "div",
                  props: {
                    style: { display: "flex" },
                    children: [
                      {
                        type: "div",
                        props: {
                          style: {
                            backgroundColor: tagColor,
                            color: "#ffffff",
                            padding: "6px 16px",
                            borderRadius: "20px",
                            fontSize: "16px",
                            fontWeight: 700,
                            letterSpacing: "2px",
                          },
                          children: tag,
                        },
                      },
                    ],
                  },
                },
                // Title
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: page.title.length > 40 ? "42px" : "52px",
                      fontWeight: 700,
                      color: "#f1f5f9",
                      lineHeight: 1.2,
                      maxHeight: "200px",
                      overflow: "hidden",
                    },
                    children: page.title,
                  },
                },
                // Description
                page.description
                  ? {
                      type: "div",
                      props: {
                        style: {
                          fontSize: "22px",
                          color: "#94a3b8",
                          lineHeight: 1.5,
                          maxHeight: "70px",
                          overflow: "hidden",
                        },
                        children: page.description,
                      },
                    }
                  : null,
              ].filter(Boolean),
            },
          },
          // Bottom bar
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: "28px",
                      fontWeight: 700,
                      color: "#60a5fa",
                    },
                    children: "TechCatalogue",
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      gap: "10px",
                    },
                    children: page.tags.slice(0, 3).map((t) => ({
                      type: "div",
                      props: {
                        style: {
                          backgroundColor: "rgba(148, 163, 184, 0.15)",
                          color: "#94a3b8",
                          padding: "4px 14px",
                          borderRadius: "14px",
                          fontSize: "16px",
                        },
                        children: t,
                      },
                    })),
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Inter", data: fontRegular, weight: 400, style: "normal" },
        { name: "Inter", data: fontBold, weight: 700, style: "normal" },
      ],
    }
  );

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 1200 },
  });
  return resvg.render().asPng();
}

// ── Main ──

async function main() {
  console.log("🖼️  Generating OG images...");
  const pages = getAllPages();
  const [fontRegular, fontBold] = await Promise.all([loadFont(), loadFontBold()]);

  // Also generate a default site-wide OG image
  const allPages = [
    {
      section: "site",
      slug: ["default"],
      title: "TechCatalogue",
      description:
        "Notes, guides, and reference material covering system design, interviews, AI/ML, and software engineering.",
      tags: [],
    },
    ...pages,
  ];

  let count = 0;
  for (const page of allPages) {
    const outPath = path.join(OUT_DIR, page.section, ...page.slug) + ".png";
    fs.mkdirSync(path.dirname(outPath), { recursive: true });

    const png = await generateOgImage(page, fontRegular, fontBold);
    fs.writeFileSync(outPath, png);
    count++;
  }

  console.log(`✅ Generated ${count} OG images in public/og/`);
}

main().catch(console.error);
