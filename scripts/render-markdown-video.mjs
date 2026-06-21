import matter from "gray-matter";
import { mkdtemp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { basename, join } from "node:path";
import { tmpdir } from "node:os";

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
  for (let index = start; index < lines.length; index += 1) {
    if (lines[index].trim() !== "") {
      return index;
    }
  }

  return -1;
}

function extractCodeBlock(lines, start) {
  const langMatch = lines[start].match(/^```(\w*)/);
  const language = langMatch?.[1] || "text";
  const codeLines = [];
  let index = start + 1;

  while (index < lines.length && !lines[index].startsWith("```")) {
    codeLines.push(lines[index]);
    index += 1;
  }

  return { code: codeLines.join("\n"), language, endIndex: index };
}

function extractTableItems(lines, start) {
  const items = [];
  let index = start;

  while (index < lines.length && lines[index].includes("|")) {
    const cells = lines[index]
      .split("|")
      .map((cell) => cell.trim())
      .filter((cell) => cell && !/^-+$/.test(cell));

    if (cells.length > 0) {
      items.push(cells.join(" - "));
    }

    index += 1;
  }

  return items;
}

function parseMarkdownToScenes(rawMarkdown) {
  const { content, data } = matter(rawMarkdown);
  const scenes = [];
  const lines = content.split("\n");
  let index = 0;

  if (typeof data.title === "string" && data.title.trim()) {
    scenes.push({
      type: "title",
      heading: data.title.trim(),
      body: typeof data.description === "string" ? data.description.trim() : undefined,
      duration: typeof data.description === "string" && data.description.trim() ? 120 : 90,
    });
  }

  while (index < lines.length) {
    const line = lines[index];

    if (line.startsWith("![") || line.startsWith("---")) {
      index += 1;
      continue;
    }

    if (line.startsWith("# ") && !line.startsWith("## ") && !line.startsWith("### ")) {
      if (scenes.some((scene) => scene.type === "title")) {
        index += 1;
        continue;
      }

      const heading = line.replace(/^# /, "").trim();
      let body;
      const nextNonEmpty = findNextNonEmpty(lines, index + 1);

      if (
        nextNonEmpty !== -1 &&
        !lines[nextNonEmpty].startsWith("#") &&
        !lines[nextNonEmpty].startsWith("```") &&
        !lines[nextNonEmpty].startsWith("- ")
      ) {
        body = lines[nextNonEmpty].trim();
        index = nextNonEmpty + 1;
      } else {
        index += 1;
      }

      scenes.push({ type: "title", heading, body, duration: body ? 120 : 90 });
      continue;
    }

    if (line.startsWith("## ") || line.startsWith("### ")) {
      const heading = line.replace(/^#{2,3} /, "").trim();
      const nextIdx = findNextNonEmpty(lines, index + 1);

      if (nextIdx !== -1) {
        if (lines[nextIdx].startsWith("```")) {
          const { code, language, endIndex } = extractCodeBlock(lines, nextIdx);
          const bodyLines = [];
          for (let bodyIndex = index + 1; bodyIndex < nextIdx; bodyIndex += 1) {
            if (lines[bodyIndex].trim()) {
              bodyLines.push(lines[bodyIndex].trim());
            }
          }

          const body = bodyLines.length > 0 ? bodyLines.join(" ") : undefined;
          const codeLineCount = code.split("\n").length;
          scenes.push({
            type: "code",
            heading,
            body,
            code,
            language,
            duration: 90 + codeLineCount * 15,
          });
          index = endIndex + 1;
          continue;
        }

        if (lines[nextIdx].startsWith("- ")) {
          const bodyLines = [];
          for (let bodyIndex = index + 1; bodyIndex < nextIdx; bodyIndex += 1) {
            if (lines[bodyIndex].trim()) {
              bodyLines.push(lines[bodyIndex].trim());
            }
          }

          const items = [];
          let listIndex = nextIdx;
          while (listIndex < lines.length && lines[listIndex].startsWith("- ")) {
            items.push(lines[listIndex].replace(/^- /, "").trim());
            listIndex += 1;
          }

          scenes.push({
            type: "list",
            heading,
            body: bodyLines.length > 0 ? bodyLines.join(" ") : undefined,
            items,
            duration: 60 + items.length * 30,
          });
          index = listIndex;
          continue;
        }

        if (lines[nextIdx].includes("|")) {
          const items = extractTableItems(lines, nextIdx);
          if (items.length > 0) {
            const bodyLines = [];
            for (let bodyIndex = index + 1; bodyIndex < nextIdx; bodyIndex += 1) {
              const bodyLine = lines[bodyIndex].trim();
              if (bodyLine && !bodyLine.startsWith("![")) {
                bodyLines.push(bodyLine);
              }
            }

            scenes.push({
              type: "list",
              heading,
              body: bodyLines.length > 0 ? bodyLines.join(" ") : undefined,
              items,
              duration: 60 + Math.min(items.length, 8) * 30,
            });

            let tableIndex = nextIdx;
            while (tableIndex < lines.length && lines[tableIndex].includes("|")) {
              tableIndex += 1;
            }

            index = tableIndex;
            continue;
          }
        }

        const bodyLines = [];
        let bodyIndex = index + 1;
        while (
          bodyIndex < lines.length &&
          !lines[bodyIndex].startsWith("## ") &&
          !lines[bodyIndex].startsWith("### ") &&
          !lines[bodyIndex].startsWith("# ") &&
          !lines[bodyIndex].startsWith("```") &&
          !lines[bodyIndex].startsWith("- ")
        ) {
          const bodyLine = lines[bodyIndex].trim();
          if (bodyLine && !bodyLine.startsWith("![")) {
            bodyLines.push(bodyLine);
          }
          bodyIndex += 1;
        }

        const body = bodyLines.join(" ");
        const wordCount = body ? body.split(" ").length : 0;
        scenes.push({
          type: "section",
          heading,
          body: body || undefined,
          duration: 120 + Math.floor(wordCount / 20) * 10,
        });
        index = bodyIndex;
        continue;
      }

      scenes.push({ type: "section", heading, duration: 120 });
      index += 1;
      continue;
    }

    index += 1;
  }

  scenes.push({
    type: "outro",
    heading: "Thanks for watching!",
    duration: 75,
  });

  return scenes;
}

function scaleScenesToAudio(scenes, audioDurationSec, fps = 30) {
  const targetFrames = Math.max(1, Math.round(audioDurationSec * fps));
  const currentTotal = scenes.reduce((sum, scene) => sum + scene.duration, 0);

  if (currentTotal === 0) {
    return scenes;
  }

  let assigned = 0;

  return scenes.map((scene, index) => {
    if (index === scenes.length - 1) {
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

async function loadVideo(videoSlug) {
  const videoDir = join(process.cwd(), "content", "videos");
  const entries = (await readdir(videoDir)).filter((fileName) => fileName.endsWith(".md"));

  for (const fileName of entries) {
    const fullPath = join(videoDir, fileName);
    const raw = await readFile(fullPath, "utf8");
    const { data } = matter(raw);
    const fileBase = basename(fileName, ".md");
    const slug = typeof data.slug === "string" && data.slug.trim() ? data.slug.trim() : fileBase;

    if (slug !== videoSlug && fileBase !== videoSlug) {
      continue;
    }

    const audioDurationSec =
      data.audioDurationSec === undefined ? undefined : Number(data.audioDurationSec);
    const baseScenes = parseMarkdownToScenes(raw);
    const scenes =
      audioDurationSec && Number.isFinite(audioDurationSec) && audioDurationSec > 0
        ? scaleScenesToAudio(baseScenes, audioDurationSec)
        : baseScenes;

    return {
      slug,
      scenes,
      narrationSrc: normalizePublicPath(
        typeof data.narrationSrc === "string" && data.narrationSrc.trim()
          ? data.narrationSrc.trim()
          : `audio/videos/${toKebabCase(slug)}.mp3`
      ),
    };
  }

  return null;
}

async function run() {
  const [, , videoSlugArg, outputPathArg] = process.argv;
  const videoSlug = videoSlugArg?.trim();

  if (!videoSlug) {
    console.error("Usage: node scripts/render-markdown-video.mjs <video-slug> [output-path]");
    process.exit(1);
  }

  const video = await loadVideo(videoSlug);
  if (!video) {
    console.error(`Markdown video not found for slug: ${videoSlug}`);
    process.exit(1);
  }

  const outputPath = outputPathArg?.trim() || `out/${video.slug}.mp4`;
  await mkdir(join(process.cwd(), "out"), { recursive: true });

  const tempDir = await mkdtemp(join(tmpdir(), "blog-markdown-video-render-"));
  const propsPath = join(tempDir, `${video.slug}.json`);
  await writeFile(
    propsPath,
    JSON.stringify({ scenes: video.scenes, narrationSrc: video.narrationSrc }),
    "utf8"
  );

  const renderArgs = [
    "exec",
    "remotion",
    "render",
    "remotion/index.ts",
    "MarkdownVideoRender",
    outputPath,
    `--props=${propsPath}`,
  ];

  try {
    await new Promise((resolve, reject) => {
      const child = spawn("pnpm", renderArgs, {
        cwd: process.cwd(),
        stdio: "inherit",
      });

      child.on("exit", (code) => {
        if (code === 0) {
          resolve();
          return;
        }

        reject(new Error(`Markdown video render failed with exit code ${code ?? 1}.`));
      });

      child.on("error", reject);
    });
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});