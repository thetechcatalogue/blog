import { Scene } from "./types";

function parseFrontmatter(raw: string): {
  content: string;
  data: Record<string, string>;
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { content: raw, data: {} };
  const data: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx > 0) {
      const key = line.slice(0, idx).trim();
      const val = line.slice(idx + 1).trim().replace(/^["'\[]|["'\]]$/g, "");
      data[key] = val;
    }
  }
  return { content: match[2], data };
}

export function parseMarkdownToScenes(rawMarkdown: string): Scene[] {
  // Strip frontmatter if present
  const { content: markdown, data: frontmatter } = parseFrontmatter(rawMarkdown);

  const scenes: Scene[] = [];
  const lines = markdown.split("\n");

  let i = 0;

  // If frontmatter has a title, use it as the title scene
  if (frontmatter.title) {
    scenes.push({
      type: "title",
      heading: frontmatter.title,
      body: frontmatter.description,
      duration: frontmatter.description ? 120 : 90,
    });
  }

  while (i < lines.length) {
    const line = lines[i];

    // Skip image lines, frontmatter delimiters, empty lines at top
    if (line.startsWith("![") || line.startsWith("---")) {
      i++;
      continue;
    }

    // H1 → Title scene (only if no frontmatter title was added)
    if (line.startsWith("# ") && !line.startsWith("## ") && !line.startsWith("### ")) {
      if (scenes.some((s) => s.type === "title")) {
        i++;
        continue; // skip duplicate title
      }
      const heading = line.replace(/^# /, "").trim();
      let body: string | undefined;
      if (i + 1 < lines.length) {
        const nextNonEmpty = findNextNonEmpty(lines, i + 1);
        if (
          nextNonEmpty !== -1 &&
          !lines[nextNonEmpty].startsWith("#") &&
          !lines[nextNonEmpty].startsWith("```") &&
          !lines[nextNonEmpty].startsWith("- ")
        ) {
          body = lines[nextNonEmpty].trim();
          i = nextNonEmpty + 1;
          continue;
        }
      }
      scenes.push({ type: "title", heading, body, duration: body ? 120 : 90 });
      i++;
      continue;
    }

    // H2 or H3 → Section, Code, List, or Table scene (peek ahead)
    if (line.startsWith("## ") || line.startsWith("### ")) {
      const heading = line.replace(/^#{2,3} /, "").trim();

      // Look ahead to see what content follows
      const nextIdx = findNextNonEmpty(lines, i + 1);
      if (nextIdx !== -1) {
        // Code block follows?
        if (lines[nextIdx].startsWith("```")) {
          const { code, language, endIndex } = extractCodeBlock(
            lines,
            nextIdx
          );
          // Also grab body text between heading and code block
          let body: string | undefined;
          const bodyLines: string[] = [];
          for (let j = i + 1; j < nextIdx; j++) {
            if (lines[j].trim()) bodyLines.push(lines[j].trim());
          }
          if (bodyLines.length > 0) body = bodyLines.join(" ");

          const codeLineCount = code.split("\n").length;
          scenes.push({
            type: "code",
            heading,
            body,
            code,
            language,
            duration: 90 + codeLineCount * 15,
          });
          i = endIndex + 1;
          continue;
        }

        // List follows?
        if (lines[nextIdx].startsWith("- ")) {
          // Grab body text between heading and list
          let body: string | undefined;
          const bodyLines: string[] = [];
          for (let j = i + 1; j < nextIdx; j++) {
            if (lines[j].trim()) bodyLines.push(lines[j].trim());
          }
          if (bodyLines.length > 0) body = bodyLines.join(" ");

          const items: string[] = [];
          let j = nextIdx;
          while (j < lines.length && lines[j].startsWith("- ")) {
            items.push(lines[j].replace(/^- /, "").trim());
            j++;
          }
          scenes.push({
            type: "list",
            heading,
            body,
            items,
            duration: 60 + items.length * 30,
          });
          i = j;
          continue;
        }

        // Table follows? (line contains | separators)
        if (lines[nextIdx].includes("|")) {
          const items = extractTableItems(lines, nextIdx);
          if (items.length > 0) {
            // Grab body text between heading and table
            let body: string | undefined;
            const bodyLines: string[] = [];
            for (let j = i + 1; j < nextIdx; j++) {
              const l = lines[j].trim();
              if (l && !l.startsWith("![")) bodyLines.push(l);
            }
            if (bodyLines.length > 0) body = bodyLines.join(" ");

            scenes.push({
              type: "list",
              heading,
              body,
              items,
              duration: 60 + Math.min(items.length, 8) * 30,
            });
            // Skip past table
            let j = nextIdx;
            while (j < lines.length && lines[j].includes("|")) j++;
            i = j;
            continue;
          }
        }

        // Plain section
        const bodyLines: string[] = [];
        let j = i + 1;
        while (
          j < lines.length &&
          !lines[j].startsWith("## ") &&
          !lines[j].startsWith("### ") &&
          !lines[j].startsWith("# ") &&
          !lines[j].startsWith("```") &&
          !lines[j].startsWith("- ")
        ) {
          const l = lines[j].trim();
          if (l && !l.startsWith("![")) bodyLines.push(l);
          j++;
        }
        const body = bodyLines.join(" ");
        const wordCount = body.split(" ").length;
        scenes.push({
          type: "section",
          heading,
          body: body || undefined,
          duration: 120 + Math.floor(wordCount / 20) * 10,
        });
        i = j;
        continue;
      }

      scenes.push({ type: "section", heading, duration: 120 });
      i++;
      continue;
    }

    i++;
  }

  // Add outro
  scenes.push({
    type: "outro",
    heading: "Thanks for watching!",
    duration: 75,
  });

  return scenes;
}

function findNextNonEmpty(lines: string[], start: number): number {
  for (let i = start; i < lines.length; i++) {
    if (lines[i].trim() !== "") return i;
  }
  return -1;
}

function extractCodeBlock(
  lines: string[],
  start: number
): { code: string; language: string; endIndex: number } {
  const langMatch = lines[start].match(/^```(\w*)/);
  const language = langMatch?.[1] || "text";
  const codeLines: string[] = [];
  let i = start + 1;
  while (i < lines.length && !lines[i].startsWith("```")) {
    codeLines.push(lines[i]);
    i++;
  }
  return { code: codeLines.join("\n"), language, endIndex: i };
}

function extractTableItems(lines: string[], start: number): string[] {
  const items: string[] = [];
  let i = start;
  while (i < lines.length && lines[i].includes("|")) {
    const cells = lines[i]
      .split("|")
      .map((c) => c.trim())
      .filter((c) => c && !c.match(/^-+$/)); // skip separator rows

    if (cells.length === 0 || cells.every((c) => c.match(/^-+$/))) {
      i++;
      continue;
    }
    // Join non-empty cells as "key: value" or just the cell text
    const meaningful = cells.filter((c) => c.length > 0);
    if (meaningful.length >= 2) {
      items.push(`${meaningful[0]} — ${meaningful.slice(1).join(", ")}`);
    } else if (meaningful.length === 1) {
      items.push(meaningful[0]);
    }
    i++;
  }
  return items;
}
