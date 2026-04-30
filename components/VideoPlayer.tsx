"use client";

import { Player } from "@remotion/player";
import { MyComposition } from "@/remotion/MyComposition";

export const VideoPlayer: React.FC = () => {
  return (
    <Player
      component={MyComposition}
      compositionWidth={1920}
      compositionHeight={1080}
      durationInFrames={90}
      fps={30}
      style={{
        width: "100%",
        maxWidth: 960,
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
      }}
      controls
      autoPlay
      loop
      acknowledgeRemotionLicense
    />
  );
};
