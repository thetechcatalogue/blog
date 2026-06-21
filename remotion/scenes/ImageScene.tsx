import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Img,
} from "remotion";

export const ImageScene: React.FC<{
  heading: string;
  body?: string;
  imageUrl: string;
}> = ({ heading, body, imageUrl }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headingSpring = spring({ fps, frame, config: { damping: 12 } });
  const headingScale = interpolate(headingSpring, [0, 1], [0.85, 1]);
  const headingOpacity = interpolate(headingSpring, [0, 1], [0, 1]);

  const imageScale = interpolate(frame, [0, 120], [1, 1.06], {
    extrapolateRight: "clamp",
  });
  const imageOpacity = interpolate(frame, [8, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 14% 16%, rgba(34, 211, 238, 0.18), transparent 36%), radial-gradient(circle at 86% 82%, rgba(167, 139, 250, 0.18), transparent 40%), linear-gradient(180deg, #080a16, #0f1324)",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Manrope, system-ui, sans-serif",
        padding: "60px 80px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(rgba(148,163,184,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.04) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div
        style={{
          opacity: headingOpacity,
          transform: `scale(${headingScale})`,
          color: "#7dd3fc",
          fontSize: 58,
          fontWeight: 800,
          letterSpacing: -1,
          marginBottom: 24,
          textAlign: "center",
          maxWidth: "96%",
          textShadow: "0 8px 30px rgba(56, 189, 248, 0.2)",
        }}
      >
        {heading}
      </div>
      <div
        style={{
          opacity: imageOpacity,
          transform: `scale(${imageScale})`,
          borderRadius: 18,
          overflow: "hidden",
          border: "1px solid rgba(125, 211, 252, 0.25)",
          boxShadow: "0 20px 50px rgba(2, 6, 23, 0.5)",
          maxWidth: "88%",
          maxHeight: 680,
        }}
      >
        <Img
          src={imageUrl}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      {body && (
        <div
          style={{
            opacity: interpolate(frame, [30, 50], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            color: "#c7d6f3",
            fontSize: 42,
            marginTop: 20,
            textAlign: "center",
            maxWidth: "90%",
          }}
        >
          {body}
        </div>
      )}
    </AbsoluteFill>
  );
};
