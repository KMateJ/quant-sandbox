import { useState, type KeyboardEvent, type PointerEvent } from "react";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { LinePath } from "@visx/shape";
import { binDensity } from "../../lib/stats";
import { CHART_COLORS, chartMargin } from "./chart.theme";
import type { BinRange, HistogramProps } from "./histogram.types";

type Props = Omit<HistogramProps, "height"> & { width: number; height: number };

const TINT_FILL = { accent: "var(--primary)", muted: "var(--border-hover)" } as const;
const tick = { fill: CHART_COLORS.axis, fontSize: 11 };
const ordered = (a: number, b: number): BinRange => (a <= b ? [a, b] : [b, a]);

export default function HistogramInner({ bins, normalize = "count", density, tint, markers = [], selection, onSelectionChange, flash, xFormat, yFormat, ariaLabel, color = "var(--primary)", width, height }: Props) {
  const margin = chartMargin(width < 480);
  const w = Math.max(0, width - margin.left - margin.right);
  const h = Math.max(0, height - margin.top - margin.bottom);
  const [anchor, setAnchor] = useState<number | null>(null);
  const asDensity = normalize === "density" || Boolean(density);
  const heights = asDensity ? binDensity(bins) : bins.map((b) => b.count);
  const lo = bins[0]?.x0 ?? 0;
  const hi = bins[bins.length - 1]?.x1 ?? 1;
  const peak = Math.max(asDensity ? 1e-9 : 1, ...heights, ...(density ?? []).map((p) => p.y));
  const x = scaleLinear({ domain: [lo, hi], range: [0, w] });
  const y = scaleLinear({ domain: [0, peak * 1.1], range: [h, 0], nice: true });
  const selectable = Boolean(onSelectionChange);

  const indexAt = (event: PointerEvent<SVGRectElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const v = x.invert(Math.min(w, Math.max(0, event.clientX - box.left)));
    return Math.min(bins.length - 1, Math.max(0, Math.floor(((v - lo) / (hi - lo)) * bins.length)));
  };
  const onDown = (event: PointerEvent<SVGRectElement>) => {
    if (!selectable) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const i = indexAt(event);
    if (selection && selection[0] === i && selection[1] === i) return onSelectionChange!(null);
    setAnchor(i);
    onSelectionChange!([i, i]);
  };
  const onMove = (event: PointerEvent<SVGRectElement>) => {
    if (anchor !== null) onSelectionChange!(ordered(anchor, indexAt(event)));
  };
  const onKey = (event: KeyboardEvent<SVGSVGElement>) => {
    if (!selectable) return;
    if (event.key === "Escape") return onSelectionChange!(null);
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const [a, b] = selection ?? [-1, -1];
    const clamp = (i: number) => Math.min(bins.length - 1, Math.max(0, i));
    // Shift extends the range; plain arrows move a one-bin selection.
    onSelectionChange!(event.shiftKey && selection ? ordered(a, clamp(b + step)) : [clamp(b + step), clamp(b + step)]);
  };

  return (
    <svg width={width} height={height} role={selectable ? "group" : "img"} aria-label={ariaLabel} tabIndex={selectable ? 0 : undefined} onKeyDown={onKey}>
      <Group left={margin.left} top={margin.top}>
        {bins.map((b, i) => {
          const top = y(heights[i]);
          const inSel = selection ? i >= selection[0] && i <= selection[1] : false;
          const fill = tint?.(b, i);
          return (
            <rect key={i} x={x(b.x0) + 0.5} y={top} width={Math.max(0, x(b.x1) - x(b.x0) - 1)} height={Math.max(0, h - top)}
              fill={fill ? TINT_FILL[fill] : color} fillOpacity={selection && !inSel ? 0.25 : fill === "muted" ? 0.6 : 0.85} />
          );
        })}
        {flash && bins[flash.index] && (
          <rect key={flash.key} x={x(bins[flash.index].x0)} y={0} width={x(bins[flash.index].x1) - x(bins[flash.index].x0)} height={h} fill="var(--primary)" opacity={0} pointerEvents="none">
            <animate attributeName="opacity" values="0.35;0" dur="0.6s" fill="freeze" />
          </rect>
        )}
        {density && <LinePath data={density} x={(p) => x(p.x)} y={(p) => y(p.y)} stroke="var(--text)" strokeWidth={1.75} />}
        {markers.map((m) => (
          <g key={`${m.value}-${m.label ?? ""}`}>
            <line x1={x(m.value)} x2={x(m.value)} y1={0} y2={h} stroke={m.color ?? "var(--text)"} strokeWidth={1.5} strokeDasharray={m.dash} />
            {m.label && <text x={x(m.value) + 4} y={11} fontSize={11} fill={m.color ?? "var(--text)"}>{m.label}</text>}
          </g>
        ))}
        {selectable && (
          <rect x={0} y={0} width={w} height={h} fill="transparent" style={{ cursor: "col-resize", touchAction: "none" }}
            onPointerDown={onDown} onPointerMove={onMove} onPointerUp={() => setAnchor(null)} onPointerCancel={() => setAnchor(null)} />
        )}
        <AxisLeft scale={y} numTicks={4} tickFormat={(v) => (yFormat ? yFormat(Number(v)) : String(v))} stroke={CHART_COLORS.axis} tickStroke={CHART_COLORS.axis} tickLabelProps={() => ({ ...tick, textAnchor: "end", dx: -4, dy: 3 })} />
        <AxisBottom top={h} scale={x} numTicks={width < 480 ? 5 : 8} tickFormat={(v) => (xFormat ? xFormat(Number(v)) : String(v))} stroke={CHART_COLORS.axis} tickStroke={CHART_COLORS.axis} tickLabelProps={() => ({ ...tick, textAnchor: "middle" })} />
      </Group>
    </svg>
  );
}
