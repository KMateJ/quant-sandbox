import { type KeyboardEvent, type PointerEvent } from "react";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";
import { scaleLinear } from "@visx/scale";
import { LinePath } from "@visx/shape";
import { CHART_COLORS, chartMargin } from "../../../../../components/charts/chart.theme";
import { useI18n } from "../../../../../i18n";
import { EULER_SETUP } from "../../../guide.interactive.eulerConvergence.math";

type Props = { exact: number[]; euler: number[]; at: number | null; onAt: (k: number | null) => void };

const tickStyle = { fill: CHART_COLORS.axis, fontSize: 11 };

function Inner({ exact, euler, at, onAt, width, height }: Props & { width: number; height: number }) {
  const { t } = useI18n();
  const narrow = width < 480;
  const margin = chartMargin(narrow);
  const w = Math.max(0, width - margin.left - margin.right);
  const h = Math.max(0, height - margin.top - margin.bottom);
  const n = euler.length - 1;
  const x = scaleLinear({ domain: [0, EULER_SETUP.T], range: [0, w] });
  const y = scaleLinear({ domain: [Math.min(...exact, ...euler), Math.max(...exact, ...euler)], range: [h, 0], nice: true });
  const tOf = (k: number, steps: number) => (k / steps) * EULER_SETUP.T;
  const exactAt = (k: number) => exact[(k * (exact.length - 1)) / n];

  const pick = (event: PointerEvent<SVGRectElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    onAt(Math.round(((event.clientX - rect.left) / rect.width) * n));
  };
  const onKey = (event: KeyboardEvent<SVGSVGElement>) => {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (event.key === "Home" || event.key === "End") onAt(event.key === "Home" ? 0 : n);
    else if (step) onAt(Math.min(n, Math.max(0, (at ?? (step > 0 ? -1 : n + 1)) + step)));
    else return;
    event.preventDefault();
  };

  return (
    <svg width={width} height={height} tabIndex={0} className="ixeu-svg" aria-label={t("ixEuPathsAria")} onKeyDown={onKey} onBlur={() => onAt(null)}>
      <Group left={margin.left} top={margin.top}>
        <LinePath data={exact} x={(_, k) => x(tOf(k, exact.length - 1))} y={(v) => y(v)} className="ixeu-exact" />
        <LinePath data={euler} x={(_, k) => x(tOf(k, n))} y={(v) => y(v)} className="ixeu-euler" />
        {n <= 64 && euler.map((v, k) => <circle key={k} className="ixeu-node" cx={x(tOf(k, n))} cy={y(v)} r={n <= 16 ? 3.5 : 2} />)}
        {at !== null && (
          <g className="ixeu-at">
            <line x1={x(tOf(at, n))} x2={x(tOf(at, n))} y1={0} y2={h} />
            <line className="ixeu-gap" x1={x(tOf(at, n))} x2={x(tOf(at, n))} y1={y(exactAt(at))} y2={y(euler[at])} />
            <circle className="ixeu-node" cx={x(tOf(at, n))} cy={y(euler[at])} r={5} />
            <circle className="ixeu-exact-dot" cx={x(tOf(at, n))} cy={y(exactAt(at))} r={4} />
          </g>
        )}
        <rect width={w} height={h} fill="transparent" onPointerMove={pick} onPointerDown={pick} onPointerLeave={() => onAt(null)} />
        <AxisLeft scale={y} numTicks={5} stroke={CHART_COLORS.axis} tickStroke={CHART_COLORS.axis} tickLabelProps={() => ({ ...tickStyle, textAnchor: "end", dx: -4, dy: 3 })} />
        <AxisBottom top={h} scale={x} numTicks={narrow ? 4 : 5} stroke={CHART_COLORS.axis} tickStroke={CHART_COLORS.axis} tickLabelProps={() => ({ ...tickStyle, textAnchor: "middle" })} />
      </Group>
    </svg>
  );
}

/// Exact GBM path and its Euler approximation; hovering or arrow keys pick a grid time to compare them.
export default function EulerConvergencePaths(props: Props) {
  return (
    <ParentSize>
      {({ width, height }) => (width > 0 && height > 0 ? <Inner {...props} width={width} height={height} /> : null)}
    </ParentSize>
  );
}
