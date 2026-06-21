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
  const subtitleY = interpolate(frame, [15, 35], [24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 12% 14%, rgba(34, 211, 238, 0.24), transparent 38%), radial-gradient(circle at 88% 10%, rgba(167, 139, 250, 0.26), transparent 42%), linear-gradient(180deg, #080a16, #0f1324)",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Manrope, system-ui, sans-serif",
        padding: "0 80px",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(rgba(148,163,184,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.045) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div
        style={{
          transform: `scale(${scale})`,
          color: "#f5f8ff",
          fontSize: 80,
          fontWeight: 800,
          textAlign: "center",
          letterSpacing: -2,
          lineHeight: 1.05,
          maxWidth: "96%",
          textShadow: "0 10px 40px rgba(56, 189, 248, 0.16)",
        }}
      >
        {heading}
      </div>
      {subtitle && (
        <div
          style={{
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
            color: "#c7d6f3",
            fontSize: 44,
            marginTop: 28,
            textAlign: "center",
            lineHeight: 1.3,
            maxWidth: "94%",
          }}
        >
          {subtitle}
        </div>
      )}
    </AbsoluteFill>
  );
};
