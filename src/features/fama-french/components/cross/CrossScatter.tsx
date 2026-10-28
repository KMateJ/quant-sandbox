import { useState } from "react";
import { ParentSize } from "@visx/responsive";
import { ChartContainer } from "../../../../components/layout";
import { useI18n } from "../../../../i18n";
import { axisTicks } from "../../cross.math";
import type { CrossRow } from "../../cross.types";

type Props = { rows: CrossRow[]; extent: [number, number]; selected: string; onSelect: (label: string) => void; ariaLabel: string };

const M = { top: 12, right: 16, bottom: 40, left: 52 };
const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

function Plot({ rows, extent, selected, onSelect, ariaLabel, width, height }: Props & { width: number; height: number }) {
  const { t } = useI18n();
  const [hover, setHover] = useState<string | null>(null);
  const pad = (extent[1] - extent[0]) * 0.06;
  const [lo, hi] = [extent[0] - pad, extent[1] + pad];
  const w = Math.max(10, width - M.left - M.right);
  const h = Math.max(10, height - M.top - M.bottom);
  const sx = (v: number) => ((v - lo) / (hi - lo)) * w;
  const sy = (v: number) => h - ((v - lo) / (hi - lo)) * h;
  const ticks = axisTicks(lo, hi);
  const active = rows.find((r) => r.label === (hover ?? selected));

  return (
    <svg width={width} height={height} role="group" aria-label={ariaLabel}>
      <g transform={`translate(${M.left},${M.top})`}>
        {ticks.map((v) => (
          <g key={v} className="ffm-tick">
            <line x1={0} x2={w} y1={sy(v)} y2={sy(v)} />
            <line x1={sx(v)} x2={sx(v)} y1={0} y2={h} />
            <text x={-8} y={sy(v)} textAnchor="end" dy="0.32em">{pct(v)}</text>
            <text x={sx(v)} y={h + 16} textAnchor="middle">{pct(v)}</text>
          </g>
        ))}
        <line className="ffm-diagonal" x1={sx(lo)} y1={sy(lo)} x2={sx(hi)} y2={sy(hi)} />
        <text className="ffm-axis-label" x={w / 2} y={h + 34} textAnchor="middle">{t("ffmCrossXAxis")}</text>
        <text className="ffm-axis-label" transform={`translate(-40,${h / 2}) rotate(-90)`} textAnchor="middle">{t("ffmCrossYAxis")}</text>
        {rows.map((r) => (
          <g
            key={r.label}
            className={r.label === selected ? "ffm-cross-pt is-selected" : "ffm-cross-pt"}
            style={{ transform: `translate(${sx(r.predicted)}px, ${sy(r.realised)}px)` }}
            tabIndex={0}
            role="button"
            aria-label={t("ffmCrossPoint", { code: r.label, pred: pct(r.predicted), real: pct(r.realised), alpha: pct(r.alpha), t: r.alphaT.toFixed(1) })}
            aria-pressed={r.label === selected}
            onPointerEnter={() => setHover(r.label)}
            onPointerLeave={() => setHover(null)}
            onFocus={() => setHover(r.label)}
            onBlur={() => setHover(null)}
            onClick={() => onSelect(r.label)}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onSelect(r.label))}
          >
            <circle r={3 + r.size * 1.4} />
          </g>
        ))}
        {active && (
          <text className="ffm-cross-label" x={sx(active.predicted) + 10} y={sy(active.realised) - 10}>{active.label}</text>
        )}
      </g>
    </svg>
  );
}

/// Predicted (x) against realised (y) average excess returns of the 25 portfolios, with the 45 degree line; points move when the model changes.
export default function CrossScatter(props: Props) {
  const { t } = useI18n();
  return (
    <ChartContainer title={t("ffmCrossTitle")} height={420} className="ffm-cross-chart">
      <ParentSize>{({ width, height }) => (width > 0 && height > 0 ? <Plot {...props} width={width} height={height} /> : null)}</ParentSize>
    </ChartContainer>
  );
}
