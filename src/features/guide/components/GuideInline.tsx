import { InlineMath } from "react-katex";
import { Link } from "react-router-dom";
import { guidePath } from "../guide.meta";
import { parseInline, type CitationFinder } from "../guide.inline";

/// Lesson text with inline `$math$`, `**strong**`, `*em*`, and links for quoted lesson titles when `cite` is given.
export default function GuideInline({ text, cite }: { text: string; cite?: CitationFinder }) {
  return (
    <>
      {parseInline(text, cite).map((seg, i) => {
        switch (seg.kind) {
          case "math":
            return <InlineMath key={i} math={seg.value} />;
          case "strong":
            return <strong key={i}>{seg.value}</strong>;
          case "em":
            return <em key={i}>{seg.value}</em>;
          case "link":
            return <Link key={i} className="guide-cite" to={guidePath(seg.lessonId)}>{seg.value}</Link>;
          default:
            return seg.value;
        }
      })}
    </>
  );
}
