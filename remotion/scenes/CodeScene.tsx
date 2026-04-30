import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";

export const CodeScene: React.FC<{
  heading: string;
  body?: string;
  code: string;
  language?: string;
  duration: number;
}> = ({ heading, code, language, duration }) => {
  const frame = useCurrentFrame();
  useVideoConfig();

  const codeLines = code.split("\n");
  const visibleLines = Math.floor(
    interpolate(frame, [10, duration - 30], [0, codeLines.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const headingOpacity = interpolate(frame, [0, 15], [0, 1], {
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
          opacity: headingOpacity,
          color: "#6366f1",
          fontSize: 36,
          fontWeight: 700,
          marginBottom: 30,
        }}
      >
        {heading}
      </div>
      <div
        style={{
          backgroundColor: "#1e1e2e",
          borderRadius: 16,
          padding: 32,
          width: "75%",
          position: "relative",
        }}
      >
        {language && (
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 16,
              color: "#6366f1",
              fontSize: 14,
              fontFamily: "monospace",
              opacity: 0.7,
            }}
          >
            {language}
          </div>
        )}
        <pre
          style={{
            margin: 0,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontSize: 22,
            lineHeight: 1.6,
            color: "#e2e8f0",
          }}
        >
          {codeLines
            .slice(0, visibleLines)
            .map((line, i) => {
              const lineOpacity = interpolate(
                frame,
                [10 + i * (duration - 40) / codeLines.length, 10 + (i + 1) * (duration - 40) / codeLines.length],
                [0.3, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
              return (
                <div key={i} style={{ opacity: lineOpacity }}>
                  {line || " "}
                </div>
              );
            })}
        </pre>
      </div>
    </AbsoluteFill>
  );
};
