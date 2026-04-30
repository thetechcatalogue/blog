import Link from "next/link";
import { notFound } from "next/navigation";
import { SingleVideoPlayer } from "@/components/SingleVideoPlayer";
import { getMarkdownVideoContentData } from "@/remotion/videoCatalogData";
import { STATIC_VIDEO_IDS, isStaticVideoId } from "@/remotion/videoRouteIds";

type VideoRoutePageProps = {
  params: Promise<{ videoName: string }>;
};

export async function generateStaticParams() {
  const markdownVideos = await getMarkdownVideoContentData();
  const markdownParams = markdownVideos.map((video) => ({ videoName: video.id }));
  const staticParams = STATIC_VIDEO_IDS.map((videoName) => ({ videoName }));

  return [...markdownParams, ...staticParams];
}

export default async function VideoRoutePage({ params }: VideoRoutePageProps) {
  const { videoName } = await params;
  const markdownVideos = await getMarkdownVideoContentData();

  const isMarkdownVideo = markdownVideos.some((video) => video.id === videoName);
  if (!isMarkdownVideo && !isStaticVideoId(videoName)) {
    notFound();
  }

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
          href="/video"
          className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors text-sm"
        >
          Video Hub →
        </Link>
      </nav>

      <SingleVideoPlayer
        videoId={videoName}
        markdownVideos={markdownVideos}
      />
    </div>
  );
}
