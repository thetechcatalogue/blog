---
title: Video Workflow
sidebar_position: 20
description: The exact repo workflow for turning a topic into a narrated, rendered markdown video.
tags: [video, remotion, narration, workflow]
---

# Video Workflow

This page documents the exact path from topic selection to final rendered video in this repository.

## Standard Markdown Video Flow

1. Pick a current topic that can be explained in one short video.
2. Create a markdown file in `content/videos/<slug>.md`.
3. Write the narration script to `content/<slug>-narration.txt`.
4. Generate or collect the narration audio.
5. Save the final MP3 to `public/audio/videos/<slug>.mp3`.
6. Measure duration and write `audioDurationSec` back into the markdown frontmatter.
7. Generate OG assets with `node scripts/generate-og.mjs`.
8. Render the MP4 with `node scripts/render-markdown-video.mjs <slug>`.
9. Confirm the final file exists in `out/<slug>.mp4`.

## When The Audio Already Exists

If the narration arrives as a WAV or similar source file, use the finish pipeline:

1. Convert the source audio to `public/audio/videos/<slug>.mp3` with `ffmpeg`.
2. Measure the MP3 with `ffprobe`.
3. Update `audioDurationSec` in the markdown file.
4. Generate the OG image.
5. Render the video.

## Diagram And Flow Videos

For animated explanation videos built with Remotion diagrams or step flows:

1. Model the animation in `remotion/diagrams` or a dedicated Remotion composition.
2. Register the composition in `remotion/Root.tsx`.
3. Add any required audio assets under `public/`.
4. Render the composition to `out/<slug>.mp4`.

## Series Workflow

For a full series:

1. Create `content/series/<series-slug>/_series.md`.
2. Add the episode markdown files in the same folder.
3. Add audio for narrated markdown episodes.
4. Render the full compilation with `node scripts/render-series.mjs <series-slug>`.

## Repo Paths

- content: `content/videos`, `content/series`, and narration text in top-level `content/`
- audio: `public/audio/videos` and `public/audio/series`
- thumbnails: `public/og/video`
- rendered output: `out/`

## Notes

The markdown-video path is the default for short concept videos. The diagram and series paths are for cases where visuals or scope require more structure.
