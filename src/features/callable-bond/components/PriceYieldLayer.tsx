import { DragHandles, type PlotFrame } from "../../../components/charts";
import { estimateTextWidth, placeLabels, type LabelBox } from "../../../components/charts/labels.logic";
import { useI18n } from "../../../i18n";
import { pct } from "../callableFormat";
import { widestGap } from "../callable.math";
import { Y_MAX, Y_MIN } from "../callable.url";
import type { CallableModel } from "../useCallable";

const FONT = 11;
const LABEL_H = 14;

/// Chart overlay: the call's value between the curves, the negative-convexity band, the point on the callable
/// curve and the draggable yield handle.
export default function PriceYieldLayer({ frame, lab }: { frame: PlotFrame; lab: CallableModel }) {
  const { t } = useI18n();
  const { curve, ranges, now, y } = lab;
  const gap = widestGap(curve);
  const outline = [
    ...curve.map((p) => `${frame.x(p.y)},${frame.y(p.straight)}`),
    ...[...curve].reverse().map((p) => `${frame.x(p.y)},${frame.y(p.callable)}`),
  ].join(" ");

  const texts = { call: t("cbCallValue"), neg: t("cbNegConvexity") };
  const callBox: LabelBox = { id: "call", x: frame.x(gap.y) + 8, y: frame.y(gap.straight) - LABEL_H - 4, w: estimateTextWidth(texts.call, FONT), h: LABEL_H, priority: 1 };
  const negBoxes: LabelBox[] = ranges.map(([lo], i) => ({
    id: `neg${i}`, x: frame.x(lo) + 4, y: frame.height - LABEL_H - 4, w: estimateTextWidth(texts.neg, FONT), h: LABEL_H, priority: 2,
  }));
  const handleBox: LabelBox = { id: "h", x: frame.x(y) - 14, y: 0, w: 120, h: 24, priority: 9 };
  const { placed } = placeLabels([callBox, ...negBoxes], frame.width, frame.height, [handleBox]);

  return (
    <g>
      <g className="cb-shading" pointerEvents="none">
        {ranges.map(([lo, hi], i) => (
          <rect key={i} className="cb-neg" x={frame.x(lo)} y={0} width={Math.max(0, frame.x(hi) - frame.x(lo))} height={frame.height} />
        ))}
        <polygon className="cb-gap" points={outline} />
        {placed.call && <text className="cb-label" x={placed.call.x} y={placed.call.y + FONT}>{texts.call}</text>}
        {negBoxes.map((b) => placed[b.id] && <text key={b.id} className="cb-label cb-label--neg" x={placed[b.id].x} y={placed[b.id].y + FONT}>{texts.neg}</text>)}
        <circle className="cb-point" cx={frame.x(y)} cy={frame.y(now.callable)} r={4.5} />
      </g>
      <DragHandles
        frame={frame}
        handles={[{ id: "y", axis: "x", x: y, min: Y_MIN, max: Y_MAX, step: 0.0005, label: t("cbHandle"), format: (v) => pct(v) }]}
        onChange={(_, v) => v.x !== undefined && lab.setY(v.x)}
      />
    </g>
  );
}
