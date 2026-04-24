# Presentations

This folder contains two isolated presentation tools. Pick whichever you prefer.

## Marp (Simple HTML slides)

```bash
cd marp
pnpm install  # already done

# Live preview with hot reload
pnpm preview

# Build all slides in slides/ to dist/
pnpm build

# Convert a blog post to slide format
pnpm convert:blog ../../blogs/blog/2024-05-28-network-protocols.md
```

**How it works:** Each `.md` file in `marp/slides/` uses `---` to separate slides. Add `marp: true` in the frontmatter.

## Slidev (Interactive developer presentations)

```bash
cd slidev
pnpm install  # already done

# Dev server with live editing
pnpm dev

# Build to static HTML
pnpm build
```

**How it works:** Slidev uses Vue-powered slides with themes, transitions, and code highlighting. Edit files in `slidev/slides/`.

## Writing New Slides

### Marp format
```markdown
---
marp: true
theme: default
paginate: true
---

# Title Slide

---

## Second Slide

Content here
```

### Slidev format
```markdown
---
theme: seriph
title: My Presentation
---

# Title Slide

---

# Second Slide

Content here
```

## Generating a Narrated Video from Slides (Step by Step)

### Prerequisites

- Python 3 (with venv)
- ffmpeg (`brew install ffmpeg`)
- Marp CLI (installed via `pnpm install` in `marp/`)

### Step 1: Activate the virtual environment

```bash
cd presentations/marp
source ../.venv/bin/activate
```

If the venv doesn't exist yet, create it first:

```bash
cd presentations
python3 -m venv .venv
source .venv/bin/activate
pip install edge-tts
```

### Step 2: Prepare your slides

**Option A** — Write slides from scratch in `marp/slides/`. Use `---` to separate slides:

```markdown
---
marp: true
theme: default
paginate: true
---

# My Title

---

## Slide 2

Content here
```

**Option B** — Convert an existing blog post to slide format:

```bash
pnpm convert:blog ../../blogs/blog/2024-05-28-network-protocols.md
```

This creates a new file in `slides/` with auto-inserted slide breaks.

### Step 3: Add speaker notes (for narration)

Add `<!-- notes: ... -->` in each slide to control what the AI voice says. Without notes, the script auto-extracts text from the slide content (headings, tables, etc.).

```markdown
---

<!-- notes: This slide covers the main networking devices and their roles. A hub is a simple repeater while a switch is intelligent and forwards traffic to the correct port. -->

## Networking Devices

| Device | Description |
|--------|-------------|
| Hub    | Multiport repeater |
| Switch | Forwards to correct destination |
```

### Step 4: Generate the video

```bash
python slides_to_video.py slides/sample-network-protocols.md
```

This will:
1. Parse the markdown and extract narration text (from notes or slide content)
2. Export each slide as a PNG image using Marp CLI
3. Generate AI voice audio per slide using edge-tts (Microsoft Neural TTS, free)
4. Combine all images + audio into a single MP4 video using ffmpeg

### Step 5: Customize (optional)

```bash
# Choose a different voice
python slides_to_video.py slides/my-slides.md --voice en-US-JennyNeural

# Custom output path
python slides_to_video.py slides/my-slides.md -o dist/my-presentation.mp4
```

**Available voices:**

| Voice | Style |
|-------|-------|
| `en-US-GuyNeural` (default) | Male, natural |
| `en-US-JennyNeural` | Female, natural |
| `en-US-AriaNeural` | Female, professional |
| `en-GB-RyanNeural` | British male |
| `en-IN-NeerjaNeural` | Indian English, female |
| `en-IN-PrabhatNeural` | Indian English, male |

Run `edge-tts --list-voices` to see all available voices.

### Step 6: Play the video

```bash
open dist/network-protocols.mp4        # macOS default player
ffplay dist/network-protocols.mp4      # ffmpeg player
```

## Folder Structure

```
presentations/
├── .venv/             # Python virtual environment (edge-tts)
├── marp/              # Marp setup (isolated)
│   ├── slides/        # Put your .md slides here
│   ├── dist/          # Built HTML & video output
│   ├── slides_to_video.py  # Slides → narrated video pipeline
│   ├── convert-blog.mjs    # Blog → slide converter
│   └── package.json
├── slidev/            # Slidev setup (isolated)
│   ├── slides/        # Put your .md slides here
│   ├── dist/          # Built HTML output
│   └── package.json
└── README.md
```
