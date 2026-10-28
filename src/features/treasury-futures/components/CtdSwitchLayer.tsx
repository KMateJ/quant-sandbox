import { DragHandles } from "../../../components/charts";
import type { PlotFrame } from "../../../components/charts";
import { estimateTextWidth, placeLabels, type LabelBox } from "../../../components/charts/labels.logic";
import { formatBp, type CtdSwitch } from "../ctdSwitch.math";

const FONT = 10;
const LABEL_H = 14;
const LABEL_TOP = 24;

/// Chart layer: dotted vertical lines at the CTD switch points with collision-free labels, and the Δy handle.
export default function CtdSwitchLayer({ frame, switches, shiftBp, label, onShift }: {
  frame: PlotFrame;
  switches: CtdSwitch[];
  shiftBp: number;
  label: string;
  onShift: (bp: number) => void;
}) {
  const texts = switches.map((s) => `${s.from}→${s.to} ${formatBp(s.shiftBp)}`);
  const boxes: LabelBox[] = switches.map((s, i) => ({
    id: String(i), x: frame.x(s.shiftBp) + 4, y: LABEL_TOP, w: estimateTextWidth(texts[i], FONT) + 4, h: LABEL_H, priority: -i,
  }));
  const { placed } = placeLabels(boxes, frame.width, frame.height);
  return <g>
    {switches.map((s, i) => {
      const x = frame.x(s.shiftBp);
      const at = placed[String(i)];
      return <g key={i} className="tf-switch-marker">
        <line x1={x} x2={x} y1={0} y2={frame.height} stroke="var(--muted)" strokeDasharray="2 3" />
        {at && <text x={at.x} y={at.y + FONT} fontSize={FONT} fill="var(--text)">{texts[i]}</text>}
      </g>;
    })}
    <DragHandles frame={frame} onChange={(_, v) => v.x !== undefined && onShift(Math.round(v.x / 5) * 5)}
      handles={[{ id: "shift", axis: "x", x: shiftBp, min: -200, max: 200, step: 5, label, format: formatBp }]} />
  </g>;
}
