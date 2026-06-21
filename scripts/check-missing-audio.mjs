#!/usr/bin/env node
/**
 * check-missing-audio.mjs
 *
 * Reports series episodes and markdown videos that are missing audio:
 *   - narrationSrc is set in frontmatter but the file doesn't exist on disk
 *   - narrationSrc is missing from frontmatter entirely
 *
 * Usage:
 *   node scripts/check-missing-audio.mjs
 *   node scripts/check-missing-audio.mjs --missing-only   (skip "no narrationSrc" rows)
 */

import { readdir, readFile, access } from "node:fs/promises";
import { join, relative } from "node:path";
import { constants } from "node:fs";

const ROOT = process.cwd();
const ARGS = process.argv.slice(2);
const MISSING_ONLY = ARGS.includes("--missing-only");

// ─── ANSI colours ────────────────────────────────────────────────────────────
const RED    = "\x1b[31m";
const YELLOW = "\x1b[33m";
const GREEN  = "\x1b[32m";
const CYAN   = "\x1b[36m";
const BOLD   = "\x1b[1m";
const DIM    = "\x1b[2m";
const RESET  = "\x1b[0m";

// ─── Frontmatter parser ───────────────────────────────────────────────────────
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx <= 0) continue;
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    data[key] = val;
  }
  return data;
}

// ─── Check whether a public/ path exists ─────────────────────────────────────
async function fileExists(publicPath) {
  try {
    await access(join(ROOT, "public", publicPath), constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

// ─── Collect markdown files recursively ──────────────────────────────────────
async function collectMdFiles(dir, excludeName = null) {
  const results = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...await collectMdFiles(full, excludeName));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      if (excludeName && entry.name === excludeName) continue;
      results.push(full);
    }
  }
  return results;
}

// ─── Result record ────────────────────────────────────────────────────────────
const STATUS = {
  OK:      "ok",        // narrationSrc set and file exists
  MISSING: "missing",   // narrationSrc set but file not on disk
  NONE:    "none",      // no narrationSrc in frontmatter
};

async function checkFile(absPath, type, groupLabel) {
  const raw = await readFile(absPath, "utf8");
  const fm  = parseFrontmatter(raw);
  const rel = relative(ROOT, absPath);

  if (!fm.narrationSrc) {
    return { type, group: groupLabel, file: rel, narrationSrc: null, status: STATUS.NONE };
  }

  // narrationSrc starts with /audio/... → maps to public/audio/...
  const publicRelPath = fm.narrationSrc.startsWith("/")
    ? fm.narrationSrc.slice(1)  // strip leading slash → audio/...
    : fm.narrationSrc;

  const exists = await fileExists(publicRelPath);
  return {
    type,
    group: groupLabel,
    file: rel,
    narrationSrc: fm.narrationSrc,
    status: exists ? STATUS.OK : STATUS.MISSING,
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const results = [];

  // 1. Series episodes
  const seriesRoot = join(ROOT, "content/series");
  const seriesFiles = await collectMdFiles(seriesRoot, "_series.md");
  for (const f of seriesFiles) {
    // group label = series slug (the parent folder name)
    const parts = relative(seriesRoot, f).split("/");
    const group = parts[0];
    results.push(await checkFile(f, "series", group));
  }

  // 2. Markdown videos
  const videoDir = join(ROOT, "content/videos");
  const videoFiles = await collectMdFiles(videoDir);
  for (const f of videoFiles) {
    results.push(await checkFile(f, "video", "videos"));
  }

  // ─── Print report ──────────────────────────────────────────────────────────
  const missing = results.filter(r => r.status === STATUS.MISSING);
  const none    = results.filter(r => r.status === STATUS.NONE);
  const ok      = results.filter(r => r.status === STATUS.OK);

  console.log(`\n${BOLD}Audio Coverage Report${RESET}  ${DIM}(${new Date().toLocaleString()})${RESET}\n`);
  console.log(`  Total checked : ${results.length}`);
  console.log(`  ${GREEN}✓ Audio OK    : ${ok.length}${RESET}`);
  console.log(`  ${RED}✗ File missing : ${missing.length}${RESET}`);
  console.log(`  ${YELLOW}⚠ No narration : ${none.length}${RESET}\n`);

  if (missing.length > 0) {
    console.log(`${BOLD}${RED}── Missing audio files ─────────────────────────────────────────${RESET}`);
    const byGroup = groupBy(missing, r => r.group);
    for (const [group, rows] of Object.entries(byGroup)) {
      console.log(`\n  ${CYAN}${group}${RESET}`);
      for (const r of rows) {
        const filename = r.file.split("/").pop();
        console.log(`    ${RED}✗${RESET}  ${filename}`);
        console.log(`       expected: ${DIM}public${r.narrationSrc}${RESET}`);
      }
    }
    console.log();
  }

  if (!MISSING_ONLY && none.length > 0) {
    console.log(`${BOLD}${YELLOW}── No narrationSrc in frontmatter ──────────────────────────────${RESET}`);
    const byGroup = groupBy(none, r => r.group);
    for (const [group, rows] of Object.entries(byGroup)) {
      console.log(`\n  ${CYAN}${group}${RESET}`);
      for (const r of rows) {
        const filename = r.file.split("/").pop();
        console.log(`    ${YELLOW}⚠${RESET}  ${filename}`);
      }
    }
    console.log();
  }

  if (missing.length === 0 && (MISSING_ONLY || none.length === 0)) {
    console.log(`${GREEN}${BOLD}All checked items have audio! 🎉${RESET}\n`);
  } else if (missing.length === 0) {
    console.log(`${GREEN}${BOLD}No missing audio files.${RESET}\n`);
  }

  // Exit with non-zero if any files are actually missing (useful in CI)
  if (missing.length > 0) process.exit(1);
}

function groupBy(arr, keyFn) {
  return arr.reduce((acc, item) => {
    const k = keyFn(item);
    (acc[k] ??= []).push(item);
    return acc;
  }, {});
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
