import { Scene } from "./types";
import { TitleScene } from "./scenes/TitleScene";
import { SectionScene } from "./scenes/SectionScene";
import { CodeScene } from "./scenes/CodeScene";
import { ListScene } from "./scenes/ListScene";
import { MermaidScene } from "./scenes/MermaidScene";
import { OutroScene } from "./scenes/OutroScene";
import { ImageScene } from "./scenes/ImageScene";
import { QuoteScene } from "./scenes/QuoteScene";
import { ComparisonScene } from "./scenes/ComparisonScene";
import { TimelineScene } from "./scenes/TimelineScene";
import { HighlightScene } from "./scenes/HighlightScene";

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
    case "mermaid":
      return (
        <MermaidScene
          heading={scene.heading}
          body={scene.body}
          chart={scene.chart!}
        />
      );
    case "image":
      return (
        <ImageScene
          heading={scene.heading}
          body={scene.body}
          imageUrl={scene.imageUrl!}
        />
      );
    case "quote":
      return (
        <QuoteScene
          heading={scene.heading}
          body={scene.body!}
          attribution={scene.attribution}
        />
      );
    case "comparison":
      return (
        <ComparisonScene
          heading={scene.heading}
          leftLabel={scene.leftLabel!}
          rightLabel={scene.rightLabel!}
          leftItems={scene.leftItems!}
          rightItems={scene.rightItems!}
        />
      );
    case "timeline":
      return (
        <TimelineScene
          heading={scene.heading}
          items={scene.items!}
        />
      );
    case "highlight":
      return (
        <HighlightScene
          heading={scene.heading}
          items={scene.items!}
        />
      );
    case "outro":
      return <OutroScene heading={scene.heading} />;
    default:
      return null;
  }
};
