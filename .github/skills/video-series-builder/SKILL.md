---
name: video-series-builder
description: Create a full multi-episode video series for this repo, including series metadata, episode files, narration and audio structure, and final series compilation rendering.
---

# Video Series Builder

Use this skill when the user wants a multi-episode series instead of a single standalone video.

## When to Activate

- the user wants a sequence of related episodes
- the topic is too broad for one short video
- the repo should end with a rendered compilation in `out/`
- the user wants markdown, flow, and composition episodes mixed in one series

## Required Structure

- `content/series/<series-slug>/_series.md`
- `content/series/<series-slug>/<episode>.md`
- `public/audio/series/<series-slug>/<episode>.mp3` for narrated markdown episodes
- `out/<series-slug>-series.mp4` or another explicit output path

## Series Metadata

`_series.md` should define:

- `title`
- `slug`
- `description`
- `icon`
- `accentClass`
- `order`

## Episode Types

Use `contentType: markdown` for markdown scene episodes.

Use `contentType: flow` when an episode should reference an existing flow composition and provide `flowId`.

Use `contentType: composition` when an episode should reference a custom Remotion composition and provide `compositionId`.

## Workflow

1. Define the series angle and keep the total scope tight.
2. Create `_series.md`.
3. Add episode markdown files with stable ordering.
4. For markdown episodes, create narration and audio assets.
5. Write `audioDurationSec` for narrated markdown episodes.
6. Render the full compilation with `node scripts/render-series.mjs <series-slug>`.

## Duration Rules

- Prefer short episodes unless the user explicitly wants longer material.
- Keep each episode focused on one idea or one visual progression.
- Use series only when multiple episodes improve clarity over one dense video.

## Render Command

Use:

```bash
node scripts/render-series.mjs <series-slug>
```

Optional explicit output path:

```bash
node scripts/render-series.mjs <series-slug> out/<series-slug>-series.mp4
```

## Quality Gate

Before finishing, verify:

- `_series.md` exists and has valid frontmatter
- episode ordering is correct
- markdown episodes have audio where expected
- `audioDurationSec` exists for narrated markdown episodes
- the series render completes successfully
- the final compilation is written to `out/`