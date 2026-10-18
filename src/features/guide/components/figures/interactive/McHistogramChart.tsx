import { useMemo } from "react";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";
import { scaleLinear } from "@visx/scale";
import { CHART_COLORS, chartMargin } from "../../../../../components/charts/chart.theme";
import { useI18n } from "../../../../../i18n";
import { MC_BINS, MC_SETUP, type McHistogramState } from "../../../guide.interactive.mcHistogram.math";

type InnerProps = { state: McHistogramState; width: number; height: number };

const tickStyle = { fill: CHART_COLORS.axis, fontSize: 11 };

function Inner({ state, width, height }: InnerProps) {
  const { t } = useI18n();
  const narrow = width < 480;
  const margin = chartMargin(narrow);
  const w = Math.max(0, width - margin.left - margin.right);
  const h = Math.max(0, height - margin.top - margin.bottom);
  const x = useMemo(() => scaleLinear({ domain: [MC_BINS.min, MC_BINS.max], range: [0, w] }), [w]);
  const peak = Math.max(5, ...state.counts);
  const y = scaleLinear({ domain: [0, peak * 1.12], range: [h, 0], nice: true });
  const binW = x(MC_BINS.min + MC_BINS.width) - x(MC_BINS.min);
  const kx = x(MC_SETUP.K);

  return (
    <svg width={width} height={height}>
      <Group left={margin.left} top={margin.top}>
        <rect className="ixmc-pays-zone" x={kx} y={0} width={w - kx} height={h} />
        <text className="ixmc-pays-label" x={w - 4} y={12} textAnchor="end">{t("ixMcPays")}</text>
        {state.counts.map((count, i) => {
          const left = MC_BINS.min + i * MC_BINS.width;
          const pays = left >= MC_SETUP.K;
          const top = y(count);
          return (
            <rect key={i} className={pays ? "ixmc-bar pays" : "ixmc-bar"}
              x={x(left) + 0.5} y={top} width={Math.max(0, binW - 1)} height={h - top} />
          );
        })}
        {state.lastBin >= 0 && (
          // Re-keyed per draw so the flash animation restarts on every new draw.
          <rect key={state.n} className="ixmc-flash"
            x={x(MC_BINS.min + state.lastBin * MC_BINS.width)} y={0} width={binW} height={h} />
        )}
        <line className="ixmc-strike" x1={kx} x2={kx} y1={0} y2={h} />
        <text className="ixmc-strike-label" x={kx + 4} y={12}>{t("ixMcStrike", { k: MC_SETUP.K })}</text>
        <AxisLeft scale={y} numTicks={4} tickFormat={(v) => (Number.isInteger(Number(v)) ? String(v) : "")} stroke={CHART_COLORS.axis} tickStroke={CHART_COLORS.axis} tickLabelProps={() => ({ ...tickStyle, textAnchor: "end", dx: -4, dy: 3 })} />
        <AxisBottom top={h} scale={x} numTicks={narrow ? 5 : 9} stroke={CHART_COLORS.axis} tickStroke={CHART_COLORS.axis} tickLabelProps={() => ({ ...tickStyle, textAnchor: "middle" })} />
      </Group>
    </svg>
  );
}

/// Histogram of the simulated terminal prices; bins above the strike, where the call pays, are tinted.
export default function McHistogramChart({ state }: { state: McHistogramState }) {
  return (
    <ParentSize>
      {({ width, height }) => (width > 0 && height > 0 ? <Inner state={state} width={width} height={height} /> : null)}
    </ParentSize>
  );
}
