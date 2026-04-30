import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const TitleScene: React.FC<{
  heading: string;
  subtitle?: string;
}> = ({ heading, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ fps, frame, config: { damping: 12 } });
  const subtitleOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0f0f1a",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          color: "#ffffff",
          fontSize: 72,
          fontWeight: 700,
          textAlign: "center",
          maxWidth: "80%",
        }}
      >
        {heading}
      </div>
      {subtitle && (
        <div
          style={{
            opacity: subtitleOpacity,
            color: "#8b8b9e",
            fontSize: 28,
            marginTop: 20,
            textAlign: "center",
            maxWidth: "70%",
          }}
        >
          {subtitle}
        </div>
      )}
    </AbsoluteFill>
  );
};
