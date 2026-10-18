import { useMemo, type KeyboardEvent, type PointerEvent } from "react";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { Group } from "@visx/group";
import { GridRows } from "@visx/grid";
import { scaleLinear } from "@visx/scale";
import { LinePath } from "@visx/shape";
import { CHART_COLORS, chartMargin } from "../../../../../components/charts/chart.theme";
import { useI18n } from "../../../../../i18n";
import {
  MAX_WEIGHT,
  UTILITY_MARKET as M,
  completePortfolio,
  indifferenceCurve,
  utility,
} from "../../../guide.interactive.utilityIndifference.math";
import { pct } from "../figureFormat";

/// `snap` is true for pointer drags, false for arrow-key steps.
type Props = { width: number; height: number; A: number; y: number; yStar: number; onChange: (y: number, snap: boolean) => void };

const SIGMA_MAX = 0.34;
const MU_MAX = 0.2;
const KEY_STEP: Record<string, number> = { ArrowRight: 0.01, ArrowUp: 0.01, ArrowLeft: -0.01, ArrowDown: -0.01, PageUp: 0.1, PageDown: -0.1 };
const tick = { fill: CHART_COLORS.axis, fontSize: 11 };

/// (σ, μ) plane: the CAL, the draggable complete portfolio, and indifference curves through it and through the optimum.
export default function UtilityIndifferenceChart({ width, height, A, y, yStar, onChange }: Props) {
  const { t } = useI18n();
  const margin = { ...chartMargin(width < 480), bottom: 40 };
  const innerW = Math.max(0, width - margin.left - margin.right);
  const innerH = Math.max(0, height - margin.top - margin.bottom);
  const xs = useMemo(() => scaleLinear({ domain: [0, SIGMA_MAX], range: [0, innerW] }), [innerW]);
  const ys = useMemo(() => scaleLinear({ domain: [0, MU_MAX], range: [innerH, 0] }), [innerH]);
  const cur = completePortfolio(y);
  const opt = completePortfolio(yStar);
  const end = completePortfolio(MAX_WEIGHT);
  const curve = (U: number) => indifferenceCurve(U, A, SIGMA_MAX);
  const atOptimum = Math.abs(y - yStar) < 1e-9;

  const setFromPointer = (event: PointerEvent<SVGRectElement>) => {
    const left = event.currentTarget.getBoundingClientRect().left;
    onChange(xs.invert(event.clientX - left) / M.sigmaP, true);
  };
  const onKeyDown = (event: KeyboardEvent<SVGCircleElement>) => {
    const next = event.key === "Home" ? 0 : event.key === "End" ? MAX_WEIGHT : KEY_STEP[event.key] !== undefined ? y + KEY_STEP[event.key] : null;
    if (next === null) return;
    event.preventDefault();
    onChange(next, false);
  };

  return (
    <svg width={width} height={height} className="ui-svg">
      <defs>
        <clipPath id="ui-plot"><rect width={innerW} height={innerH} /></clipPath>
      </defs>
      <Group left={margin.left} top={margin.top}>
        <GridRows scale={ys} width={innerW} numTicks={5} stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
        <g clipPath="url(#ui-plot)">
          <LinePath className="ui-curve ui-curve--opt" data={curve(utility(opt.mu, opt.sigma, A))} x={(d) => xs(d.sigma)} y={(d) => ys(d.mu)} />
          {!atOptimum && <LinePath className="ui-curve ui-curve--cur" data={curve(utility(cur.mu, cur.sigma, A))} x={(d) => xs(d.sigma)} y={(d) => ys(d.mu)} />}
          <line className="ui-cal" x1={xs(0)} y1={ys(M.rf)} x2={xs(end.sigma)} y2={ys(end.mu)} />
        </g>
        <circle className="ui-dot" cx={xs(0)} cy={ys(M.rf)} r={4} />
        <text className="ui-label" x={xs(0) + 8} y={ys(M.rf) + 16}>{t("ixUiRiskFree")}</text>
        <circle className="ui-dot ui-dot--p" cx={xs(M.sigmaP)} cy={ys(M.muP)} r={5} />
        <text className="ui-label" x={xs(M.sigmaP) + 9} y={ys(M.muP) + 16}>{t("ixUiRisky")}</text>
        {yStar <= MAX_WEIGHT && <circle className="ui-opt" cx={xs(opt.sigma)} cy={ys(opt.mu)} r={11} />}
        <rect className="ui-hit" x={0} y={0} width={innerW} height={innerH} onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); setFromPointer(e); }} onPointerMove={(e) => e.currentTarget.hasPointerCapture(e.pointerId) && setFromPointer(e)} />
        <circle
          className={atOptimum ? "ui-handle is-optimal" : "ui-handle"}
          cx={xs(cur.sigma)}
          cy={ys(cur.mu)}
          r={8}
          role="slider"
          tabIndex={0}
          aria-label={t("ixUiHandle")}
          aria-valuemin={0}
          aria-valuemax={MAX_WEIGHT * 100}
          aria-valuenow={Math.round(y * 100)}
          aria-valuetext={t("ixUiHandleText", { y: y.toFixed(2), mu: pct(cur.mu, 1), sigma: pct(cur.sigma, 1) })}
          onKeyDown={onKeyDown}
        />
        {atOptimum && <text className="ui-label ui-label--opt" x={xs(opt.sigma)} y={ys(opt.mu) - 16} textAnchor="middle">{t("ixUiAtOptimum")}</text>}
        <AxisLeft scale={ys} numTicks={5} tickFormat={(v) => pct(Number(v), 0)} stroke={CHART_COLORS.axis} tickStroke={CHART_COLORS.axis} tickLabelProps={() => ({ ...tick, textAnchor: "end", dx: "-0.25em", dy: "0.3em" })} />
        <AxisBottom top={innerH} scale={xs} numTicks={width < 480 ? 4 : 7} tickFormat={(v) => pct(Number(v), 0)} stroke={CHART_COLORS.axis} tickStroke={CHART_COLORS.axis} tickLabelProps={() => ({ ...tick, textAnchor: "middle" })} />
        <text className="ui-axis-title" x={innerW} y={innerH + 34} textAnchor="end">{t("ixUiAxisSigma")}</text>
        <text className="ui-axis-title" x={4} y={10}>{t("ixUiAxisMu")}</text>
      </Group>
    </svg>
  );
}
