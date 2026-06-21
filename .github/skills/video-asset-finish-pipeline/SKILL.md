---
name: video-asset-finish-pipeline
description: Finish a video when narration audio already exists as a WAV or other source file: convert it to MP3, sync audioDurationSec, generate OG assets, and render the final MP4 in out/.
---

# Video Asset Finish Pipeline

Use this skill when the user already has narration audio and wants the repo to finish the packaging and render steps.

## When to Activate

- the narration audio already exists as a WAV, AIFF, or similar source file
- the user wants the audio converted to the repo's MP3 convention
- the video markdown already exists and only needs final asset generation
- the user wants the final MP4 rendered after audio is finalized

## Required Output Structure

- `content/videos/<slug>.md`
- `public/audio/videos/<slug>.mp3`
- `public/og/video/<slug>.png`
- `out/<slug>.mp4`

## Workflow

1. Confirm the markdown video slug and the source audio file.
2. Convert the source audio to `public/audio/videos/<slug>.mp3` with `ffmpeg`.
3. Measure the MP3 duration with `ffprobe`.
4. Update `audioDurationSec` in the markdown frontmatter.
5. Generate the video OG image with `node scripts/generate-og.mjs`.
6. Render the markdown video with `node scripts/render-markdown-video.mjs <slug>`.
7. Confirm the MP4 lands in `out/`.

## Audio Rules

- Prefer `ffmpeg` for WAV/AIFF to MP3 conversion.
- Keep the final filename aligned with `narrationSrc`.
- Remove temporary audio files after conversion.

## Validation

Before finishing, verify:

- the source audio was converted successfully
- the MP3 exists in `public/audio/videos`
- `audioDurationSec` matches the measured duration
- `public/og/video/<slug>.png` exists
- `out/<slug>.mp4` renders successfully
