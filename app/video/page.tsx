import Link from "next/link";
import { VideoHubSidebarPlayer } from "@/components/VideoHubSidebarPlayer";
import { getMarkdownVideoContentData } from "@/remotion/videoCatalogData";

export default async function VideoPage() {
  const markdownVideos = await getMarkdownVideoContentData();

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col">
      <nav className="w-full border-b border-zinc-200 dark:border-zinc-800 px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link
            href="/"
            className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors text-sm"
          >
            ← Home
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center p-8">
        <div className="w-full max-w-6xl">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
            📹 Videos
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">
            Explore animated walkthroughs of technical concepts
          </p>

          <VideoHubSidebarPlayer markdownVideos={markdownVideos} />
        </div>
      </div>
    </div>
  );
}
