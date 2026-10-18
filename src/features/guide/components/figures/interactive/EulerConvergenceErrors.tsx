import { AxisBottom, AxisLeft } from "@visx/axis";
import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";
import { scaleLog } from "@visx/scale";
import { CHART_COLORS } from "../../../../../components/charts/chart.theme";
import { useI18n } from "../../../../../i18n";

type ErrorPoint = { n: number; dt: number; error: number };
type Props = { errors: ErrorPoint[]; current: number };

const tickStyle = { fill: CHART_COLORS.axis, fontSize: 10 };
const margin = { top: 10, right: 16, bottom: 26, left: 44 };

function Inner({ errors, current, width, height }: Props & { width: number; height: number }) {
  const { t } = useI18n();
  const w = Math.max(0, width - margin.left - margin.right);
  const h = Math.max(0, height - margin.top - margin.bottom);
  const dts = errors.map((e) => e.dt);
  const errs = errors.map((e) => e.error);
  const x = scaleLog({ domain: [Math.min(...dts) / 1.5, Math.max(...dts) * 1.5], range: [0, w] });
  const y = scaleLog({ domain: [Math.min(...errs) / 1.6, Math.max(...errs) * 1.6], range: [h, 0] });
  // Reference line of slope ½ through the coarsest point.
  const a = errors[0];
  const ref = (dt: number) => a.error * Math.sqrt(dt / a.dt);
  const [lo, hi] = x.domain();

  return (
    <svg width={width} height={height}>
      <Group left={margin.left} top={margin.top}>
        <line className="ixeu-ref" x1={x(lo)} y1={y(ref(lo))} x2={x(hi)} y2={y(ref(hi))} />
        <text className="ixeu-ref-label" x={x(hi) - 4} y={y(ref(hi)) - 6} textAnchor="end">{t("ixEuSlopeRef")}</text>
        {errors.map((e) => (
          <g key={e.n} className={e.n === current ? "ixeu-err is-current" : "ixeu-err"}>
            <circle cx={x(e.dt)} cy={y(e.error)} r={e.n === current ? 6 : 4} />
            <text x={x(e.dt)} y={y(e.error) + (e.n === current ? 18 : 15)} textAnchor="middle">{e.error.toFixed(2)}</text>
          </g>
        ))}
        <AxisLeft scale={y} numTicks={3} tickFormat={(v) => Number(v).toFixed(1)} stroke={CHART_COLORS.axis} tickStroke={CHART_COLORS.axis} tickLabelProps={() => ({ ...tickStyle, textAnchor: "end", dx: -4, dy: 3 })} />
        <AxisBottom top={h} scale={x} tickValues={dts} tickFormat={(v) => `1/${Math.round(1 / Number(v))}`} stroke={CHART_COLORS.axis} tickStroke={CHART_COLORS.axis} tickLabelProps={() => ({ ...tickStyle, textAnchor: "middle" })} />
      </Group>
    </svg>
  );
}

/// Strong error at T against Δt on log–log axes; Euler's points follow a slope-½ line.
export default function EulerConvergenceErrors(props: Props) {
  return (
    <ParentSize>
      {({ width, height }) => (width > 0 && height > 0 ? <Inner {...props} width={width} height={height} /> : null)}
    </ParentSize>
  );
}
