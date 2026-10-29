import { useState } from "react";
import { AxisLeft } from "@visx/axis";
import { Group } from "@visx/group";
import { GridRows } from "@visx/grid";
import { scaleBand, scaleLinear } from "@visx/scale";
import { CHART_COLORS, chartMargin } from "./chart.theme";
import DraggableBar from "./DraggableBar";
import { paddedDomain } from "./draggableBars.logic";

export type DraggableBarsProps = {
  values: number[];
  onChange: (index: number, value: number) => void;
  /// Drag range of every bar (see `limits` for per-bar ranges).
  min: number;
  max: number;
  step?: number;
  /// Lighter bars drawn behind, in the same units (e.g. present values).
  shadows?: number[];
  /// Value axis; defaults to the drag range with headroom. It stays fixed during a drag either way.
  domain?: [number, number];
  /// Narrower range for some bars, e.g. an outlay that must stay negative.
  limits?: (index: number) => [number, number];
  xLabels?: string[];
  barAriaLabel: (index: number) => string;
  valueFormat?: (v: number) => string;
  yFormat?: (v: number) => string;
  ariaLabel: string;
  colors?: { positive?: string; negative?: string };
};

type Props = DraggableBarsProps & { width: number; height: number };

const tick = { fill: CHART_COLORS.axis, fontSize: 12 };

/// Bars around a zero line that the reader drags into shape.
export default function DraggableBarsInner({ values, onChange, min, max, step = 1, shadows, domain, limits, xLabels, barAriaLabel, valueFormat = (v) => String(v), yFormat, ariaLabel, colors, width, height }: Props) {
  // While a bar is dragged, the axis keeps the domain it had at the start, so the bar follows the pointer.
  const [frozen, setFrozen] = useState<[number, number] | null>(null);
  const live = domain ?? paddedDomain(min, max);
  const [lo, hi] = frozen ?? live;
  // Room for the widest tick label (≈ 7.5 px per character at 12 px), so long values aren't clipped on phones.
  const fmtTick = (v: number) => (yFormat ? yFormat(v) : String(v));
  const labelW = Math.max(fmtTick(lo).length, fmtTick(hi).length) * 7.5 + 14;
  const base = chartMargin(width < 480);
  const margin = { ...base, left: Math.max(base.left, labelW) };
  const innerW = Math.max(0, width - margin.left - margin.right);
  const innerH = Math.max(0, height - margin.top - margin.bottom - 4);
  const idx = values.map((_, i) => i);
  const x = scaleBand({ domain: idx, range: [0, innerW], padding: 0.22 });
  const y = scaleLinear({ domain: [lo, hi], range: [innerH, 0] });
  const zeroY = y(Math.min(hi, Math.max(lo, 0)));
  const palette = { positive: colors?.positive ?? "var(--chart-1)", negative: colors?.negative ?? "var(--chart-4)" };
  const labelEvery = Math.ceil(values.length / Math.max(1, Math.floor(innerW / 28)));

  return (
    <svg width={width} height={height} role="group" aria-label={ariaLabel} style={{ touchAction: "none" }}>
      <Group left={margin.left} top={margin.top}>
        <GridRows scale={y} width={innerW} numTicks={6} stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
        <line x1={0} x2={innerW} y1={zeroY} y2={zeroY} stroke="var(--border-hover)" strokeWidth={1.5} />
        {idx.map((i) => (
          <DraggableBar
            key={i}
            x={x(i) ?? 0}
            width={x.bandwidth()}
            plotHeight={innerH}
            zeroY={zeroY}
            y={y}
            valueFromY={(py) => y.invert(py)}
            value={values[i]}
            shadow={shadows?.[i]}
            limits={limits?.(i) ?? [min, max]}
            step={step}
            label={barAriaLabel(i)}
            valueText={valueFormat(values[i])}
            colors={palette}
            onChange={(v) => onChange(i, v)}
            onDragStart={() => setFrozen(frozen ?? live)}
            onDragEnd={() => setFrozen(null)}
          />
        ))}
        {idx.map((i) => i % labelEvery === 0 && (
          <text key={i} x={(x(i) ?? 0) + x.bandwidth() / 2} y={innerH + 18} textAnchor="middle" fontSize={12} fill="var(--muted)">
            {xLabels?.[i] ?? i}
          </text>
        ))}
        <AxisLeft scale={y} numTicks={6} tickFormat={(v) => fmtTick(Number(v))} stroke={CHART_COLORS.axis} tickStroke={CHART_COLORS.axis}
          tickLabelProps={() => ({ ...tick, textAnchor: "end", dx: "-0.25em", dy: "0.25em" })} />
      </Group>
    </svg>
  );
}
