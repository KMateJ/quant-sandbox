import { useMemo, useState } from "react";
import { ParentSize } from "@visx/responsive";
import { Group } from "@visx/group";
import { scaleBand } from "@visx/scale";
import { axisValues, heatmap, readVar } from "../npvIrr.sensitivity";
import type { HeatmapAxis, ProjectModel } from "../npvIrr.types";

type SensitivityHeatmapProps = {
  model: ProjectModel;
  xAxis: HeatmapAxis;
  yAxis: HeatmapAxis;
  onApply: (xValue: number, yValue: number) => void;
  formatAxis: (axis: HeatmapAxis, v: number) => string;
  valueFormat: (v: number) => string;
};

const STEPS = 11;

function color(npv: number, maxAbs: number): string {
  const r = maxAbs === 0 ? 0 : Math.max(-1, Math.min(1, npv / maxAbs));
  if (r >= 0) return `rgba(34, 197, 94, ${0.12 + 0.75 * r})`;
  return `rgba(239, 68, 68, ${0.12 + 0.75 * -r})`;
}

function Inner(props: SensitivityHeatmapProps & { width: number; height: number }) {
  const { model, xAxis, yAxis, onApply, formatAxis, valueFormat, width, height } = props;
  const [hover, setHover] = useState<{ x: number; y: number; npv: number; cx: number; cy: number } | null>(null);
  const margin = { top: 8, right: 10, bottom: 34, left: 54 };
  const innerW = Math.max(0, width - margin.left - margin.right);
  const innerH = Math.max(0, height - margin.top - margin.bottom);

  const xValues = useMemo(() => axisValues(model, xAxis, STEPS, 0.6), [model, xAxis]);
  const yValues = useMemo(() => axisValues(model, yAxis, STEPS, 0.6), [model, yAxis]);
  const grid = useMemo(() => heatmap(model, xAxis, yAxis, xValues, yValues), [model, xAxis, yAxis, xValues, yValues]);
  const maxAbs = useMemo(() => Math.max(...grid.flat().map((c) => Math.abs(c.npv)), 1), [grid]);

  const xScale = scaleBand({ domain: xValues.map(String), range: [0, innerW], padding: 0.04 });
  const yScale = scaleBand({ domain: yValues.map(String), range: [innerH, 0], padding: 0.04 });
  const baseX = readVar(model, xAxis);
  const baseY = readVar(model, yAxis);
  const nearest = (arr: number[], v: number) => arr.reduce((a, b) => (Math.abs(b - v) < Math.abs(a - v) ? b : a), arr[0]);
  const bx = nearest(xValues, baseX);
  const by = nearest(yValues, baseY);

  return (
    <div style={{ position: "relative", width, height }}>
      <svg width={width} height={height}>
        <Group left={margin.left} top={margin.top}>
          {grid.map((row, yi) =>
            row.map((cell, xi) => {
              const cx = xScale(String(xValues[xi])) ?? 0;
              const cy = yScale(String(yValues[yi])) ?? 0;
              const isBase = xValues[xi] === bx && yValues[yi] === by;
              return (
                <rect
                  key={`${xi}-${yi}`}
                  x={cx}
                  y={cy}
                  width={xScale.bandwidth()}
                  height={yScale.bandwidth()}
                  fill={color(cell.npv, maxAbs)}
                  stroke={isBase ? "#e2e8f0" : "transparent"}
                  strokeWidth={isBase ? 2 : 0}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHover({ x: xValues[xi], y: yValues[yi], npv: cell.npv, cx: cx + margin.left, cy: cy + margin.top })}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => onApply(xValues[xi], yValues[yi])}
                />
              );
            })
          )}
          {yValues.map((v, i) => (i % 2 === 0 ? (
            <text key={v} x={-6} y={(yScale(String(v)) ?? 0) + yScale.bandwidth() / 2} textAnchor="end" dominantBaseline="middle" fill="#94a3b8" fontSize={9}>{formatAxis(yAxis, v)}</text>
          ) : null))}
          {xValues.map((v, i) => (i % 2 === 0 ? (
            <text key={v} x={(xScale(String(v)) ?? 0) + xScale.bandwidth() / 2} y={innerH + 14} textAnchor="middle" fill="#94a3b8" fontSize={9}>{formatAxis(xAxis, v)}</text>
          ) : null))}
        </Group>
      </svg>
      {hover && (
        <div className="npv-heat-tip" style={{ left: Math.min(hover.cx, width - 120), top: Math.max(hover.cy - 46, 2) }}>
          <div>{formatAxis(xAxis, hover.x)} · {formatAxis(yAxis, hover.y)}</div>
          <strong style={{ color: hover.npv >= 0 ? "#86efac" : "#fca5a5" }}>{valueFormat(hover.npv)}</strong>
        </div>
      )}
    </div>
  );
}

/// 2-D NPV heatmap with a diverging scale centred on zero; click a cell to apply it.
export default function SensitivityHeatmap(props: SensitivityHeatmapProps) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <ParentSize>{({ width, height }) => (width > 0 && height > 0 ? <Inner {...props} width={width} height={height} /> : null)}</ParentSize>
    </div>
  );
}
