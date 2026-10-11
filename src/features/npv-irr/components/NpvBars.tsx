import { ParentSize } from "@visx/responsive";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Bar, Line as SvgLine } from "@visx/shape";
import { AxisLeft } from "@visx/axis";
import { CHART_COLORS } from "../../../components/charts/chart.theme";

export type BarDatum = { label: string; value: number; color: string };

type NpvBarsProps = {
  data: BarDatum[];
  valueFormat: (v: number) => string;
};

function Inner({ data, valueFormat, width, height }: NpvBarsProps & { width: number; height: number }) {
  const margin = { top: 18, right: 8, bottom: 26, left: 48 };
  const innerW = Math.max(0, width - margin.left - margin.right);
  const innerH = Math.max(0, height - margin.top - margin.bottom);
  const values = data.map((d) => d.value);
  const yScale = scaleLinear({ domain: [Math.min(0, ...values) * 1.12, Math.max(0, ...values) * 1.12], range: [innerH, 0] });
  const xScale = scaleBand({ domain: data.map((d) => d.label), range: [0, innerW], padding: 0.3 });

  return (
    <svg width={width} height={height}>
      <Group left={margin.left} top={margin.top}>
        <AxisLeft scale={yScale} numTicks={5} stroke={CHART_COLORS.axis} tickStroke={CHART_COLORS.axis} tickLabelProps={() => ({ fill: CHART_COLORS.axis, fontSize: 10, textAnchor: "end", dx: "-0.25em", dy: "0.25em" })} />
        <SvgLine from={{ x: 0, y: yScale(0) }} to={{ x: innerW, y: yScale(0) }} stroke="#64748b" strokeWidth={1} />
        {data.map((d) => {
          const bx = xScale(d.label) ?? 0;
          const top = yScale(Math.max(0, d.value));
          const bh = Math.abs(yScale(d.value) - yScale(0));
          return (
            <Group key={d.label}>
              <Bar x={bx} y={top} width={xScale.bandwidth()} height={bh} fill={d.color} rx={3} />
              <text x={bx + xScale.bandwidth() / 2} y={d.value >= 0 ? top - 4 : top + bh + 11} textAnchor="middle" fill="#cbd5e1" fontSize={10} fontWeight={600}>
                {valueFormat(d.value)}
              </text>
              <text x={bx + xScale.bandwidth() / 2} y={innerH + 16} textAnchor="middle" fill={CHART_COLORS.axis} fontSize={11}>
                {d.label}
              </text>
            </Group>
          );
        })}
      </Group>
    </svg>
  );
}

/// Simple responsive vertical bar chart with a zero baseline (handles negatives).
export default function NpvBars(props: NpvBarsProps) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <ParentSize>{({ width, height }) => (width > 0 && height > 0 ? <Inner {...props} width={width} height={height} /> : null)}</ParentSize>
    </div>
  );
}
