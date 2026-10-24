import { AxisLeft } from "@visx/axis";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { CHART_COLORS, chartMargin } from "../../../components/charts/chart.theme";
import type { LadderRow } from "../swap.math";
import { compact, money, years } from "../swapFormat";

type Props = {
  rows: LadderRow[];
  width: number;
  height: number;
  selected: number | null;
  onSelect: (i: number | null) => void;
  label: (row: LadderRow) => string;
  ariaLabel: string;
};

const COLOR = { floating: "var(--chart-1)", fixed: "var(--chart-3)" };

/// One column per payment: floating leg and fixed leg as bars (received above zero, paid below), each with
/// its present value as a solid inner bar, and a tick at the net amount. Columns are focusable.
export default function LegLadderInner({ rows, width, height, selected, onSelect, label, ariaLabel }: Props) {
  const narrow = width < 480;
  const margin = { ...chartMargin(narrow), bottom: 26 };
  const w = Math.max(0, width - margin.left - margin.right);
  const h = Math.max(0, height - margin.top - margin.bottom);
  const max = Math.max(1, ...rows.flatMap((r) => [Math.abs(r.fixed), Math.abs(r.floating)]));
  const x = scaleBand({ domain: rows.map((_, i) => i), range: [0, w], padding: 0.2 });
  const y = scaleLinear({ domain: [-max * 1.1, max * 1.1], range: [h, 0], nice: true });
  const bw = x.bandwidth();
  const half = bw / 2;
  const every = Math.max(1, Math.ceil(rows.length / Math.max(1, Math.floor(w / 34))));
  const bar = (v: number) => ({ y: y(Math.max(0, v)), height: Math.max(1, Math.abs(y(v) - y(0))) });

  return (
    <svg width={width} height={height} role="group" aria-label={ariaLabel} className="irs-ladder">
      <Group left={margin.left} top={margin.top}>
        <AxisLeft scale={y} numTicks={5} tickFormat={(v) => compact(Number(v))} stroke={CHART_COLORS.axis} tickStroke={CHART_COLORS.axis}
          tickLabelProps={() => ({ fill: "var(--text-muted)", fontSize: 10, textAnchor: "end", dx: -4, dy: 3 })} />
        <line x1={0} x2={w} y1={y(0)} y2={y(0)} stroke={CHART_COLORS.axis} />
        {rows.map((r, i) => {
          const bx = x(i) ?? 0;
          const on = selected === i;
          return (
            <g key={r.t} className={on ? "irs-ladder-col is-selected" : "irs-ladder-col"} tabIndex={0} role="img" aria-label={label(r)}
              onMouseEnter={() => onSelect(i)} onFocus={() => onSelect(i)} onMouseLeave={() => onSelect(null)} onBlur={() => onSelect(null)}>
              <rect className="irs-ladder-hit" x={bx - 2} y={0} width={bw + 4} height={h} />
              <rect x={bx} width={half} {...bar(r.floating)} fill={COLOR.floating} opacity={0.35} />
              <rect x={bx + half * 0.25} width={half * 0.5} {...bar(r.pvFloating)} fill={COLOR.floating} />
              <rect x={bx + half} width={half} {...bar(r.fixed)} fill={COLOR.fixed} opacity={0.35} />
              <rect x={bx + half * 1.25} width={half * 0.5} {...bar(r.pvFixed)} fill={COLOR.fixed} />
              <line x1={bx - 1} x2={bx + bw + 1} y1={y(r.net)} y2={y(r.net)} stroke="var(--text)" strokeWidth={2} />
              {i % every === 0 && (
                <text x={bx + half} y={h + 16} textAnchor="middle" fontSize={10} fill="var(--text-muted)">{years(r.t)}</text>
              )}
              <title>{label(r)}</title>
            </g>
          );
        })}
        <text x={w} y={y(max) + 10} textAnchor="end" fontSize={10} fill="var(--text-muted)">{money(max)}</text>
      </Group>
    </svg>
  );
}
