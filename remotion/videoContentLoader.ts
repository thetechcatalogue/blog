import { readdir, readFile } from "node:fs/promises";
import { join, basename } from "node:path";
import { parseMarkdownToScenes } from "@/remotion/parseMarkdown";
import type { MarkdownVideoContent } from "@/remotion/videoContentTypes";

type Frontmatter = Record<string, string>;

function parseFrontmatter(raw: string): { content: string; data: Frontmatter } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { content: raw, data: {} };
  }

  const data: Frontmatter = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx <= 0) continue;
    const key = line.slice(0, idx).trim();
    const val = line
      .slice(idx + 1)
      .trim()
      .replace(/^['\"]|['\"]$/g, "");
    data[key] = val;
  }

  return { content: match[2], data };
}

function toTitleCase(input: string): string {
  return input
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizePublicPath(src: string): string {
  return src.startsWith("/") ? src : `/${src}`;
}

function toKebabCase(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Scale scene durations so their total matches the audio duration.
 * Proportions are preserved; the last scene absorbs any rounding remainder.
 */
function scaleScenesToAudio(scenes: import("@/remotion/types").Scene[], audioDurationSec: number, fps = 30) {
  const targetFrames = Math.max(1, Math.round(audioDurationSec * fps));
  const currentTotal = scenes.reduce((s, sc) => s + sc.duration, 0);
  if (currentTotal === 0) return scenes;
  let assigned = 0;
  return scenes.map((sc, i) => {
    if (i === scenes.length - 1) {
      return { ...sc, duration: Math.max(1, targetFrames - assigned) };
    }
    const scaled = Math.max(1, Math.round((sc.duration / currentTotal) * targetFrames));
    assigned += scaled;
    return { ...sc, duration: scaled };
  });
}

function resolveNarrationSrc(
  id: string,
  frontmatterNarrationSrc?: string
): string {
  if (frontmatterNarrationSrc?.trim()) {
    return normalizePublicPath(frontmatterNarrationSrc.trim());
  }

  return `/audio/videos/${toKebabCase(id)}.mp3`;
}

export async function loadMarkdownVideosFromFolder(
  folder = "src/content/videos"
): Promise<MarkdownVideoContent[]> {
  const root = process.cwd();
  const candidateFolders = [folder, "content/videos"];

  let fullFolder: string | null = null;
  let entries: Awaited<ReturnType<typeof readdir>> | null = null;

  for (const candidate of candidateFolders) {
    const candidatePath = join(root, candidate);
    try {
      const candidateEntries = await readdir(candidatePath, { withFileTypes: true });
      fullFolder = candidatePath;
      entries = candidateEntries;
      break;
    } catch {
      // Try next candidate path.
    }
  }

  if (!fullFolder || !entries) {
    return [];
  }

  const markdownFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  const loaded = await Promise.all(
    markdownFiles.map(async (fileName) => {
      const fullPath = join(fullFolder, fileName);
      const raw = await readFile(fullPath, "utf8");
      const { content, data } = parseFrontmatter(raw);

      const fileSlug = basename(fileName, ".md");
      const id = data.slug?.trim() || fileSlug;
      const label = data.title?.trim() || toTitleCase(id);
      const description = data.description?.trim() || "Markdown to animated video";
      const accentClass =
        data.accentClass?.trim() || "bg-indigo-600 hover:bg-indigo-500";
      const order = Number.parseInt(data.order || "0", 10) || 0;
      const narrationSrc = resolveNarrationSrc(id, data.narrationSrc?.trim());
      const audioDurationSec = data.audioDurationSec
        ? parseFloat(data.audioDurationSec)
        : undefined;
      const rawScenes = parseMarkdownToScenes(content);
      const scenes =
        audioDurationSec && audioDurationSec > 0
          ? scaleScenesToAudio(rawScenes, audioDurationSec)
          : rawScenes;

      return {
        id,
        label,
        description,
        accentClass,
        order,
        narrationSrc,
        audioDurationSec,
        scenes,
      } satisfies MarkdownVideoContent;
    })
  );

  return loaded.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.label.localeCompare(b.label);
  });
}
