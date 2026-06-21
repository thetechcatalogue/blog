import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SingleVideoPlayer } from "@/components/SingleVideoPlayer";
import { getMarkdownVideoContentData } from "@/remotion/videoCatalogData";
import { buildVideoCatalog, getVideoById } from "@/remotion/videoCatalog";
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

export async function generateMetadata({ params }: VideoRoutePageProps): Promise<Metadata> {
  const { videoName } = await params;
  const markdownVideos = await getMarkdownVideoContentData();
  const videoCatalog = buildVideoCatalog({ markdownVideos });
  const selectedVideo = getVideoById(videoCatalog, videoName);

  if (!selectedVideo) {
    return {};
  }

  const isMarkdownVideo = markdownVideos.some((video) => video.id === videoName);
  const ogImage = isMarkdownVideo ? `/og/video/${videoName}.png` : "/og/site/default.png";
  const canonical = `https://thetechcatalogue.github.io/video/${videoName}`;

  return {
    title: `${selectedVideo.label} | TechCatalogue`,
    description: selectedVideo.description,
    alternates: { canonical },
    openGraph: {
      title: selectedVideo.label,
      description: selectedVideo.description,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      type: "video.other",
    },
    twitter: {
      card: "summary_large_image",
      title: selectedVideo.label,
      description: selectedVideo.description,
      images: [ogImage],
    },
  };
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
