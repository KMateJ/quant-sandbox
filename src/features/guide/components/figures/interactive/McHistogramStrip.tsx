import { AxisBottom, AxisLeft } from "@visx/axis";
import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";
import { scaleLinear, scaleLog } from "@visx/scale";
import { Area, LinePath } from "@visx/shape";
import { CHART_COLORS } from "../../../../../components/charts/chart.theme";
import type { McEstimatePoint } from "../../../guide.interactive.mcHistogram.math";
import { formatCount } from "./McHistogramFormat";

type Props = { trail: McEstimatePoint[]; bs: number };
type InnerProps = Props & { width: number; height: number };

const margin = { top: 6, right: 12, bottom: 22, left: 40 };
const tickStyle = { fill: CHART_COLORS.axis, fontSize: 10 };
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
/// 1, 10, 100, … up to `max`: a log axis labelled every tick is unreadable.
const decades = (max: number) => Array.from({ length: Math.floor(Math.log10(max)) + 1 }, (_, i) => 10 ** i);

function Inner({ trail, bs, width, height }: InnerProps) {
  const w = Math.max(0, width - margin.left - margin.right);
  const h = Math.max(0, height - margin.top - margin.bottom);
  const nMax = Math.max(10, trail[trail.length - 1]?.n ?? 10);
  const x = scaleLog({ domain: [1, nMax], range: [0, w] });
  // The y range is fixed around the true price, so the band visibly narrows instead of rescaling.
  const lo = bs * 0.4;
  const hi = bs * 1.6;
  const y = scaleLinear({ domain: [lo, hi], range: [h, 0] });
  const yc = (v: number) => y(clamp(v, lo, hi));

  return (
    <svg width={width} height={height}>
      <Group left={margin.left} top={margin.top}>
        <Area data={trail} x={(p) => x(p.n)} y0={(p) => yc(p.lower)} y1={(p) => yc(p.upper)} className="ixmc-band" />
        <line className="ixmc-bs" x1={0} x2={w} y1={y(bs)} y2={y(bs)} />
        <LinePath data={trail} x={(p) => x(p.n)} y={(p) => yc(p.estimate)} className="ixmc-estimate" />
        <AxisLeft scale={y} numTicks={3} stroke={CHART_COLORS.axis} tickStroke={CHART_COLORS.axis} tickLabelProps={() => ({ ...tickStyle, textAnchor: "end", dx: -4, dy: 3 })} />
        <AxisBottom top={h} scale={x} tickValues={decades(nMax)} tickFormat={(v) => formatCount(Number(v))} stroke={CHART_COLORS.axis} tickStroke={CHART_COLORS.axis} tickLabelProps={() => ({ ...tickStyle, textAnchor: "middle" })} />
      </Group>
    </svg>
  );
}

/// Running estimate against the number of draws (log scale) with its 95% band and the Black–Scholes price.
export default function McHistogramStrip(props: Props) {
  return (
    <ParentSize>
      {({ width, height }) => (width > 0 && height > 0 ? <Inner {...props} width={width} height={height} /> : null)}
    </ParentSize>
  );
}
