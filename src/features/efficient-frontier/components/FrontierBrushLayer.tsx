import { useState, type PointerEvent } from "react";
import type { PlotFrame } from "../../../components/charts";
import { CHART_COLORS } from "../../../components/charts/chart.theme";
import { useI18n } from "../../../i18n";
import { nearestIndex2D } from "../frontierBrush.math";
import { useBrushHandlers, type FrontierBrush } from "../useFrontierBrush";
import { SELECTED_COLOR, pointReadout } from "./frontierChart.style";

type Props = { frame: PlotFrame; brush: FrontierBrush };

/// Brush along the constrained frontier inside the scatter's `layer`: a wide invisible band over the
/// curve previews the nearest portfolio on hover, press/drag scrubs the selection, arrows step it.
export default function FrontierBrushLayer({ frame, brush }: Props) {
  const { t } = useI18n();
  const [focused, setFocused] = useState(false);
  const pts = brush.branch.map((p) => ({ x: frame.x(p.vol), y: frame.y(p.ret) }));

  // Pointer position in plot pixels, independent of how the SVG is scaled.
  const handlers = useBrushHandlers(brush, (e: PointerEvent<Element>) => {
    const svg = (e.currentTarget as SVGGraphicsElement).ownerSVGElement;
    const m = svg?.getScreenCTM();
    if (!m) return brush.selectedIndex;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    return nearestIndex2D(pts, p.x - frame.left, p.y - frame.top);
  });

  if (pts.length < 2) return null;
  const hover = brush.hoverIndex != null ? pts[brush.hoverIndex] : null;
  const ring = hover ?? (focused ? pts[brush.selectedIndex] : null);
  const label = hover ? pointReadout(t, brush.active) : null;
  const flip = hover != null && hover.x > frame.width - 150;

  return (
    <g
      className="opt-brush"
      tabIndex={0}
      role="slider"
      aria-label={t("optBrushAria")}
      aria-valuemin={0}
      aria-valuemax={pts.length - 1}
      aria-valuenow={brush.selectedIndex}
      aria-valuetext={pointReadout(t, brush.branch[brush.selectedIndex])}
      style={{ cursor: "pointer", touchAction: "none" }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      {...handlers}
    >
      <polyline
        points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
        fill="none"
        stroke="transparent"
        strokeWidth={24}
        strokeLinecap="round"
        strokeLinejoin="round"
        pointerEvents="stroke"
      />
      {ring && (
        <circle cx={ring.x} cy={ring.y} r={11} fill="none" stroke={hover ? CHART_COLORS.tooltipText : SELECTED_COLOR} strokeWidth={2} pointerEvents="none" />
      )}
      {hover && label && (
        <text
          className="opt-brush-label"
          x={hover.x + (flip ? -16 : 16)}
          y={hover.y + 20}
          textAnchor={flip ? "end" : "start"}
          pointerEvents="none"
        >
          {label}
        </text>
      )}
    </g>
  );
}
