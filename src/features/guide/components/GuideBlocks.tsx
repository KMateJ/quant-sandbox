import { BlockMath } from "react-katex";
import type { GuideBlock } from "../guide.content.types";
import type { CitationFinder } from "../guide.inline";
import type { GuideId } from "../guide.types";
import { useCitationFinder } from "../useCitationFinder";
import { guideFigures } from "./figures";
import GuideInline from "./GuideInline";
import GuideTryIt from "./GuideTryIt";

// Quoted lesson titles become links in running text; headings stay plain and lab links cannot nest links.
function Block({ block, cite }: { block: GuideBlock; cite: CitationFinder }) {
  switch (block.kind) {
    case "p":
      return <p><GuideInline text={block.text} cite={cite} /></p>;
    case "h":
      return <h2><GuideInline text={block.text} /></h2>;
    case "math":
      return <BlockMath math={block.tex} />;
    case "note":
      return <p className="guide-note"><GuideInline text={block.text} cite={cite} /></p>;
    case "list": {
      const items = block.items.map((item, i) => <li key={i}><GuideInline text={item} cite={cite} /></li>);
      return block.ordered ? <ol>{items}</ol> : <ul>{items}</ul>;
    }
    case "figure": {
      const Figure = guideFigures[block.id];
      return <Figure />;
    }
    case "lab":
      return <GuideTryIt to={block.to}>{block.text}</GuideTryIt>;
  }
}

/// A lesson body: renders its content blocks as reading text, formulas and figures.
export default function GuideBlocks({ blocks, lessonId }: { blocks: GuideBlock[]; lessonId: GuideId }) {
  const cite = useCitationFinder(lessonId);
  return (
    <div className="guide-content">
      {blocks.map((block, i) => <Block key={i} block={block} cite={cite} />)}
    </div>
  );
}
