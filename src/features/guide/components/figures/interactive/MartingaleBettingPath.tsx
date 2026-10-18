import { AxisBottom, AxisLeft } from "@visx/axis";
import { curveStepAfter } from "@visx/curve";
import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";
import { scaleLinear } from "@visx/scale";
import { LinePath } from "@visx/shape";
import { CHART_COLORS, chartMargin } from "../../../../../components/charts/chart.theme";
import { useI18n } from "../../../../../i18n";
import { BETTING_SETUP } from "../../../guide.interactive.martingaleBetting.math";

type InnerProps = { path: number[]; width: number; height: number };

const tickStyle = { fill: CHART_COLORS.axis, fontSize: 11 };

function Inner({ path, width, height }: InnerProps) {
  const { t } = useI18n();
  const narrow = width < 480;
  const margin = chartMargin(narrow);
  const w = Math.max(0, width - margin.left - margin.right);
  const h = Math.max(0, height - margin.top - margin.bottom);
  const rounds = Math.max(BETTING_SETUP.rounds, path.length - 1);
  const lo = Math.min(BETTING_SETUP.start - 10, ...path);
  const hi = Math.max(BETTING_SETUP.start + 10, ...path);
  const x = scaleLinear({ domain: [0, rounds], range: [0, w] });
  const y = scaleLinear({ domain: [lo, hi], range: [h, 0], nice: true });
  const last = path.length - 1;

  return (
    <svg width={width} height={height}>
      <Group left={margin.left} top={margin.top}>
        <line className="ixmg-start" x1={0} x2={w} y1={y(BETTING_SETUP.start)} y2={y(BETTING_SETUP.start)} />
        <text className="ixmg-note" x={w - 4} y={y(BETTING_SETUP.start) - 5} textAnchor="end">{t("ixMgStart")}</text>
        <LinePath data={path} x={(_, i) => x(i)} y={(v) => y(v)} curve={curveStepAfter} className="ixmg-path" />
        <circle className="ixmg-now" cx={x(last)} cy={y(path[last])} r={4} />
        <AxisLeft scale={y} numTicks={4} stroke={CHART_COLORS.axis} tickStroke={CHART_COLORS.axis} tickLabelProps={() => ({ ...tickStyle, textAnchor: "end", dx: -4, dy: 3 })} />
        <AxisBottom top={h} scale={x} numTicks={narrow ? 4 : 8} stroke={CHART_COLORS.axis} tickStroke={CHART_COLORS.axis} tickLabelProps={() => ({ ...tickStyle, textAnchor: "middle" })} />
      </Group>
    </svg>
  );
}

/// Step plot of one player's wealth after each round, with the starting wealth as a reference.
export default function MartingaleBettingPath({ path }: { path: number[] }) {
  return (
    <ParentSize>
      {({ width, height }) => (width > 0 && height > 0 ? <Inner path={path} width={width} height={height} /> : null)}
    </ParentSize>
  );
}
