---
name: animated-video-diagrams
description: Create animated Remotion videos that are driven by custom diagram compositions or flow configs under remotion/diagrams, then render them to out/ with the repo's composition structure.
---

# Animated Video Diagrams

Use this skill when the user wants an animated explainer that should be built as a Remotion composition instead of a markdown scene deck.

## When to Activate

- the user wants architecture visuals, moving blocks, network maps, or process animation
- the user explicitly mentions `remotion/diagrams`
- the user wants a flow animation like request lifecycle, auth flow, deployment flow, or incident response
- the visual logic matters more than markdown slides

## Choose the Right Pattern

Use a flow config when:

- the animation is a sequence of steps
- the layout can be expressed through the existing `ClientServerFlow` pattern
- only labels, notes, timing, and step order need to change

Use a new composition when:

- the layout is unique
- multiple parallel regions animate together
- the visual vocabulary differs from the existing flow renderer

## Flow Workflow

1. Add or update a flow definition in `remotion/diagrams/flows`.
2. Register a composition in `remotion/Root.tsx` using `ClientServerFlow`.
3. Give it a stable `id`, `label`, `description`, and render duration.
4. Render it with `pnpm exec remotion render remotion/index.ts <CompositionId> out/<slug>.mp4`.

## Custom Diagram Workflow

1. Create a component in `remotion/diagrams/<Name>.tsx`.
2. Keep inputs explicit: narration source, timing constants, and diagram data.
3. Register the composition in `remotion/Root.tsx`.
4. Add catalog metadata if the video should appear in the site video hub.
5. Render to `out/<slug>.mp4`.

## Audio and Timing

- If the composition uses narration, store audio in `public/` and pass it via `staticFile(...)` or a public path.
- Match `durationInFrames` to the audio length or to the intended animation timing.
- If narration changes, re-measure duration instead of guessing.

## Design Rules

- Prefer strong spatial grouping over excessive labels.
- Animate state changes, ownership changes, and data movement.
- Avoid adding decorative motion that does not clarify the system.
- Keep text large enough for 1080p playback.

## Quality Gate

Before finishing, verify:

- the composition is registered in `remotion/Root.tsx`
- any public audio assets exist
- the composition renders from the CLI
- the output MP4 lands in `out/`
- if it belongs in the site catalog, its metadata appears correctly in the video hub