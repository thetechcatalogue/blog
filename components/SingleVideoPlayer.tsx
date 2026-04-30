"use client";

import { Player } from "@remotion/player";
import { buildVideoCatalog, getVideoById } from "@/remotion/videoCatalog";
import type { MarkdownVideoContent } from "@/remotion/videoContentTypes";

type SingleVideoPlayerProps = {
  videoId: string;
  markdownVideos: MarkdownVideoContent[];
};

export const SingleVideoPlayer: React.FC<SingleVideoPlayerProps> = ({
  videoId,
  markdownVideos,
}) => {
  const videoCatalog = buildVideoCatalog({ markdownVideos });
  const selectedVideo = getVideoById(videoCatalog, videoId) ?? videoCatalog[0];

  if (!selectedVideo) {
    return null;
  }

  return (
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
  );
};
