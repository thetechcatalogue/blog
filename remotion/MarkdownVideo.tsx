import { Series } from "remotion";
import { Scene } from "./types";
import { SceneRenderer } from "./SceneRenderer";

export const MarkdownVideo: React.FC<{ scenes: Scene[] }> = ({ scenes }) => {
  return (
    <Series>
      {scenes.map((scene, i) => (
        <Series.Sequence key={i} durationInFrames={scene.duration}>
          <SceneRenderer scene={scene} />
        </Series.Sequence>
      ))}
    </Series>
  );
};
