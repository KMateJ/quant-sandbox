import { ParentSize } from "@visx/responsive";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { Bar, Line as SvgLine } from "@visx/shape";
import { AxisBottom } from "@visx/axis";
import { CHART_COLORS } from "../../../components/charts/chart.theme";
import type { MonteCarloResult } from "../npvIrr.types";

type MonteCarloHistogramProps = {
  result: MonteCarloResult;
  valueFormat: (v: number) => string;
};

function Inner({ result, valueFormat, width, height }: MonteCarloHistogramProps & { width: number; height: number }) {
  const margin = { top: 12, right: 12, bottom: 30, left: 12 };
  const innerW = Math.max(0, width - margin.left - margin.right);
  const innerH = Math.max(0, height - margin.top - margin.bottom);
  const lo = result.bins[0].x0;
  const hi = result.bins[result.bins.length - 1].x1;
  const xScale = scaleLinear({ domain: [lo, hi], range: [0, innerW] });
  const yMax = Math.max(...result.bins.map((b) => b.count), 1);
  const yScale = scaleLinear({ domain: [0, yMax], range: [innerH, 0] });

  return (
    <svg width={width} height={height}>
      <Group left={margin.left} top={margin.top}>
        {result.bins.map((b, i) => {
          const x = xScale(b.x0);
          const w = Math.max(1, xScale(b.x1) - xScale(b.x0) - 1);
          const y = yScale(b.count);
          const mid = (b.x0 + b.x1) / 2;
          return <Bar key={i} x={x} y={y} width={w} height={innerH - y} fill={mid >= 0 ? "#22c55e" : "#ef4444"} opacity={0.8} />;
        })}
        {xScale(0) >= 0 && xScale(0) <= innerW && (
          <SvgLine from={{ x: xScale(0), y: 0 }} to={{ x: xScale(0), y: innerH }} stroke="#e2e8f0" strokeWidth={1.5} />
        )}
        <SvgLine from={{ x: xScale(result.mean), y: 0 }} to={{ x: xScale(result.mean), y: innerH }} stroke="#38bdf8" strokeWidth={1.5} strokeDasharray="4 3" />
        <text x={Math.min(xScale(result.mean) + 4, innerW - 60)} y={12} fill="#38bdf8" fontSize={10} fontWeight={600}>μ {valueFormat(result.mean)}</text>
        <AxisBottom top={innerH} scale={xScale} numTicks={6} stroke={CHART_COLORS.axis} tickStroke={CHART_COLORS.axis} tickFormat={(v) => valueFormat(Number(v))} tickLabelProps={() => ({ fill: CHART_COLORS.axis, fontSize: 10, textAnchor: "middle" })} />
      </Group>
    </svg>
  );
}

/// Histogram of simulated NPV outcomes, split at zero with a mean marker.
export default function MonteCarloHistogram(props: MonteCarloHistogramProps) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <ParentSize>{({ width, height }) => (width > 0 && height > 0 ? <Inner {...props} width={width} height={height} /> : null)}</ParentSize>
    </div>
  );
}
