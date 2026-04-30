import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import type { FlowConfig } from "./types";
import { getEntityEmojiIcon, getEntityToken } from "../designTokens";

const ACTOR_WIDTH = 160;
const ACTOR_HEIGHT = 80;
const STEP_DURATION = 60; // frames per step
const INTRO_DURATION = 60;

// Calculate actor X positions based on count
function getActorPositions(count: number, totalWidth: number) {
  const spacing = totalWidth / (count + 1);
  return Array.from({ length: count }, (_, i) => spacing * (i + 1));
}

export const ClientServerFlow: React.FC<{
  config: FlowConfig;
}> = ({ config }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const { actors, steps, title, subtitle } = config;
  const actorVisuals = actors.map((actor) => {
    const token = actor.entityId ? getEntityToken(actor.entityId) : undefined;
    return {
      icon: actor.entityId ? getEntityEmojiIcon(actor.entityId, actor.icon) : actor.icon,
      color: token?.colors.primary ?? actor.color,
    };
  });
  const positions = getActorPositions(actors.length, width);
  const actorY = 140;
  const arrowYStart = actorY + ACTOR_HEIGHT + 30;
  const arrowSpacing = Math.min(
    60,
    (height - arrowYStart - 80) / steps.length
  );

  // Title animation
  const titleScale = spring({ fps, frame, config: { damping: 12 } });
  const subtitleOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a1a",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 30,
          left: 0,
          right: 0,
          textAlign: "center",
          transform: `scale(${titleScale})`,
        }}
      >
        <div style={{ color: "#fff", fontSize: 36, fontWeight: 700 }}>
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              color: "#6366f1",
              fontSize: 18,
              marginTop: 6,
              opacity: subtitleOpacity,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>

      {/* Actor blocks */}
      {actors.map((actor, i) => {
        const visual = actorVisuals[i];
        const actorSpring = spring({
          fps,
          frame: frame - i * 5,
          config: { damping: 14 },
        });
        const scale = interpolate(actorSpring, [0, 1], [0.5, 1]);
        const opacity = interpolate(actorSpring, [0, 1], [0, 1]);

        return (
          <div
            key={actor.id}
            style={{
              position: "absolute",
              left: positions[i] - ACTOR_WIDTH / 2,
              top: actorY,
              width: ACTOR_WIDTH,
              height: ACTOR_HEIGHT,
              backgroundColor: visual.color + "22",
              border: `2px solid ${visual.color}`,
              borderRadius: 12,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              transform: `scale(${scale})`,
              opacity,
            }}
          >
            <div style={{ fontSize: 28 }}>{visual.icon}</div>
            <div
              style={{
                color: visual.color,
                fontSize: 16,
                fontWeight: 600,
                marginTop: 2,
              }}
            >
              {actor.label}
            </div>
          </div>
        );
      })}

      {/* Vertical lifelines */}
      {actors.map((actor, i) => {
        const visual = actorVisuals[i];
        const lineOpacity = interpolate(frame, [30, 50], [0, 0.2], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={`line-${actor.id}`}
            style={{
              position: "absolute",
              left: positions[i] - 1,
              top: actorY + ACTOR_HEIGHT,
              width: 2,
              height: height - actorY - ACTOR_HEIGHT - 40,
              backgroundColor: visual.color,
              opacity: lineOpacity,
            }}
          />
        );
      })}

      {/* Animated arrows for each step */}
      {steps.map((step, stepIdx) => {
        const stepStart = INTRO_DURATION + stepIdx * STEP_DURATION;
        const fromIdx = actors.findIndex((a) => a.id === step.from);
        const toIdx = actors.findIndex((a) => a.id === step.to);
        if (fromIdx === -1 || toIdx === -1) return null;

        const fromX = positions[fromIdx];
        const toX = positions[toIdx];
        const y = arrowYStart + stepIdx * arrowSpacing;

        // Animation progress for this step
        const progress = interpolate(
          frame,
          [stepStart, stepStart + 25],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        const labelOpacity = interpolate(
          frame,
          [stepStart + 10, stepStart + 25],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        // Highlight: current step is brighter
        const isCurrent =
          frame >= stepStart && frame < stepStart + STEP_DURATION;
        const pastOpacity = isCurrent
          ? 1
          : frame > stepStart + STEP_DURATION
            ? 0.4
            : 0;

        const arrowColor = step.color || "#6366f1";
        const isLeftToRight = toX > fromX;
        const arrowWidth = Math.abs(toX - fromX);
        const drawnWidth = arrowWidth * progress;

        // Step number
        const numOpacity = interpolate(
          frame,
          [stepStart, stepStart + 15],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
          <div key={stepIdx} style={{ opacity: progress > 0 ? Math.max(pastOpacity, progress) : 0 }}>
            {/* Step number */}
            <div
              style={{
                position: "absolute",
                left: 40,
                top: y - 12,
                width: 28,
                height: 28,
                borderRadius: "50%",
                backgroundColor: arrowColor,
                color: "#fff",
                fontSize: 14,
                fontWeight: 700,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                opacity: numOpacity,
              }}
            >
              {stepIdx + 1}
            </div>

            {/* Arrow line */}
            <div
              style={{
                position: "absolute",
                left: isLeftToRight ? fromX : toX + (arrowWidth - drawnWidth),
                top: y,
                width: drawnWidth,
                height: 3,
                backgroundColor: arrowColor,
                borderRadius: 2,
              }}
            />

            {/* Arrowhead */}
            {progress > 0.8 && (
              <div
                style={{
                  position: "absolute",
                  left: toX + (isLeftToRight ? -12 : 0),
                  top: y - 6,
                  fontSize: 16,
                  color: arrowColor,
                  opacity: interpolate(progress, [0.8, 1], [0, 1]),
                }}
              >
                {isLeftToRight ? "▶" : "◀"}
              </div>
            )}

            {/* Label */}
            <div
              style={{
                position: "absolute",
                left: Math.min(fromX, toX),
                top: y - 22,
                width: arrowWidth,
                textAlign: "center",
                opacity: labelOpacity,
              }}
            >
              <span
                style={{
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 600,
                  backgroundColor: "#0a0a1a",
                  padding: "2px 10px",
                  borderRadius: 4,
                }}
              >
                {step.label}
              </span>
              {step.sublabel && (
                <div
                  style={{
                    color: "#9ca3af",
                    fontSize: 12,
                    marginTop: 2,
                  }}
                >
                  {step.sublabel}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
