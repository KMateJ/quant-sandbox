import { useMemo, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Group } from "@visx/group";
import { scaleBand } from "@visx/scale";
import { CHART_COLORS } from "./chart.theme";
import { cellPaint, nearestIndex, stepCell } from "./heatmap.logic";

export type HeatmapPickerProps = {
  xValues: number[];
  yValues: number[];
  value: (x: number, y: number) => number;
  /// The current inputs; the nearest cell is outlined.
  selected?: { x: number; y: number };
  onPick: (x: number, y: number) => void;
  /// "diverging" colours by sign around `center` (e.g. NPV around 0); "sequential" by magnitude.
  scale?: "diverging" | "sequential";
  center?: number;
  xLabel: string;
  yLabel: string;
  xFormat?: (v: number) => string;
  yFormat?: (v: number) => string;
  valueFormat?: (v: number) => string;
  ariaLabel: string;
  /// Cells for which this returns false (or whose value is not finite) get a neutral fill and can't be picked.
  isValid?: (x: number, y: number) => boolean;
  /// Maps a value before colouring, e.g. Math.log when values span orders of magnitude; labels keep the raw value.
  colorTransform?: (v: number) => number;
};

type Props = HeatmapPickerProps & { width: number; height: number };
const MARGIN = { top: 22, right: 10, bottom: 38, left: 58 };
const label = { fill: CHART_COLORS.axis, fontSize: 10 };

export default function HeatmapPickerInner({ xValues, yValues, value, selected, onPick, scale = "diverging", center = 0, xLabel, yLabel, xFormat = String, yFormat = String, valueFormat = (v) => v.toFixed(2), ariaLabel, isValid, colorTransform = (v) => v, width, height }: Props) {
  const w = Math.max(0, width - MARGIN.left - MARGIN.right);
  const h = Math.max(0, height - MARGIN.top - MARGIN.bottom);
  const grid = useMemo(() => yValues.map((y) => xValues.map((x) => value(x, y))), [xValues, yValues, value]);
  const ok = (xi: number, yi: number) => Number.isFinite(grid[yi][xi]) && (isValid?.(xValues[xi], yValues[yi]) ?? true);
  const flat = grid.flatMap((row, yi) => row.filter((_, xi) => ok(xi, yi)).map(colorTransform));
  const [min, max] = flat.length ? [Math.min(...flat), Math.max(...flat)] : [0, 1];
  const xs = scaleBand({ domain: xValues.map((_, i) => i), range: [0, w], padding: 0.04 });
  const ys = scaleBand({ domain: yValues.map((_, i) => i), range: [h, 0], padding: 0.04 });
  const sel = selected ? [nearestIndex(xValues, selected.x), nearestIndex(yValues, selected.y)] : null;
  const [focus, setFocus] = useState<[number, number] | null>(null);
  const [dragging, setDragging] = useState(false);
  const shown = focus ?? sel;

  const cellAt = (event: PointerEvent<SVGRectElement>): [number, number] => {
    const box = event.currentTarget.getBoundingClientRect();
    const xi = Math.floor(((event.clientX - box.left) / box.width) * xValues.length);
    const yi = yValues.length - 1 - Math.floor(((event.clientY - box.top) / box.height) * yValues.length);
    return [Math.min(xValues.length - 1, Math.max(0, xi)), Math.min(yValues.length - 1, Math.max(0, yi))];
  };
  const pick = ([xi, yi]: [number, number]) => ok(xi, yi) && onPick(xValues[xi], yValues[yi]);
  const onKey = (event: KeyboardEvent<SVGSVGElement>) => {
    const from = focus ?? sel ?? [0, 0];
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); return pick(from as [number, number]); }
    const next = stepCell(event.key, from[0], from[1], xValues.length, yValues.length);
    if (next) { event.preventDefault(); setFocus(next); }
  };
  const tip = shown && grid[shown[1]] ? `${xLabel} ${xFormat(xValues[shown[0]])} · ${yLabel} ${yFormat(yValues[shown[1]])}: ${ok(shown[0], shown[1]) ? valueFormat(grid[shown[1]][shown[0]]) : "–"}` : "";

  return (
    <svg width={width} height={height} role="group" aria-label={`${ariaLabel}. ${tip}`} tabIndex={0} onKeyDown={onKey} onBlur={() => setFocus(null)}>
      <Group left={MARGIN.left} top={MARGIN.top}>
        {grid.map((row, yi) => row.map((v, xi) => {
          const paint = ok(xi, yi) ? cellPaint(colorTransform(v), scale, colorTransform(center), min, max) : { fill: "var(--surface-muted)", opacity: 1 };
          return <rect key={`${xi}-${yi}`} x={xs(xi)} y={ys(yi)} width={xs.bandwidth()} height={ys.bandwidth()} fill={paint.fill} fillOpacity={paint.opacity} />;
        }))}
        {[sel, focus].map((c, k) => c && (
          <rect key={k} x={xs(c[0])} y={ys(c[1])} width={xs.bandwidth()} height={ys.bandwidth()} fill="none"
            stroke={k === 0 ? "var(--text)" : "var(--primary)"} strokeWidth={2} strokeDasharray={k === 1 ? "3 2" : undefined} pointerEvents="none" />
        ))}
        <rect x={0} y={0} width={w} height={h} fill="transparent" style={{ cursor: "crosshair", touchAction: "none" }}
          onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); setDragging(true); pick(cellAt(e)); }}
          onPointerMove={(e) => (dragging ? pick(cellAt(e)) : setFocus(cellAt(e)))}
          onPointerUp={() => setDragging(false)} onPointerLeave={() => !dragging && setFocus(null)} />
        {yValues.map((v, i) => (i % 2 === 0 || yValues.length < 8) && (
          <text key={`y${i}`} x={-6} y={(ys(i) ?? 0) + ys.bandwidth() / 2} textAnchor="end" dominantBaseline="middle" {...label}>{yFormat(v)}</text>
        ))}
        {xValues.map((v, i) => (i % 2 === 0 || xValues.length < 8) && (
          <text key={`x${i}`} x={(xs(i) ?? 0) + xs.bandwidth() / 2} y={h + 14} textAnchor="middle" {...label}>{xFormat(v)}</text>
        ))}
        <text x={w / 2} y={h + 32} textAnchor="middle" {...label} fontSize={11}>{xLabel}</text>
        <text transform={`translate(${-46} ${h / 2}) rotate(-90)`} textAnchor="middle" {...label} fontSize={11}>{yLabel}</text>
        {shown && grid[shown[1]] && (
          <text x={w} y={-8} textAnchor="end" fontSize={11} fill="var(--muted)" pointerEvents="none">
            {xFormat(xValues[shown[0]])} · {yFormat(yValues[shown[1]])}: <tspan fill="var(--text)" fontWeight={600}>{ok(shown[0], shown[1]) ? valueFormat(grid[shown[1]][shown[0]]) : "–"}</tspan>
          </text>
        )}
      </Group>
    </svg>
  );
}
