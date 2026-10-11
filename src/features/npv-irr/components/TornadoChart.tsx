import { ParentSize } from "@visx/responsive";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { Line as SvgLine } from "@visx/shape";
import { CHART_COLORS } from "../../../components/charts/chart.theme";
import type { SensitivityVar, TornadoRow } from "../npvIrr.types";

type TornadoChartProps = {
  rows: TornadoRow[];
  baseNpv: number;
  labelFor: (v: SensitivityVar) => string;
  valueFormat: (v: number) => string;
};

function Inner({ rows, baseNpv, labelFor, valueFormat, width, height }: TornadoChartProps & { width: number; height: number }) {
  const margin = { top: 10, right: 54, bottom: 24, left: 92 };
  const innerW = Math.max(0, width - margin.left - margin.right);
  const innerH = Math.max(0, height - margin.top - margin.bottom);
  const vals = rows.flatMap((r) => [r.low, r.high, baseNpv]);
  const xScale = scaleLinear({ domain: [Math.min(...vals) * 1.05, Math.max(...vals) * 1.05], range: [0, innerW] });
  const band = innerH / Math.max(rows.length, 1);
  const barH = Math.min(26, band * 0.62);

  const seg = (from: number, to: number) => {
    const x0 = Math.min(xScale(from), xScale(to));
    const w = Math.abs(xScale(to) - xScale(from));
    return { x0, w, fill: to >= baseNpv ? "#22c55e" : "#ef4444" };
  };

  return (
    <svg width={width} height={height}>
      <Group left={margin.left} top={margin.top}>
        {rows.map((r, i) => {
          const y = i * band + (band - barH) / 2;
          const lo = seg(baseNpv, r.low);
          const hi = seg(baseNpv, r.high);
          return (
            <Group key={r.variable}>
              <rect x={lo.x0} y={y} width={lo.w} height={barH} fill={lo.fill} opacity={0.85} rx={2} />
              <rect x={hi.x0} y={y} width={hi.w} height={barH} fill={hi.fill} opacity={0.85} rx={2} />
              <text x={-8} y={y + barH / 2} textAnchor="end" dominantBaseline="middle" fill="#cbd5e1" fontSize={11}>
                {labelFor(r.variable)}
              </text>
              <text x={xScale(r.low) + (r.low < baseNpv ? -4 : 4)} y={y + barH / 2} textAnchor={r.low < baseNpv ? "end" : "start"} dominantBaseline="middle" fill={CHART_COLORS.axis} fontSize={9}>
                {valueFormat(r.low)}
              </text>
              <text x={xScale(r.high) + (r.high < baseNpv ? -4 : 4)} y={y + barH / 2} textAnchor={r.high < baseNpv ? "end" : "start"} dominantBaseline="middle" fill={CHART_COLORS.axis} fontSize={9}>
                {valueFormat(r.high)}
              </text>
            </Group>
          );
        })}
        <SvgLine from={{ x: xScale(baseNpv), y: 0 }} to={{ x: xScale(baseNpv), y: innerH }} stroke="#e2e8f0" strokeWidth={1.5} strokeDasharray="3 3" />
        <text x={xScale(baseNpv)} y={innerH + 16} textAnchor="middle" fill="#e2e8f0" fontSize={10}>{valueFormat(baseNpv)}</text>
      </Group>
    </svg>
  );
}

/// Horizontal tornado: each variable's NPV swing around the base case, sorted by impact.
export default function TornadoChart(props: TornadoChartProps) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <ParentSize>{({ width, height }) => (width > 0 && height > 0 ? <Inner {...props} width={width} height={height} /> : null)}</ParentSize>
    </div>
  );
}
