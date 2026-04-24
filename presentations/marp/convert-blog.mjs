/**
 * Converts blog markdown files to Marp slide format.
 * Usage: node convert-blog.mjs <input.md> [output.md]
 *
 * Splits on H2/H3 headings to create slide breaks.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { basename, join } from 'path';

const input = process.argv[2];
if (!input) {
  console.log('Usage: node convert-blog.mjs <input.md> [output.md]');
  console.log('Example: node convert-blog.mjs ../../blogs/blog/2024-05-28-network-protocols.md');
  process.exit(1);
}

const raw = readFileSync(input, 'utf-8');

// Strip docusaurus frontmatter
const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
let title = basename(input, '.md');
let body = raw;
if (fmMatch) {
  const fm = fmMatch[1];
  body = fmMatch[2];
  const titleMatch = fm.match(/^title:\s*(.+)$/m);
  if (titleMatch) title = titleMatch[1].trim();
}

// Insert slide breaks before ## and ### headings
const lines = body.split('\n');
const slideLines = [
  '---',
  'marp: true',
  'theme: default',
  'paginate: true',
  `header: "Tech Catalogue"`,
  `footer: "${title}"`,
  '---',
  '',
  `# ${title}`,
  '',
];

for (const line of lines) {
  if (/^#{2,3}\s/.test(line)) {
    slideLines.push('', '---', '');
  }
  slideLines.push(line);
}

const output = process.argv[3] || join('slides', basename(input));
mkdirSync('slides', { recursive: true });
writeFileSync(output, slideLines.join('\n'));
console.log(`✓ Converted: ${input} → ${output}`);
