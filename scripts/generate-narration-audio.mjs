#!/usr/bin/env node
/**
 * generate-narration-audio.mjs
 *
 * For every markdown video and series episode:
 *   1. Reads the .md file content
 *   2. Calls the local chat API to produce a narration script
 *   3. Calls the local TTS API to synthesise speech
 *   4. Converts WAV → MP3 if needed (requires ffmpeg)
 *   5. Saves the MP3 to public/<narrationSrc>
 *   6. Measures audio duration with ffprobe
 *   7. Writes audioDurationSec back to the file's frontmatter
 *
 * Usage:
 *   node scripts/generate-narration-audio.mjs
 *   node scripts/generate-narration-audio.mjs --force          # overwrite existing audio
 *   node scripts/generate-narration-audio.mjs --dry-run        # show what would run, no writes
 *   node scripts/generate-narration-audio.mjs --only design-patterns  # slug filter
 *   node scripts/generate-narration-audio.mjs --voice 2.mp3    # TTS voice sample
 *
 * Environment:
 *   ML_STUDIO_BASE   defaults to http://localhost:52100
 *   TTS_VOICE        defaults to 2.mp3
 */

import { readdir, readFile, writeFile, mkdir, unlink, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

// ── Config ────────────────────────────────────────────────────────────────────

const BASE_URL = process.env.ML_STUDIO_BASE ?? "http://localhost:52100";
const CHAT_ENDPOINT = `${BASE_URL}/api/text/chat`;
const TTS_ENDPOINT = `${BASE_URL}/api/speech/tts`;

const args = process.argv.slice(2);
const FORCE = args.includes("--force");
const DRY_RUN = args.includes("--dry-run");
const VOICE = (() => {
  const idx = args.indexOf("--voice");
  return idx !== -1 ? args[idx + 1] : (process.env.TTS_VOICE ?? "2.mp3");
})();
const ONLY_FILTER = (() => {
  const idx = args.indexOf("--only");
  return idx !== -1 ? args[idx + 1] : null;
})();
const CHAT_MODEL = process.env.CHAT_MODEL ?? "llama3.1:8b";
const REQUEST_TIMEOUT_MS = Number(process.env.REQUEST_TIMEOUT_MS ?? 300000);
const MAX_TTS_CHARS = Number(process.env.MAX_TTS_CHARS ?? 450);

// ── Helpers ───────────────────────────────────────────────────────────────────

function log(msg) {
  console.log(`[narration] ${msg}`);
}

function warn(msg) {
  console.warn(`[narration] WARN: ${msg}`);
}

/** Parse YAML-style frontmatter, return { data, content, raw } */
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n([\s\S]*))?$/);
  if (!match) return { data: {}, content: raw, fmRaw: "" };
  const data = {};
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
  return { data, content: match[2] ?? "", fmRaw: match[1] };
}

/** Upsert a key in the frontmatter block and return the full updated file text */
function upsertFrontmatterField(raw, key, value) {
  const { fmRaw, content } = parseFrontmatter(raw);
  const lines = fmRaw.split(/\r?\n/);
  const keyLine = `${key}: ${value}`;
  const existingIdx = lines.findIndex((l) => l.startsWith(`${key}:`));
  if (existingIdx !== -1) {
    lines[existingIdx] = keyLine;
  } else {
    lines.push(keyLine);
  }
  return `---\n${lines.join("\n")}\n---\n${content}`;
}

/** Derive public audio path from frontmatter or fallback convention */
function resolveAudioPath(data, type, seriesSlug) {
  const src = data.narrationSrc?.trim();
  if (src) return src.startsWith("/") ? src : `/${src}`;
  if (type === "video") {
    const slug = data.slug?.trim() ?? "unknown";
    return `/audio/videos/${toKebab(slug)}.mp3`;
  }
  // series episode
  const slug = data.slug?.trim() ?? "unknown";
  return `/audio/series/${toKebab(seriesSlug)}/${toKebab(slug)}.mp3`;
}

function toKebab(s) {
  return s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function estimateNarrationTargetWords(markdownContent) {
  const headingCount = (markdownContent.match(/^##?\s+/gm) || []).length;
  return Math.min(140, Math.max(75, headingCount * 16));
}

function buildNarrationSource({ data, mdContent, type, seriesSlug }) {
  const trimmedContent = mdContent.trim();
  const contentType = data.contentType?.trim().toLowerCase() || "markdown";

  if (trimmedContent) {
    return { source: trimmedContent };
  }

  const title = data.title?.trim() || data.slug?.trim() || "Untitled episode";
  const description = data.description?.trim() || "";
  const visualId = data.compositionId?.trim() || data.flowId?.trim() || data.slug?.trim() || "";
  const lines = [
    `# ${title}`,
    description,
    "## Episode Context",
    `Series: ${seriesSlug || "standalone"}`,
    `Format: ${type === "episode" ? `series ${contentType}` : contentType}`,
    visualId ? `Visual ID: ${visualId}` : "",
    "## Narration Goals",
    "- Explain what the visual is showing.",
    "- Walk through the major stages or components in a clear order.",
    "- End with the main takeaway the viewer should remember.",
  ].filter(Boolean);

  return {
    source: lines.join("\n\n"),
    targetWords: 55,
  };
}

/** Generate narration script text via local chat API */
async function generateNarration(markdownContent, targetWordsOverride) {
  const targetWords = targetWordsOverride ?? estimateNarrationTargetWords(markdownContent);
  const systemPrompt =
    "You are a voice-over narrator for technical explainer videos. " +
    "Your job: turn markdown slide content into a natural, conversational spoken script. " +
    "Rules (strictly follow every one):\n" +
    "- Output ONLY the spoken narration. No intro like 'Sure!' or 'Here is the narration'. No outro.\n" +
    "- No markdown syntax: no **, *, #, `, -, bullet points, numbered lists, or headings.\n" +
    "- No section labels, no 'Section 1:' or 'Slide 1:' prefixes.\n" +
    "- Write flowing prose, as if speaking to a curious colleague, but stay concise.\n" +
    "- Stay very close to the source. Do not add examples, analogies, or extra explanation that is not already implied by the slides.\n" +
    "- Cover every concept in the slides, but compress repeated ideas instead of restating them.\n" +
    `- Target about ${targetWords} words total unless the slide content clearly requires less.\n` +
    "- Speak at a natural pace: roughly 130 words per minute.\n" +
    "- Start directly with the first sentence of the narration.";

  const message = `${systemPrompt}\n\nHere is the slide content:\n\n${markdownContent}`;

  const res = await fetch(CHAT_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, model: CHAT_MODEL }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!res.ok) {
    throw new Error(`Chat API error ${res.status}: ${await res.text()}`);
  }

  const json = await res.json();
  // Handle common response shapes
  const text =
    json.response ?? json.message ?? json.text ?? json.content ?? json.reply;
  if (!text || typeof text !== "string") {
    throw new Error(`Unexpected chat API response shape: ${JSON.stringify(json).slice(0, 200)}`);
  }
  return text.trim();
}

/**
 * Strip residual markdown and model preamble that local LLMs sometimes emit
 * even when explicitly told not to.
 */
function cleanNarration(text) {
  return text
    // Remove common model preamble lines
    .replace(/^(sure[!,.]?|of course[!,.]?|here'?s?( is| are)?( the| your)?[^.\n]*[.:\n])/im, "")
    // Remove markdown headings (# ## ### etc.)
    .replace(/^#{1,6}\s+.*/gm, "")
    // Remove bold/italic markers
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, "$1")
    // Remove inline code backticks
    .replace(/`([^`]+)`/g, "$1")
    // Remove bullet/numbered list markers at start of line
    .replace(/^[\s]*[-*•]\s+/gm, "")
    .replace(/^[\s]*\d+[.)]\s+/gm, "")
    // Remove slide/section labels like "Slide 1:" or "Section: Intro"
    .replace(/^(slide|section|part|chapter)\s*\d*\s*[:\-–]\s*/gim, "")
    // Collapse multiple blank lines to one
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Call TTS endpoint, return Buffer with audio bytes and detected format */
async function synthesiseSpeech(narrationText) {
  const formData = new FormData();
  formData.append("text", narrationText);
  formData.append("voice_sample", VOICE);

  const res = await fetch(TTS_ENDPOINT, {
    method: "POST",
    body: formData,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!res.ok) {
    throw new Error(`TTS API error ${res.status}: ${await res.text()}`);
  }

  const contentType = (res.headers.get("content-type") ?? "").toLowerCase();

  // Some TTS servers return JSON metadata with output_path instead of audio bytes.
  if (contentType.includes("application/json")) {
    const payload = await res.json();
    const outputPath = payload?.output_path;
    if (!outputPath || typeof outputPath !== "string") {
      throw new Error(`TTS JSON response missing output_path: ${JSON.stringify(payload).slice(0, 300)}`);
    }
    if (!existsSync(outputPath)) {
      throw new Error(`TTS output_path does not exist: ${outputPath}`);
    }

    const buffer = await readFile(outputPath);
    const inferredType = outputPath.toLowerCase().endsWith(".wav")
      ? "audio/wav"
      : outputPath.toLowerCase().endsWith(".mp3")
        ? "audio/mpeg"
        : "";

    return { buffer, contentType: inferredType || contentType };
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  return { buffer, contentType };
}

function splitNarrationIntoChunks(text, maxChars = MAX_TTS_CHARS) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return [];
  if (normalized.length <= maxChars) return [normalized];

  const sentences = normalized.split(/(?<=[.!?])\s+/);
  const chunks = [];
  let current = "";

  for (const sentence of sentences) {
    if (!sentence) continue;
    if (sentence.length > maxChars) {
      if (current) {
        chunks.push(current.trim());
        current = "";
      }
      const words = sentence.split(/\s+/);
      let wordChunk = "";
      for (const word of words) {
        if (!wordChunk) {
          wordChunk = word;
          continue;
        }
        if ((wordChunk + " " + word).length > maxChars) {
          chunks.push(wordChunk);
          wordChunk = word;
        } else {
          wordChunk += " " + word;
        }
      }
      if (wordChunk) chunks.push(wordChunk);
      continue;
    }

    const candidate = current ? `${current} ${sentence}` : sentence;
    if (candidate.length > maxChars) {
      chunks.push(current.trim());
      current = sentence;
    } else {
      current = candidate;
    }
  }

  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

/** Convert WAV buffer to MP3 file on disk using ffmpeg */
async function convertWavToMp3(wavBuffer, outPath) {
  // Write wav to temp file, then convert
  const tmpWav = `${outPath}.tmp.wav`;
  await writeFile(tmpWav, wavBuffer);
  try {
    await execFileAsync("ffmpeg", [
      "-y",
      "-i", tmpWav,
      "-codec:a", "libmp3lame",
      "-qscale:a", "2",
      outPath,
    ]);
  } finally {
    // Clean up temp wav
    try { await import("node:fs/promises").then(m => m.unlink(tmpWav)); } catch {}
  }
}

async function convertAudioFileToMp3(inputPath, outPath) {
  await execFileAsync("ffmpeg", [
    "-y",
    "-i", inputPath,
    "-codec:a", "libmp3lame",
    "-qscale:a", "2",
    outPath,
  ]);
}

async function synthesiseSpeechWithSay(narrationText, destPath) {
  const tmpAiff = `${destPath}.tmp.aiff`;
  try {
    await execFileAsync("say", [
      "-o",
      tmpAiff,
      narrationText,
    ]);
    await convertAudioFileToMp3(tmpAiff, destPath);
  } finally {
    try { await unlink(tmpAiff); } catch {}
  }
}

/** Get audio duration in seconds using ffprobe */
async function getAudioDuration(mp3Path) {
  const { stdout } = await execFileAsync("ffprobe", [
    "-v", "error",
    "-show_entries", "format=duration",
    "-of", "default=noprint_wrappers=1:nokey=1",
    mp3Path,
  ]);
  return parseFloat(stdout.trim());
}

/** Save audio bytes as MP3, converting from WAV when needed */
async function saveAudioBytesAsMp3(buffer, contentType, destPath) {
  await mkdir(dirname(destPath), { recursive: true });

  const isWav =
    contentType.includes("wav") ||
    contentType.includes("wave") ||
    // check magic bytes RIFF
    (buffer.length > 4 && buffer.slice(0, 4).toString("ascii") === "RIFF");

  if (isWav) {
    log(`  Converting WAV → MP3 ...`);
    await convertWavToMp3(buffer, destPath);
  } else {
    // Assume MP3 or passthrough
    await writeFile(destPath, buffer);
  }
}

async function concatMp3Files(mp3Paths, outPath) {
  const listPath = `${outPath}.concat.txt`;
  const listContent = mp3Paths.map((p) => `file ${p}`).join("\n");
  await writeFile(listPath, listContent, "utf8");

  try {
    await execFileAsync("ffmpeg", [
      "-y",
      "-f", "concat",
      "-safe", "0",
      "-i", listPath,
      "-codec:a", "libmp3lame",
      "-qscale:a", "2",
      outPath,
    ]);
  } finally {
    try {
      await unlink(listPath);
    } catch {}
  }
}

async function synthesiseNarrationToMp3(narrationText, destPath) {
  const chunks = splitNarrationIntoChunks(narrationText);
  if (!chunks.length) {
    throw new Error("Narration text was empty after cleanup");
  }

  if (chunks.length === 1) {
    const result = await synthesiseSpeech(chunks[0]);
    await saveAudioBytesAsMp3(result.buffer, result.contentType, destPath);
    return;
  }

  log(`  TTS chunking: ${chunks.length} chunk(s)`);
  const tmpDir = `${destPath}.parts`;
  await mkdir(tmpDir, { recursive: true });
  const partPaths = [];

  try {
    for (let i = 0; i < chunks.length; i++) {
      const partPath = join(tmpDir, `part-${String(i + 1).padStart(3, "0")}.mp3`);
      const result = await synthesiseSpeech(chunks[i]);
      await saveAudioBytesAsMp3(result.buffer, result.contentType, partPath);
      partPaths.push(partPath);
    }

    await concatMp3Files(partPaths, destPath);
  } finally {
    try {
      await rm(tmpDir, { recursive: true, force: true });
    } catch {}
  }
}

/** Save audio and return duration in seconds */
async function saveAudio(narrationText, destPath) {
  try {
    await synthesiseNarrationToMp3(narrationText, destPath);
  } catch (error) {
    warn(`  Primary TTS failed, falling back to macOS say: ${error.message}`);
    await synthesiseSpeechWithSay(narrationText, destPath);
  }

  const duration = await getAudioDuration(destPath);
  return duration;
}

// ── File discovery ────────────────────────────────────────────────────────────

async function discoverFiles() {
  const root = process.cwd();
  const files = []; // { mdPath, audioPublicPath, type, seriesSlug? }

  // Standalone videos
  const videoDir = join(root, "content/videos");
  if (existsSync(videoDir)) {
    const entries = await readdir(videoDir);
    for (const name of entries) {
      if (!name.endsWith(".md")) continue;
      const mdPath = join(videoDir, name);
      const raw = await readFile(mdPath, "utf8");
      const { data } = parseFrontmatter(raw);
      const audioPublicPath = resolveAudioPath(data, "video", null);
      files.push({ mdPath, audioPublicPath, type: "video", seriesSlug: null });
    }
  }

  // Series episodes
  const seriesDir = join(root, "content/series");
  if (existsSync(seriesDir)) {
    const seriesDirs = await readdir(seriesDir, { withFileTypes: true });
    for (const d of seriesDirs) {
      if (!d.isDirectory()) continue;
      const seriesSlug = d.name;
      const episodeDir = join(seriesDir, seriesSlug);
      const episodeFiles = await readdir(episodeDir);
      for (const name of episodeFiles) {
        if (!name.endsWith(".md") || name === "_series.md") continue;
        const mdPath = join(episodeDir, name);
        const raw = await readFile(mdPath, "utf8");
        const { data } = parseFrontmatter(raw);
        const audioPublicPath = resolveAudioPath(data, "episode", seriesSlug);
        files.push({ mdPath, audioPublicPath, type: "episode", seriesSlug });
      }
    }
  }

  return files;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function processFile({ mdPath, audioPublicPath, type, seriesSlug }) {
  const root = process.cwd();
  const fileSlug = basename(mdPath, ".md");

  const destPath = join(root, "public", audioPublicPath);
  const raw = await readFile(mdPath, "utf8");
  const { data, content: mdContent } = parseFrontmatter(raw);
  const effectiveSlug = data.slug?.trim() || fileSlug;
  const label = `${type === "episode" ? `${seriesSlug}/` : ""}${effectiveSlug}`;

  if (
    ONLY_FILTER &&
    !label.includes(ONLY_FILTER) &&
    !fileSlug.includes(ONLY_FILTER) &&
    !effectiveSlug.includes(ONLY_FILTER)
  ) {
    return;
  }

  const expectedNarrationSrc = audioPublicPath;
  const narrationInput = buildNarrationSource({
    data,
    mdContent,
    type,
    seriesSlug,
  });

  if (!FORCE && existsSync(destPath)) {
    const missingNarrationSrc = data.narrationSrc?.trim() !== expectedNarrationSrc;
    const missingDuration = !data.audioDurationSec?.trim();

    if (missingNarrationSrc || missingDuration) {
      let updated = raw;
      updated = upsertFrontmatterField(updated, "narrationSrc", expectedNarrationSrc);

      if (missingDuration) {
        const durationSec = await getAudioDuration(destPath);
        updated = upsertFrontmatterField(updated, "audioDurationSec", durationSec.toFixed(3));
        log(`BACKFILL ${label} — audio exists, wrote narrationSrc and audioDurationSec=${durationSec.toFixed(3)}`);
      } else {
        log(`BACKFILL ${label} — audio exists, wrote narrationSrc`);
      }

      await writeFile(mdPath, updated, "utf8");
    } else {
      log(`SKIP ${label} — audio already exists (use --force to overwrite)`);
    }
    return;
  }

  log(`\nProcessing: ${label}`);
  log(`  MD:    ${mdPath}`);
  log(`  Audio: ${destPath}`);

  if (DRY_RUN) {
    log(`  DRY RUN — would generate audio and write to ${destPath}`);
    return;
  }

  // 1. Generate narration text
  log(`  Generating narration text via chat API ...`);
  let narrationText;
  try {
    narrationText = await generateNarration(
      narrationInput.source,
      narrationInput.targetWords
    );
  } catch (err) {
    warn(`  Chat API failed for ${label}: ${err.message}`);
    return;
  }
  narrationText = cleanNarration(narrationText);
  log(`  Narration: ${narrationText.slice(0, 120).replace(/\n/g, " ")}...`);

  // 2. Synthesise speech and measure duration
  log(`  Saving audio to ${destPath} ...`);
  let durationSec;
  try {
    durationSec = await saveAudio(narrationText, destPath);
  } catch (err) {
    warn(`  TTS/audio pipeline failed for ${label}: ${err.message}`);
    return;
  }
  log(`  Duration: ${durationSec.toFixed(2)}s`);

  // 4. Update frontmatter with audioDurationSec
  let updated = upsertFrontmatterField(raw, "narrationSrc", expectedNarrationSrc);
  updated = upsertFrontmatterField(updated, "audioDurationSec", durationSec.toFixed(3));
  await writeFile(mdPath, updated, "utf8");
  log(`  Updated frontmatter: narrationSrc=${expectedNarrationSrc}, audioDurationSec=${durationSec.toFixed(3)}`);

  log(`  Done: ${label}`);
}

async function main() {
  log(`Base URL:  ${BASE_URL}`);
  log(`Voice:     ${VOICE}`);
  log(`Model:     ${CHAT_MODEL}`);
  log(`Force:     ${FORCE}`);
  log(`Dry run:   ${DRY_RUN}`);
  if (ONLY_FILTER) log(`Filter:    ${ONLY_FILTER}`);

  const files = await discoverFiles();
  log(`\nDiscovered ${files.length} markdown file(s)\n`);

  // Process sequentially to avoid overwhelming local API
  for (const file of files) {
    await processFile(file);
  }

  log("\nAll done.");
}

main().catch((err) => {
  console.error("[narration] Fatal:", err);
  process.exit(1);
});
