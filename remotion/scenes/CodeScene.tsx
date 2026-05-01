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
        background:
          "radial-gradient(circle at 14% 14%, rgba(34, 211, 238, 0.2), transparent 38%), radial-gradient(circle at 84% 18%, rgba(167, 139, 250, 0.2), transparent 40%), linear-gradient(180deg, #080a16, #0f1324)",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Manrope, system-ui, sans-serif",
        padding: "0 72px",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(rgba(148,163,184,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.035) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div
        style={{
          opacity: headingOpacity,
          color: "#7dd3fc",
          fontSize: 72,
          fontWeight: 800,
          letterSpacing: -1,
          marginBottom: 26,
          textAlign: "center",
          maxWidth: "90%",
        }}
      >
        {heading}
      </div>
      <div
        style={{
          backgroundColor: "rgba(4, 10, 30, 0.78)",
          border: "1px solid rgba(125, 211, 252, 0.32)",
          borderRadius: 22,
          boxShadow: "0 24px 60px rgba(2, 6, 23, 0.45)",
          backdropFilter: "blur(8px)",
          padding: 34,
          width: "92%",
          minHeight: 680,
          position: "relative",
        }}
      >
        {language && (
          <div
            style={{
              position: "absolute",
              top: 14,
              right: 18,
              color: "#67e8f9",
              fontSize: 24,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              fontWeight: 700,
              opacity: 0.88,
            }}
          >
            {language}
          </div>
        )}
        <pre
          style={{
            margin: 0,
            fontFamily: "'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            fontSize: 34,
            lineHeight: 1.5,
            color: "#e2ebff",
            paddingTop: 22,
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
