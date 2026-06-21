import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const targetsPath = process.argv[2];
if (!targetsPath) {
  console.error("Usage: node scripts/verify-og-targets.mjs <targets-json>");
  process.exit(1);
}

const resolvedTargetsPath = path.isAbsolute(targetsPath)
  ? targetsPath
  : path.join(ROOT, targetsPath);

if (!fs.existsSync(resolvedTargetsPath)) {
  console.error(`Targets file not found: ${resolvedTargetsPath}`);
  process.exit(1);
}

const { section, slugs } = JSON.parse(fs.readFileSync(resolvedTargetsPath, "utf-8"));
if (!section || !Array.isArray(slugs) || slugs.length === 0) {
  console.error("Invalid targets format. Expected { section, slugs[] }.");
  process.exit(1);
}

const missing = [];
for (const slug of slugs) {
  const ogPath = path.join(ROOT, "public", "og", section, `${slug}.png`);
  if (!fs.existsSync(ogPath)) {
    missing.push(ogPath);
  }
}

if (missing.length > 0) {
  console.error("Missing OG images:");
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

console.log(`Verified ${slugs.length} OG images for section '${section}'.`);
