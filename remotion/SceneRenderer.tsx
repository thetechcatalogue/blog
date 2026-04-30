import { Scene } from "./types";
import { TitleScene } from "./scenes/TitleScene";
import { SectionScene } from "./scenes/SectionScene";
import { CodeScene } from "./scenes/CodeScene";
import { ListScene } from "./scenes/ListScene";
import { OutroScene } from "./scenes/OutroScene";

export const SceneRenderer: React.FC<{ scene: Scene }> = ({ scene }) => {
  switch (scene.type) {
    case "title":
      return <TitleScene heading={scene.heading} subtitle={scene.body} />;
    case "section":
      return <SectionScene heading={scene.heading} body={scene.body} />;
    case "code":
      return (
        <CodeScene
          heading={scene.heading}
          body={scene.body}
          code={scene.code!}
          language={scene.language}
          duration={scene.duration}
        />
      );
    case "list":
      return (
        <ListScene
          heading={scene.heading}
          body={scene.body}
          items={scene.items!}
        />
      );
    case "outro":
      return <OutroScene heading={scene.heading} />;
    default:
      return null;
  }
};
