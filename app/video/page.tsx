import Link from "next/link";
import { SingleVideoPlayer } from "@/components/SingleVideoPlayer";
import { getMarkdownVideoContentData } from "@/remotion/videoCatalogData";

export default async function VideoPage() {
  const markdownVideos = await getMarkdownVideoContentData();

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-zinc-900 dark:to-black flex flex-col items-center p-8">
      <nav className="w-full max-w-4xl mb-8 flex items-center gap-4">
        <Link
          href="/"
          className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors text-sm"
        >
          ← Home
        </Link>
        <Link
          href="/article"
          className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors text-sm"
        >
          Read as Article →
        </Link>
      </nav>

      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
        📹 Design Patterns — Video
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400 mb-8">
        Same markdown content, rendered as an animated video
      </p>

      <SingleVideoPlayer
        videoId="design-patterns"
        markdownVideos={markdownVideos}
      />

      <div className="mt-8 text-zinc-600 dark:text-zinc-500 text-sm text-center max-w-md">
        <p>
          This video is generated from the same{" "}
          <code className="bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 px-1.5 py-0.5 rounded text-xs">
            src/content/videos/design-patterns.md
          </code>{" "}
          file that powers the{" "}
          <Link href="/article" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            article page
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
