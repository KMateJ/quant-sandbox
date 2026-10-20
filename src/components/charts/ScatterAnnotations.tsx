import { useMemo } from "react";
import { CHART_COLORS } from "./chart.theme";
import { layoutAnnotations } from "./annotations.logic";
import type { ScatterAnnotation, ScatterSeries } from "./chart.types";

type Props = {
  annotations: ScatterAnnotation[];
  series: ScatterSeries[];
  x: (v: number) => number;
  y: (v: number) => number;
  width: number;
  height: number;
  isMobile: boolean;
  /// Nudge or hide labels that would sit on a curve or another label.
  avoidCollisions?: boolean;
};

/// Text labels placed at data coordinates, optionally kept clear of the curves.
export default function ScatterAnnotations({ annotations, series, x, y, width, height, isMobile, avoidCollisions = false }: Props) {
  const defaultFont = isMobile ? 10 : 12;
  const laidOut = useMemo(() => {
    if (!avoidCollisions) return null;
    // Markers are single points, not curves; only lines can be sat on.
    const curves = series.filter((s) => s.points.length > 1).map((s) => s.points.map((p) => ({ x: x(p.x), y: y(p.y) })));
    return layoutAnnotations(annotations, curves, { x, y }, { width, height }, defaultFont);
  }, [annotations, series, x, y, width, height, defaultFont, avoidCollisions]);

  return (
    <>
      {annotations.map((a, i) => {
        const spot = laidOut?.[i];
        if (spot?.hidden) return null;
        const tx = spot?.x ?? x(a.x) + (a.dx ?? 0);
        const ty = spot?.y ?? y(a.y) + (a.dy ?? 0);
        return (
          <text
            key={`ann-${i}`}
            x={tx}
            y={ty}
            textAnchor={a.anchor ?? "start"}
            fill={a.color ?? CHART_COLORS.tooltipText}
            fontSize={a.fontSize ?? defaultFont}
            fontWeight={a.fontWeight ?? 600}
            transform={a.rotate ? `rotate(${a.rotate} ${tx} ${ty})` : undefined}
            style={{ pointerEvents: "none" }}
          >
            {a.text}
          </text>
        );
      })}
    </>
  );
}
