"use client";

import { useMemo, useState } from "react";
import { Player } from "@remotion/player";
import { buildVideoCatalog } from "@/remotion/videoCatalog";
import type { MarkdownVideoContent } from "@/remotion/videoContentTypes";

type VideoHubPlayerProps = {
  markdownVideos: MarkdownVideoContent[];
  initialVideoId?: string;
};

export const VideoHubPlayer: React.FC<VideoHubPlayerProps> = ({
  markdownVideos,
  initialVideoId,
}) => {
  const videoCatalog = useMemo(
    () => buildVideoCatalog({ markdownVideos }),
    [markdownVideos]
  );

  const safeInitialId =
    initialVideoId && videoCatalog.some((video) => video.id === initialVideoId)
      ? initialVideoId
      : videoCatalog[0]?.id;

  const [selectedId, setSelectedId] = useState<string>(safeInitialId || "");

  const selectedVideo = useMemo(() => {
    return (
      videoCatalog.find((video) => video.id === selectedId) ??
      videoCatalog.find((video) => video.id === safeInitialId) ??
      videoCatalog[0]
    );
  }, [safeInitialId, selectedId, videoCatalog]);

  if (!selectedVideo) {
    return null;
  }

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <div className="flex flex-wrap justify-center gap-3 max-w-5xl">
        {videoCatalog.map((video) => {
          const isSelected = video.id === selectedVideo.id;

          return (
            <button
              key={video.id}
              onClick={() => setSelectedId(video.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isSelected
                  ? `${video.accentClass} text-white`
                  : "bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700"
              }`}
            >
              {video.label}
            </button>
          );
        })}
      </div>

      <div className="text-center">
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">{selectedVideo.label}</h3>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm">{selectedVideo.description}</p>
      </div>

      <Player
        key={selectedVideo.id}
        component={selectedVideo.component}
        inputProps={selectedVideo.inputProps}
        compositionWidth={selectedVideo.compositionWidth}
        compositionHeight={selectedVideo.compositionHeight}
        durationInFrames={selectedVideo.durationInFrames}
        fps={selectedVideo.fps}
        style={{
          width: "100%",
          maxWidth: 960,
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 18px 40px -16px rgba(0, 0, 0, 0.25)",
        }}
        controls
        autoPlay
        loop
        acknowledgeRemotionLicense
      />
    </div>
  );
};
