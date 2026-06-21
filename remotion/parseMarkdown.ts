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

    // Skip frontmatter delimiters, Diagram embeds, and empty lines
    if (line.startsWith("---") || line.startsWith("<Diagram")) {
      i++;
      continue;
    }

    // Image line → Image scene
    if (line.startsWith("![")) {
      const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)/);
      if (imgMatch) {
        const altText = imgMatch[1] || "Image";
        const imageUrl = imgMatch[2];
        scenes.push({
          type: "image",
          heading: altText,
          imageUrl,
          duration: 120,
        });
      }
      i++;
      continue;
    }

    // Blockquote → Quote or Highlight scene
    if (line.startsWith("> ")) {
      const quoteLines: string[] = [];
      let j = i;
      while (j < lines.length && lines[j].startsWith("> ")) {
        quoteLines.push(lines[j].replace(/^> ?/, "").trim());
        j++;
      }
      const fullQuote = quoteLines.join(" ");

      // Highlight pattern: > **Key Takeaway** or > [!NOTE] or > [!TIP] etc.
      const isHighlight =
        fullQuote.startsWith("**Key Takeaway") ||
        fullQuote.startsWith("[!NOTE]") ||
        fullQuote.startsWith("[!TIP]") ||
        fullQuote.startsWith("[!IMPORTANT]") ||
        fullQuote.startsWith("[!WARNING]");

      if (isHighlight) {
        const cleanedLines = quoteLines
          .map((l) =>
            l
              .replace(/^\*\*Key Takeaway[s]?\*\*:?\s*/i, "")
              .replace(/^\[!(?:NOTE|TIP|IMPORTANT|WARNING)\]\s*/i, "")
              .trim()
          )
          .filter((l) => l.length > 0);
        // Split into items on sentence boundaries or line breaks
        const items =
          cleanedLines.length > 1
            ? cleanedLines
            : cleanedLines[0]
              ? cleanedLines[0].split(/\.\s+/).filter((s) => s.trim().length > 0)
              : ["Key point"];
        scenes.push({
          type: "highlight",
          heading: "Key Takeaway",
          items,
          duration: 90 + items.length * 25,
        });
      } else {
        // Quote scene — check for attribution (last line starting with —)
        let attribution: string | undefined;
        const lastQuoteLine = quoteLines[quoteLines.length - 1];
        if (lastQuoteLine && lastQuoteLine.startsWith("—")) {
          attribution = lastQuoteLine.replace(/^—\s*/, "").trim();
          quoteLines.pop();
        }
        const quoteBody = quoteLines.join(" ").replace(/\*\*/g, "");
        scenes.push({
          type: "quote",
          heading: "",
          body: quoteBody,
          attribution,
          duration: 120 + Math.floor(quoteBody.split(" ").length / 20) * 10,
        });
      }
      i = j;
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
          if (language === "mermaid") {
            scenes.push({
              type: "mermaid",
              heading,
              body,
              chart: code,
              duration: 135 + codeLineCount * 18,
            });
            i = endIndex + 1;
            continue;
          }

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

        // Numbered list follows? → Timeline scene
        if (lines[nextIdx].match(/^\d+\.\s/)) {
          let body: string | undefined;
          const bodyLines: string[] = [];
          for (let j = i + 1; j < nextIdx; j++) {
            if (lines[j].trim()) bodyLines.push(lines[j].trim());
          }
          if (bodyLines.length > 0) body = bodyLines.join(" ");

          const items: string[] = [];
          let j = nextIdx;
          while (j < lines.length && lines[j].match(/^\d+\.\s/)) {
            items.push(lines[j].replace(/^\d+\.\s/, "").trim());
            j++;
          }
          scenes.push({
            type: "timeline",
            heading,
            body,
            items,
            duration: 75 + items.length * 28,
          });
          i = j;
          continue;
        }

        // Blockquote follows under heading? → Highlight or Quote scene
        if (lines[nextIdx].startsWith("> ")) {
          let body: string | undefined;
          const bodyLines: string[] = [];
          for (let j = i + 1; j < nextIdx; j++) {
            if (lines[j].trim()) bodyLines.push(lines[j].trim());
          }
          if (bodyLines.length > 0) body = bodyLines.join(" ");

          const quoteLines: string[] = [];
          let j = nextIdx;
          while (j < lines.length && lines[j].startsWith("> ")) {
            quoteLines.push(lines[j].replace(/^> ?/, "").trim());
            j++;
          }

          // If heading suggests key takeaway / highlight
          const isHighlight =
            heading.toLowerCase().includes("takeaway") ||
            heading.toLowerCase().includes("key point") ||
            heading.toLowerCase().includes("highlight") ||
            heading.toLowerCase().includes("summary");

          if (isHighlight) {
            const items = quoteLines.filter((l) => l.length > 0);
            scenes.push({
              type: "highlight",
              heading,
              items: items.length > 0 ? items : ["Key point"],
              duration: 90 + items.length * 25,
            });
          } else {
            let attribution: string | undefined;
            const lastLine = quoteLines[quoteLines.length - 1];
            if (lastLine && lastLine.startsWith("—")) {
              attribution = lastLine.replace(/^—\s*/, "").trim();
              quoteLines.pop();
            }
            const quoteBody = quoteLines.join(" ").replace(/\*\*/g, "");
            scenes.push({
              type: "quote",
              heading,
              body: quoteBody,
              attribution,
              duration: 120 + Math.floor(quoteBody.split(" ").length / 20) * 10,
            });
          }
          i = j;
          continue;
        }

        // Table follows? (line contains | separators)
        if (lines[nextIdx].includes("|")) {
          const comparison = extractComparisonTable(lines, nextIdx);
          if (comparison) {
            scenes.push({
              type: "comparison",
              heading,
              leftLabel: comparison.leftLabel,
              rightLabel: comparison.rightLabel,
              leftItems: comparison.leftItems,
              rightItems: comparison.rightItems,
              duration: 90 + Math.max(comparison.leftItems.length, comparison.rightItems.length) * 25,
            });
            let j = nextIdx;
            while (j < lines.length && lines[j].includes("|")) j++;
            i = j;
            continue;
          }

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

        // Collect body text, stopping at any special content block
        const bodyLines: string[] = [];
        let j = i + 1;
        while (
          j < lines.length &&
          !lines[j].startsWith("## ") &&
          !lines[j].startsWith("### ") &&
          !lines[j].startsWith("# ") &&
          !lines[j].startsWith("```") &&
          !lines[j].startsWith("- ") &&
          !lines[j].startsWith("> ") &&
          !lines[j].startsWith("![") &&
          !lines[j].match(/^\d+\.\s/) &&
          !lines[j].includes("|")
        ) {
          const l = lines[j].trim();
          if (l && !l.startsWith("<Diagram")) bodyLines.push(l);
          j++;
        }
        const body = bodyLines.join(" ") || undefined;

        // After body text, check if a special block follows under this heading
        const afterBodyIdx = findNextNonEmpty(lines, j);
        if (afterBodyIdx !== -1 && afterBodyIdx === j) {
          // Table follows after body?
          if (lines[afterBodyIdx].includes("|")) {
            const comparison = extractComparisonTable(lines, afterBodyIdx);
            if (comparison) {
              scenes.push({
                type: "comparison",
                heading,
                leftLabel: comparison.leftLabel,
                rightLabel: comparison.rightLabel,
                leftItems: comparison.leftItems,
                rightItems: comparison.rightItems,
                duration: 90 + Math.max(comparison.leftItems.length, comparison.rightItems.length) * 25,
              });
              let k = afterBodyIdx;
              while (k < lines.length && lines[k].includes("|")) k++;
              i = k;
              continue;
            }

            const items = extractTableItems(lines, afterBodyIdx);
            if (items.length > 0) {
              scenes.push({
                type: "list",
                heading,
                body,
                items,
                duration: 60 + Math.min(items.length, 8) * 30,
              });
              let k = afterBodyIdx;
              while (k < lines.length && lines[k].includes("|")) k++;
              i = k;
              continue;
            }
          }

          // Numbered list follows after body?
          if (lines[afterBodyIdx].match(/^\d+\.\s/)) {
            const items: string[] = [];
            let k = afterBodyIdx;
            while (k < lines.length && lines[k].match(/^\d+\.\s/)) {
              items.push(lines[k].replace(/^\d+\.\s/, "").trim());
              k++;
            }
            scenes.push({
              type: "timeline",
              heading,
              body,
              items,
              duration: 75 + items.length * 28,
            });
            i = k;
            continue;
          }

          // Bullet list follows after body?
          if (lines[afterBodyIdx].startsWith("- ")) {
            const items: string[] = [];
            let k = afterBodyIdx;
            while (k < lines.length && lines[k].startsWith("- ")) {
              items.push(lines[k].replace(/^- /, "").trim());
              k++;
            }
            scenes.push({
              type: "list",
              heading,
              body,
              items,
              duration: 60 + items.length * 30,
            });
            i = k;
            continue;
          }

          // Blockquote follows after body?
          if (lines[afterBodyIdx].startsWith("> ")) {
            const quoteLines: string[] = [];
            let k = afterBodyIdx;
            while (k < lines.length && lines[k].startsWith("> ")) {
              quoteLines.push(lines[k].replace(/^> ?/, "").trim());
              k++;
            }
            const fullQuote = quoteLines.join(" ");

            // Check for highlight pattern
            const isHighlight =
              fullQuote.startsWith("**Key Takeaway") ||
              fullQuote.startsWith("[!NOTE]") ||
              fullQuote.startsWith("[!TIP]") ||
              fullQuote.startsWith("[!IMPORTANT]") ||
              fullQuote.startsWith("[!WARNING]") ||
              heading.toLowerCase().includes("takeaway") ||
              heading.toLowerCase().includes("key point") ||
              heading.toLowerCase().includes("highlight") ||
              heading.toLowerCase().includes("summary");

            if (isHighlight) {
              // Emit the section body first if it exists
              if (body) {
                const wordCount = body.split(" ").length;
                scenes.push({
                  type: "section",
                  heading,
                  body,
                  duration: 120 + Math.floor(wordCount / 20) * 10,
                });
              }
              const cleanedLines = quoteLines
                .map((l) =>
                  l
                    .replace(/^\*\*Key Takeaway[s]?\*\*:?\s*/i, "")
                    .replace(/^\[!(?:NOTE|TIP|IMPORTANT|WARNING)\]\s*/i, "")
                    .trim()
                )
                .filter((l) => l.length > 0);
              const items =
                cleanedLines.length > 1
                  ? cleanedLines
                  : cleanedLines[0]
                    ? cleanedLines[0].split(/\.\s+/).filter((s) => s.trim().length > 0)
                    : ["Key point"];
              scenes.push({
                type: "highlight",
                heading: "Key Takeaway",
                items,
                duration: 90 + items.length * 25,
              });
              i = k;
              continue;
            }

            let attribution: string | undefined;
            const lastLine = quoteLines[quoteLines.length - 1];
            if (lastLine && lastLine.startsWith("—")) {
              attribution = lastLine.replace(/^—\s*/, "").trim();
              quoteLines.pop();
            }
            const quoteBody = quoteLines.join(" ").replace(/\*\*/g, "");
            // Emit the section body first if it exists
            if (body) {
              const wordCount = body.split(" ").length;
              scenes.push({
                type: "section",
                heading,
                body,
                duration: 120 + Math.floor(wordCount / 20) * 10,
              });
            }
            scenes.push({
              type: "quote",
              heading,
              body: quoteBody,
              attribution,
              duration: 120 + Math.floor(quoteBody.split(" ").length / 20) * 10,
            });
            i = k;
            continue;
          }
        }

        // Plain section (no special block follows)
        const wordCount = (body || "").split(" ").length;
        scenes.push({
          type: "section",
          heading,
          body,
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

function extractComparisonTable(
  lines: string[],
  start: number
): {
  leftLabel: string;
  rightLabel: string;
  leftItems: string[];
  rightItems: string[];
} | null {
  // Must have a header row with exactly 2 data columns
  const headerCells = lines[start]
    .split("|")
    .map((c) => c.trim())
    .filter((c) => c.length > 0);

  if (headerCells.length !== 2) return null;

  // Check for separator row
  if (start + 1 >= lines.length) return null;
  const sepCells = lines[start + 1]
    .split("|")
    .map((c) => c.trim())
    .filter((c) => c.length > 0);
  if (!sepCells.every((c) => c.match(/^[-:]+$/))) return null;

  const leftLabel = headerCells[0];
  const rightLabel = headerCells[1];
  const leftItems: string[] = [];
  const rightItems: string[] = [];

  let i = start + 2;
  while (i < lines.length && lines[i].includes("|")) {
    const cells = lines[i]
      .split("|")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);
    if (cells.length >= 2) {
      if (cells[0] && !cells[0].match(/^-+$/)) leftItems.push(cells[0]);
      if (cells[1] && !cells[1].match(/^-+$/)) rightItems.push(cells[1]);
    }
    i++;
  }

  if (leftItems.length === 0 && rightItems.length === 0) return null;
  return { leftLabel, rightLabel, leftItems, rightItems };
}
