/**
 * Render each episode of a series as an individual MP4 file.
 *
 * Usage:
 *   node scripts/render-series-episodes.mjs <series-slug> [--output-dir=out/<slug>]
 *
 * Output:
 *   out/<series-slug>/01-episode-slug.mp4
 *   out/<series-slug>/02-episode-slug.mp4
 *   ...
 *
 * The numbered prefix keeps episodes in playlist order.
 */

import matter from "gray-matter";
import {
  mkdtemp,
  mkdir,
  readdir,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import { spawn } from "node:child_process";
import { basename, join } from "node:path";
import { tmpdir } from "node:os";

/* ── helpers ─────────────────────────────────────────────────────────── */

function toTitleCase(input) {
  return input
    .replace(/^\d+-/, "")
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join(" ");
}

function normalizePublicPath(src) {
  return src.startsWith("/") ? src : `/${src}`;
}

function toKebabCase(input) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function findNextNonEmpty(lines, start) {
  for (let i = start; i < lines.length; i++) {
    if (lines[i].trim() !== "") return i;
  }
  return -1;
}

function extractCodeBlock(lines, start) {
  const langMatch = lines[start].match(/^```(\w*)/);
  const language = langMatch?.[1] || "text";
  const codeLines = [];
  let i = start + 1;
  while (i < lines.length && !lines[i].startsWith("```")) {
    codeLines.push(lines[i]);
    i++;
  }
  return { code: codeLines.join("\n"), language, endIndex: i };
}

function extractTableItems(lines, start) {
  const items = [];
  let i = start;
  while (i < lines.length && lines[i].includes("|")) {
    const cells = lines[i]
      .split("|")
      .map((c) => c.trim())
      .filter((c) => c && !/^-+$/.test(c));
    if (cells.length > 0) items.push(cells.join(" – "));
    i++;
  }
  return items;
}

/* ── markdown → scenes (same logic as render-series.mjs) ─────────── */

function parseMarkdownToScenes(rawMarkdown) {
  const { content, data } = matter(rawMarkdown);
  const scenes = [];
  const lines = content.split("\n");
  let idx = 0;

  if (typeof data.title === "string" && data.title.trim()) {
    scenes.push({
      type: "title",
      heading: data.title.trim(),
      body:
        typeof data.description === "string"
          ? data.description.trim()
          : undefined,
      duration:
        typeof data.description === "string" && data.description.trim()
          ? 120
          : 90,
    });
  }

  while (idx < lines.length) {
    const line = lines[idx];

    if (line.startsWith("![") || line.startsWith("---")) {
      idx++;
      continue;
    }

    // H1 → title (skip if already have one)
    if (
      line.startsWith("# ") &&
      !line.startsWith("## ") &&
      !line.startsWith("### ")
    ) {
      if (scenes.some((s) => s.type === "title")) {
        idx++;
        continue;
      }
      const heading = line.replace(/^# /, "").trim();
      let body;
      const next = findNextNonEmpty(lines, idx + 1);
      if (
        next !== -1 &&
        !lines[next].startsWith("#") &&
        !lines[next].startsWith("```") &&
        !lines[next].startsWith("- ")
      ) {
        body = lines[next].trim();
        idx = next + 1;
      } else {
        idx++;
      }
      scenes.push({ type: "title", heading, body, duration: body ? 120 : 90 });
      continue;
    }

    // H2 / H3 → section / code / list
    if (line.startsWith("## ") || line.startsWith("### ")) {
      const heading = line.replace(/^#{2,3} /, "").trim();
      const nextIdx = findNextNonEmpty(lines, idx + 1);

      if (nextIdx !== -1) {
        // Code block
        if (lines[nextIdx].startsWith("```")) {
          const { code, language, endIndex } = extractCodeBlock(lines, nextIdx);
          const bodyLines = [];
          for (let b = idx + 1; b < nextIdx; b++) {
            if (lines[b].trim()) bodyLines.push(lines[b].trim());
          }
          scenes.push({
            type: "code",
            heading,
            body: bodyLines.length ? bodyLines.join(" ") : undefined,
            code,
            language,
            duration: 90 + code.split("\n").length * 15,
          });
          idx = endIndex + 1;
          continue;
        }

        // Bullet list
        if (lines[nextIdx].startsWith("- ")) {
          const bodyLines = [];
          for (let b = idx + 1; b < nextIdx; b++) {
            if (lines[b].trim()) bodyLines.push(lines[b].trim());
          }
          const items = [];
          let li = nextIdx;
          while (li < lines.length && lines[li].startsWith("- ")) {
            items.push(lines[li].replace(/^- /, "").trim());
            li++;
          }
          scenes.push({
            type: "list",
            heading,
            body: bodyLines.length ? bodyLines.join(" ") : undefined,
            items,
            duration: 60 + items.length * 30,
          });
          idx = li;
          continue;
        }

        // Table
        if (lines[nextIdx].includes("|")) {
          const items = extractTableItems(lines, nextIdx);
          if (items.length > 0) {
            const bodyLines = [];
            for (let b = idx + 1; b < nextIdx; b++) {
              const bl = lines[b].trim();
              if (bl && !bl.startsWith("![")) bodyLines.push(bl);
            }
            scenes.push({
              type: "list",
              heading,
              body: bodyLines.length ? bodyLines.join(" ") : undefined,
              items,
              duration: 60 + Math.min(items.length, 8) * 30,
            });
            let ti = nextIdx;
            while (ti < lines.length && lines[ti].includes("|")) ti++;
            idx = ti;
            continue;
          }
        }

        // Plain section
        const bodyLines = [];
        let bi = idx + 1;
        while (
          bi < lines.length &&
          !lines[bi].startsWith("## ") &&
          !lines[bi].startsWith("### ") &&
          !lines[bi].startsWith("# ") &&
          !lines[bi].startsWith("```") &&
          !lines[bi].startsWith("- ")
        ) {
          const bl = lines[bi].trim();
          if (bl && !bl.startsWith("![")) bodyLines.push(bl);
          bi++;
        }
        const body = bodyLines.join(" ");
        const wc = body ? body.split(" ").length : 0;
        scenes.push({
          type: "section",
          heading,
          body: body || undefined,
          duration: 120 + Math.floor(wc / 20) * 10,
        });
        idx = bi;
        continue;
      }

      scenes.push({ type: "section", heading, duration: 120 });
      idx++;
      continue;
    }

    idx++;
  }

  scenes.push({ type: "outro", heading: "Thanks for watching!", duration: 75 });
  return scenes;
}

function scaleScenesToAudio(scenes, audioDurationSec, fps = 30) {
  const targetFrames = Math.max(1, Math.round(audioDurationSec * fps));
  const currentTotal = scenes.reduce((s, sc) => s + sc.duration, 0);
  if (currentTotal === 0) return scenes;
  let assigned = 0;
  return scenes.map((scene, i) => {
    if (i === scenes.length - 1) {
      return { ...scene, duration: Math.max(1, targetFrames - assigned) };
    }
    const scaled = Math.max(
      1,
      Math.round((scene.duration / currentTotal) * targetFrames)
    );
    assigned += scaled;
    return { ...scene, duration: scaled };
  });
}

/* ── load series episodes ────────────────────────────────────────── */

async function loadSeriesEpisodes(seriesSlug) {
  const seriesPath = join(process.cwd(), "content", "series", seriesSlug);
  const metaRaw = await readFile(join(seriesPath, "_series.md"), "utf8");
  const meta = matter(metaRaw).data;

  const allFiles = await readdir(seriesPath);
  const episodeFiles = allFiles
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .sort();

  const episodes = await Promise.all(
    episodeFiles.map(async (fileName) => {
      const raw = await readFile(join(seriesPath, fileName), "utf8");
      const { data } = matter(raw);
      const fileBase = basename(fileName, ".md");
      const slug =
        typeof data.slug === "string" && data.slug.trim()
          ? data.slug.trim()
          : fileBase.replace(/^\d+-/, "");
      const contentType =
        typeof data.contentType === "string"
          ? data.contentType.trim().toLowerCase()
          : "markdown";
      const audioDurationSec =
        data.audioDurationSec === undefined
          ? undefined
          : Number(data.audioDurationSec);
      const baseScenes =
        contentType === "markdown" ? parseMarkdownToScenes(raw) : undefined;
      const scenes =
        baseScenes &&
        audioDurationSec &&
        Number.isFinite(audioDurationSec) &&
        audioDurationSec > 0
          ? scaleScenesToAudio(baseScenes, audioDurationSec)
          : baseScenes;

      const title =
        typeof data.title === "string" && data.title.trim()
          ? data.title.trim()
          : toTitleCase(fileBase);

      return {
        slug,
        title,
        order: Number(data.order ?? fileBase.match(/^(\d+)/)?.[1] ?? 0),
        contentType,
        scenes,
        narrationSrc: normalizePublicPath(
          typeof data.narrationSrc === "string" && data.narrationSrc.trim()
            ? data.narrationSrc.trim()
            : `audio/series/${toKebabCase(seriesSlug)}/${toKebabCase(slug)}.mp3`
        ),
        flowId:
          contentType === "flow" && typeof data.flowId === "string"
            ? data.flowId.trim()
            : undefined,
        compositionId:
          contentType === "composition" &&
          typeof data.compositionId === "string"
            ? data.compositionId.trim()
            : undefined,
      };
    })
  );

  return {
    seriesTitle: typeof meta.title === "string" ? meta.title.trim() : toTitleCase(seriesSlug),
    episodes: episodes.sort(
      (a, b) => a.order - b.order || a.title.localeCompare(b.title)
    ),
  };
}

/* ── catalog ID → Remotion composition ID mapping ─────────────────── */

/**
 * The videoCatalog uses kebab-case IDs, but Remotion <Composition> registrations
 * in Root.tsx use PascalCase IDs. This map bridges the two.
 *
 * Flow-type episodes use their flowId which matches a catalog entry that maps
 * to a Remotion composition here as well.
 */
const catalogToComposition = {
  "http-flow": "HttpRequestFlow",
  "api-auth-flow": "ApiAuthFlow",
  "incident-triage-flow": "HttpRequestFlow", // uses ClientServerFlow component
  "safe-deployment-and-rollback-flow": "HttpRequestFlow", // uses ClientServerFlow component
  "rag-evaluation-flow": "RagEvaluationFlow",
  "websocket-lifecycle-flow": "HttpRequestFlow",
  "oauth-code-flow": "HttpRequestFlow",
  "event-driven-order-flow": "HttpRequestFlow",
  "mcp-security-boundaries": "McpSecurityBoundary",
  "agent-architecture": "AgentArchitecture",
  "database-types": "DatabaseTypes",
  "codemarker": "CodeMarkerPitch",
  "distributed-systems-map": "DistributedSystemsMap",
  "react-tool-use-flow": "ReactToolUseFlow",
  "planner-executor-flow": "PlannerExecutorFlow",
  "multi-agent-handoff-flow": "MultiAgentHandoffFlow",
};

function resolveCompositionId(catalogId) {
  return catalogToComposition[catalogId] || catalogId;
}

/* ── render a single episode ─────────────────────────────────────── */

async function renderEpisode(episode, compositionId, outputPath, tempDir) {
  const propsPath = join(tempDir, `${episode.slug}.json`);

  if (episode.contentType === "markdown" && episode.scenes) {
    await writeFile(
      propsPath,
      JSON.stringify({
        scenes: episode.scenes,
        narrationSrc: episode.narrationSrc,
      }),
      "utf8"
    );
  } else if (episode.contentType === "flow" && episode.flowId) {
    compositionId = resolveCompositionId(episode.flowId);
  } else if (
    episode.contentType === "composition" &&
    episode.compositionId
  ) {
    compositionId = resolveCompositionId(episode.compositionId);
  } else {
    console.warn(`  ⚠ Skipping "${episode.title}" — unsupported content type`);
    return false;
  }

  const renderArgs = [
    "exec",
    "remotion",
    "render",
    "remotion/index.ts",
    compositionId,
    outputPath,
  ];

  // Only pass props for markdown episodes
  if (episode.contentType === "markdown") {
    renderArgs.push(`--props=${propsPath}`);
  }

  return new Promise((resolve, reject) => {
    const child = spawn("pnpm", renderArgs, {
      cwd: process.cwd(),
      stdio: "inherit",
    });
    child.on("exit", (code) => {
      if (code === 0) resolve(true);
      else reject(new Error(`Render failed for "${episode.title}" (exit ${code})`));
    });
    child.on("error", reject);
  });
}

/* ── main ────────────────────────────────────────────────────────── */

async function run() {
  const args = process.argv.slice(2);
  const seriesSlug = args.find((a) => !a.startsWith("--"))?.trim();
  const outputDirArg = args
    .find((a) => a.startsWith("--output-dir="))
    ?.replace("--output-dir=", "")
    .trim();

  if (!seriesSlug) {
    console.error(
      "Usage: node scripts/render-series-episodes.mjs <series-slug> [--output-dir=out/<slug>]"
    );
    process.exit(1);
  }

  const outputDir = outputDirArg || join("out", seriesSlug);
  await mkdir(join(process.cwd(), outputDir), { recursive: true });

  const { seriesTitle, episodes } = await loadSeriesEpisodes(seriesSlug);
  console.log(`\n📹 Series: ${seriesTitle}`);
  console.log(`   ${episodes.length} episodes → ${outputDir}/\n`);

  const tempDir = await mkdtemp(join(tmpdir(), "series-episodes-"));
  const results = [];

  try {
    for (let i = 0; i < episodes.length; i++) {
      const ep = episodes[i];
      const num = String(i + 1).padStart(2, "0");
      const outputPath = join(outputDir, `${num}-${ep.slug}.mp4`);

      console.log(`\n── [${num}/${String(episodes.length).padStart(2, "0")}] ${ep.title}`);
      console.log(`   type: ${ep.contentType} → ${outputPath}`);

      try {
        await renderEpisode(ep, "MarkdownVideoRender", outputPath, tempDir);
        results.push({ title: ep.title, path: outputPath, ok: true });
        console.log(`   ✅ Done`);
      } catch (err) {
        results.push({ title: ep.title, path: outputPath, ok: false, error: err.message });
        console.error(`   ❌ ${err.message}`);
      }
    }
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }

  // Summary
  console.log(`\n${"─".repeat(60)}`);
  console.log(`📋 Render Summary — ${seriesTitle}\n`);
  for (const r of results) {
    console.log(`  ${r.ok ? "✅" : "❌"} ${r.title}`);
    if (r.ok) console.log(`     → ${r.path}`);
    if (!r.ok) console.log(`     ⚠ ${r.error}`);
  }

  const ok = results.filter((r) => r.ok).length;
  const fail = results.filter((r) => !r.ok).length;
  console.log(`\n  ${ok} rendered, ${fail} failed\n`);

  // YouTube playlist helper
  if (ok > 0) {
    console.log(`🎬 YouTube Upload Order (playlist):`);
    results
      .filter((r) => r.ok)
      .forEach((r, i) => console.log(`  ${i + 1}. ${r.path}`));
    console.log();
  }

  if (fail > 0) process.exit(1);
}

run().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
