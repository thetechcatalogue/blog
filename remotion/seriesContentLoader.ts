import { readdir, readFile } from "node:fs/promises";
import { join, basename } from "node:path";
import { parseMarkdownToScenes } from "@/remotion/parseMarkdown";
import type {
  SeriesContent,
  EpisodeContent,
  EpisodeContentType,
} from "@/remotion/seriesContentTypes";

type Frontmatter = Record<string, string>;

function parseFrontmatter(raw: string): { content: string; data: Frontmatter } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n([\s\S]*))?$/);
  if (!match) return { content: raw, data: {} };
  const data: Frontmatter = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx <= 0) continue;
    const key = line.slice(0, idx).trim();
    const val = line
      .slice(idx + 1)
      .trim()
      .replace(/^['\"]|['\"]$/g, "");
    data[key] = val;
  }
  return { content: match[2] ?? "", data };
}

function toTitleCase(input: string): string {
  return input
    .replace(/^\d+-/, "")
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((p) => p[0].toUpperCase() + p.slice(1))
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
  seriesSlug: string,
  episodeSlug: string,
  frontmatterNarrationSrc?: string
): string {
  if (frontmatterNarrationSrc?.trim()) {
    return normalizePublicPath(frontmatterNarrationSrc.trim());
  }

  return `/audio/series/${toKebabCase(seriesSlug)}/${toKebabCase(episodeSlug)}.mp3`;
}

/**
 * Load all series from src/content/series/<seriesDir>/.
 *
 * Convention per series directory:
 *   _series.md         — series-level metadata (title, slug, icon, etc.)
 *   01-episode.md      — episode files; order from filename prefix or `order:` frontmatter
 *
 * Episode frontmatter fields:
 *   title, slug, order, description, contentType (markdown|flow|composition)
 *   For flow:        flowId (key in FLOW_REGISTRY)
 *   For composition: compositionId (key in STATIC_VIDEO_IDS)
 *
 * Adding a new series = drop a new folder here. No code changes needed.
 */
export async function loadSeriesFromFolder(
  folder = "src/content/series"
): Promise<SeriesContent[]> {
  const root = process.cwd();
  const candidateFolders = [folder, "content/series"];

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

  const seriesDirs = entries.filter((e) => e.isDirectory());

  const allSeries = await Promise.all(
    seriesDirs.map(async (dir): Promise<SeriesContent | null> => {
      const seriesPath = join(fullFolder, dir.name);

      // Read _series.md for metadata — skip dir if it doesn't exist
      let metaData: Frontmatter = {};
      try {
        const metaRaw = await readFile(join(seriesPath, "_series.md"), "utf8");
        metaData = parseFrontmatter(metaRaw).data;
      } catch {
        return null;
      }

      const resolvedSeriesSlug = metaData.slug?.trim() || dir.name;

      // Episode files: any .md not starting with _
      const allFiles = await readdir(seriesPath);
      const episodeFiles = allFiles
        .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
        .sort();

      const episodes = await Promise.all(
        episodeFiles.map(async (fileName): Promise<EpisodeContent> => {
          const raw = await readFile(join(seriesPath, fileName), "utf8");
          const { content, data } = parseFrontmatter(raw);
          const fileBase = basename(fileName, ".md");
          const slug = data.slug?.trim() || fileBase.replace(/^\d+-/, "");
          const rawContentType = (data.contentType?.trim() || "markdown").toLowerCase();
          const contentType: EpisodeContentType =
            rawContentType === "markdown" ||
            rawContentType === "flow" ||
            rawContentType === "composition"
              ? rawContentType
              : "markdown";
          // Prefer explicit order frontmatter, fall back to numeric filename prefix
          const order = parseInt(
            data.order || fileBase.match(/^(\d+)/)?.[1] || "0",
            10
          );
          const narrationSrc = resolveNarrationSrc(
            resolvedSeriesSlug,
            slug,
            data.narrationSrc?.trim()
          );
          const audioDurationSec = data.audioDurationSec
            ? parseFloat(data.audioDurationSec)
            : undefined;
          const rawScenes =
            contentType === "markdown" ? parseMarkdownToScenes(content) : undefined;
          const scenes =
            rawScenes && audioDurationSec && audioDurationSec > 0
              ? scaleScenesToAudio(rawScenes, audioDurationSec)
              : rawScenes;

          return {
            id: slug,
            title: data.title?.trim() || toTitleCase(fileBase),
            slug,
            order,
            description: data.description?.trim(),
            contentType,
            narrationSrc,
            audioDurationSec,
            ...(contentType === "markdown" ? { scenes } : {}),
            ...(contentType === "flow" ? { flowId: data.flowId?.trim() } : {}),
            ...(contentType === "composition"
              ? { compositionId: data.compositionId?.trim() }
              : {}),
          };
        })
      );

      const slug = resolvedSeriesSlug;
      return {
        id: slug,
        slug,
        title: metaData.title?.trim() || toTitleCase(dir.name),
        description: metaData.description?.trim() || "",
        icon: metaData.icon?.trim() || "📹",
        accentClass:
          metaData.accentClass?.trim() || "from-indigo-900 to-blue-950",
        order: parseInt(metaData.order || "0", 10),
        episodes: episodes.sort(
          (a, b) => a.order - b.order || a.title.localeCompare(b.title)
        ),
      };
    })
  );

  return allSeries
    .filter((s): s is SeriesContent => s !== null)
    .sort((a, b) => a.order - b.order);
}
