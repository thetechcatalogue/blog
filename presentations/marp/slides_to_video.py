#!/usr/bin/env python3
"""
slides_to_video.py — Convert a Marp markdown presentation to a narrated video.

Pipeline:
  1. Parse markdown into individual slides (split on `---`)
  2. Export slides as PNG images via Marp CLI
  3. Generate TTS audio per slide using edge-tts (free Microsoft AI voices)
  4. Combine images + audio into a video with ffmpeg

Usage:
  source ../.venv/bin/activate
  python slides_to_video.py slides/sample-network-protocols.md
  python slides_to_video.py slides/sample-network-protocols.md --voice en-US-GuyNeural
  python slides_to_video.py slides/sample-network-protocols.md --voice en-US-JennyNeural --output my-video.mp4
"""

import argparse
import asyncio
import os
import re
import shutil
import subprocess
import sys
import tempfile

import edge_tts


def parse_slides(md_path: str) -> list[str]:
    """Parse a Marp markdown file and return narration text per slide."""
    with open(md_path, "r") as f:
        content = f.read()

    # Remove YAML frontmatter
    content = re.sub(r"^---\n.*?\n---", "", content, count=1, flags=re.DOTALL)

    # Split on slide separator
    raw_slides = re.split(r"\n---\n", content)

    narrations = []
    for slide in raw_slides:
        text = slide.strip()
        if not text:
            narrations.append("")
            continue

        # Check for <!-- notes: ... --> speaker notes
        notes_match = re.search(r"<!--\s*notes?:\s*(.*?)\s*-->", text, re.DOTALL | re.IGNORECASE)
        if notes_match:
            narrations.append(notes_match.group(1).strip())
            continue

        # Otherwise, extract readable text from the slide content
        lines = []
        for line in text.split("\n"):
            line = line.strip()
            # Skip images, empty lines, table separators
            if not line or line.startswith("![") or re.match(r"^\|?\s*-+", line):
                continue
            # Clean markdown formatting
            line = re.sub(r"!\[.*?\]\(.*?\)", "", line)  # images
            line = re.sub(r"\[([^\]]+)\]\(.*?\)", r"\1", line)  # links
            line = re.sub(r"[*_]{1,2}([^*_]+)[*_]{1,2}", r"\1", line)  # bold/italic
            line = re.sub(r"`([^`]+)`", r"\1", line)  # inline code
            line = re.sub(r"^#{1,6}\s+", "", line)  # headings → plain text
            line = re.sub(r"^\||\|$", "", line)  # table pipes
            line = re.sub(r"\s*\|\s*", ", ", line)  # table cells
            line = line.strip(" ,")
            if line:
                lines.append(line)

        narrations.append(". ".join(lines) if lines else "")

    return narrations


async def generate_audio(text: str, output_path: str, voice: str) -> float:
    """Generate TTS audio for a text string. Returns duration in seconds."""
    if not text.strip():
        # Generate 2 seconds of silence for empty slides
        subprocess.run(
            ["ffmpeg", "-y", "-f", "lavfi", "-i", "anullsrc=r=24000:cl=mono",
             "-t", "2", "-q:a", "9", output_path],
            capture_output=True,
        )
        return 2.0

    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(output_path)

    # Get audio duration
    result = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", output_path],
        capture_output=True, text=True,
    )
    return float(result.stdout.strip())


def export_slide_images(md_path: str, output_dir: str) -> list[str]:
    """Use Marp CLI to export slides as individual PNGs."""
    basename = os.path.splitext(os.path.basename(md_path))[0]
    subprocess.run(
        ["npx", "marp", "--images", "png", md_path, "-o",
         os.path.join(output_dir, f"{basename}.png"), "--allow-local-files"],
        check=True,
    )
    # Marp outputs: basename.001.png, basename.002.png, ...
    images = sorted(
        [os.path.join(output_dir, f) for f in os.listdir(output_dir)
         if f.startswith(basename) and f.endswith(".png")]
    )
    return images


def combine_video(image_audio_pairs: list[tuple[str, str, float]], output: str):
    """Combine slide images and audio into a single video using ffmpeg."""
    tmpdir = tempfile.mkdtemp()
    segments = []

    for i, (img, audio, duration) in enumerate(image_audio_pairs):
        segment = os.path.join(tmpdir, f"seg_{i:03d}.mp4")
        # Create a video segment: still image for the duration of the audio
        subprocess.run(
            ["ffmpeg", "-y",
             "-loop", "1", "-i", img,
             "-i", audio,
             "-c:v", "libx264", "-tune", "stillimage",
             "-c:a", "aac", "-b:a", "192k",
             "-pix_fmt", "yuv420p",
             "-vf", "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2",
             "-shortest",
             "-t", str(duration + 0.5),  # small buffer
             segment],
            check=True, capture_output=True,
        )
        segments.append(segment)

    # Create concat file
    concat_file = os.path.join(tmpdir, "concat.txt")
    with open(concat_file, "w") as f:
        for seg in segments:
            f.write(f"file '{seg}'\n")

    # Concatenate all segments
    subprocess.run(
        ["ffmpeg", "-y", "-f", "concat", "-safe", "0",
         "-i", concat_file, "-c", "copy", output],
        check=True, capture_output=True,
    )

    shutil.rmtree(tmpdir)


async def main():
    parser = argparse.ArgumentParser(description="Convert Marp slides to narrated video")
    parser.add_argument("input", help="Path to Marp markdown file")
    parser.add_argument("--voice", default="en-US-GuyNeural",
                        help="edge-tts voice (default: en-US-GuyNeural)")
    parser.add_argument("--output", "-o", default=None,
                        help="Output video path (default: <input_name>.mp4)")
    args = parser.parse_args()

    if not os.path.exists(args.input):
        print(f"Error: {args.input} not found")
        sys.exit(1)

    basename = os.path.splitext(os.path.basename(args.input))[0]
    output = args.output or f"{basename}.mp4"

    tmpdir = tempfile.mkdtemp(prefix="slides_video_")
    img_dir = os.path.join(tmpdir, "images")
    audio_dir = os.path.join(tmpdir, "audio")
    os.makedirs(img_dir)
    os.makedirs(audio_dir)

    print(f"📄 Parsing slides from {args.input}...")
    narrations = parse_slides(args.input)
    print(f"   Found {len(narrations)} slides")

    print("🖼  Exporting slide images...")
    images = export_slide_images(args.input, img_dir)
    print(f"   Exported {len(images)} images")

    # Match count (sometimes frontmatter slide produces no image)
    if len(images) < len(narrations):
        narrations = narrations[:len(images)]
    elif len(images) > len(narrations):
        narrations.extend([""] * (len(images) - len(narrations)))

    print(f"🔊 Generating audio with voice: {args.voice}...")
    pairs = []
    for i, (img, text) in enumerate(zip(images, narrations)):
        audio_path = os.path.join(audio_dir, f"slide_{i:03d}.mp3")
        preview = (text[:60] + "...") if len(text) > 60 else text
        print(f"   Slide {i+1}: {preview or '(silence)'}")
        duration = await generate_audio(text, audio_path, args.voice)
        pairs.append((img, audio_path, duration))

    print(f"🎬 Combining into video: {output}...")
    combine_video(pairs, output)

    shutil.rmtree(tmpdir)
    print(f"✅ Done! Video saved to: {output}")


if __name__ == "__main__":
    asyncio.run(main())
