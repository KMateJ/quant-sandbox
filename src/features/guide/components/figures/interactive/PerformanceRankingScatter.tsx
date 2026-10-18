import { scaleLinear } from "@visx/scale";
import { useI18n, type TranslationKey } from "../../../../../i18n";
import { PERF_MARKET as M, type FundStats, type RankKey } from "../../../guide.interactive.performanceRanking.math";
import { fmt, pct } from "../figureFormat";

type Props = { funds: FundStats[]; market: FundStats; sortKey: RankKey; hovered: string | null; onHover: (id: string | null) => void };

type Plane = { x: (f: FundStats) => number; y: (f: FundStats) => number; xMax: number; yMin: number; yMax: number; xLabel: TranslationKey; yLabel: TranslationKey; xFmt: (v: number) => string; line: TranslationKey };

// Each measure is drawn where it is a slope or a vertical distance.
const PLANES: Record<"total" | "beta" | "residual", Plane> = {
  total: { x: (f) => f.sigma, y: (f) => f.mu, xMax: 0.34, yMin: 0, yMax: 0.16, xLabel: "ixPrAxisSigma", yLabel: "ixPrAxisMu", xFmt: (v) => pct(v, 0), line: "ixPrLineCml" },
  beta: { x: (f) => f.beta, y: (f) => f.mu, xMax: 1.4, yMin: 0, yMax: 0.16, xLabel: "ixPrAxisBeta", yLabel: "ixPrAxisMu", xFmt: (v) => fmt(v, 1), line: "ixPrLineSml" },
  residual: { x: (f) => f.residual, y: (f) => f.alpha, xMax: 0.26, yMin: -0.01, yMax: 0.05, xLabel: "ixPrAxisResidual", yLabel: "ixPrAxisAlpha", xFmt: (v) => pct(v, 0), line: "ixPrLineInfo" },
};
const planeFor = (k: RankKey) => (k === "treynor" || k === "alpha" ? PLANES.beta : k === "info" ? PLANES.residual : PLANES.total);

const W = 340;
const H = 230;
const PAD = { l: 40, r: 14, t: 14, b: 34 };

/// Scatter of the funds on the axes that fit the chosen measure; the hovered fund's measure is drawn as a line.
export default function PerformanceRankingScatter({ funds, market, sortKey, hovered, onHover }: Props) {
  const { t } = useI18n();
  const plane = planeFor(sortKey);
  const xs = scaleLinear({ domain: [0, plane.xMax], range: [PAD.l, W - PAD.r] });
  const ys = scaleLinear({ domain: [plane.yMin, plane.yMax], range: [H - PAD.b, PAD.t] });
  const origin = plane === PLANES.residual ? { x: 0, y: 0 } : { x: 0, y: M.rf };
  // CML / SML through the market; for residual risk there is no market point, only rays from the origin.
  const slope = plane === PLANES.total ? (M.mu - M.rf) / M.sigma : plane === PLANES.beta ? M.mu - M.rf : 0;
  const all = plane === PLANES.residual ? funds : [...funds, market];
  const focus = funds.find((f) => f.id === hovered);

  return (
    <svg className="pr-scatter" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={t("ixPrScatterAria")}>
      {xs.ticks(4).map((v) => (
        <text key={v} className="pr-tick" x={xs(v)} y={H - PAD.b + 14} textAnchor="middle">{plane.xFmt(v)}</text>
      ))}
      {ys.ticks(4).map((v) => (
        <g key={v}>
          <line className="pr-grid" x1={PAD.l} x2={W - PAD.r} y1={ys(v)} y2={ys(v)} />
          <text className="pr-tick" x={PAD.l - 5} y={ys(v) + 3} textAnchor="end">{pct(v, 0)}</text>
        </g>
      ))}
      <text className="pr-axis" x={W - PAD.r} y={H - 4} textAnchor="end">{t(plane.xLabel)}</text>
      <text className="pr-axis" x={PAD.l} y={PAD.t - 3}>{t(plane.yLabel)}</text>
      {slope > 0 && <line className="pr-ref" x1={xs(0)} y1={ys(origin.y)} x2={xs(plane.xMax)} y2={ys(origin.y + slope * plane.xMax)} />}
      {focus && (sortKey === "alpha"
        ? <line className="pr-measure" x1={xs(plane.x(focus))} x2={xs(plane.x(focus))} y1={ys(plane.y(focus))} y2={ys(M.rf + focus.beta * (M.mu - M.rf))} />
        : <line className="pr-measure" x1={xs(origin.x)} y1={ys(origin.y)} x2={xs(plane.x(focus))} y2={ys(plane.y(focus))} />)}
      {all.map((f) => (
        <g
          key={f.id}
          className={`pr-point${f.id === "M" ? " is-market" : ""}${hovered === f.id ? " is-hover" : ""}`}
          onPointerEnter={() => onHover(f.id === "M" ? null : f.id)}
          onPointerLeave={() => onHover(null)}
        >
          <circle cx={xs(plane.x(f))} cy={ys(plane.y(f))} r={hovered === f.id ? 7 : 5.5} />
          <text x={xs(plane.x(f)) + 9} y={ys(plane.y(f)) + 4}>{f.id}</text>
        </g>
      ))}
      <text className="pr-legend" x={W - PAD.r} y={PAD.t + 10} textAnchor="end">{t(plane.line)}</text>
    </svg>
  );
}
