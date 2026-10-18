import { useMemo } from "react";
import { DragHandles, PathCloudChart, type PathOverlay } from "../../components/charts";
import { useI18n } from "../../i18n";
import { crossingIndex, minIndex, runningAverage, type ExoticPayoff, type ExoticRun } from "./monteCarloExotic.math";

type Props = {
  run: ExoticRun;
  payoff: ExoticPayoff;
  strike: number;
  maturity: number;
  barrier: number;
  onBarrier: (b: number) => void;
  barrierRange: [number, number];
  height: number;
  isMobile: boolean;
};

const LIVE = "#38bdf8";
const AVERAGES = 40;

/// Sample paths under the chosen payoff: knocked-out paths turn grey from the date they touch the barrier,
/// Asian shows running averages, lookback marks each path's minimum.
export default function McExoticPaths({ run, payoff, strike, maturity, barrier, onBarrier, barrierRange, height, isMobile }: Props) {
  const { t } = useI18n();
  const dx = maturity / run.steps;
  const n = run.pathCount;
  const at = (j: number, k: number) => run.paths[k * n + j];
  const yDomain = useMemo((): [number, number] => {
    let lo = Infinity, hi = -Infinity;
    for (const v of run.paths) { if (v < lo) lo = v; if (v > hi) hi = v; }
    return [Math.min(lo, strike) * 0.97, Math.max(hi, barrierRange[1]) * 1.01];
  }, [run, strike, barrierRange]);

  const overlays = useMemo(() => {
    const strikeLine: PathOverlay = { key: "K", color: "#22c55e", dash: "6 4", strokeWidth: 1.5, points: [{ x: 0, y: strike }, { x: maturity, y: strike }] };
    const out: PathOverlay[] = [strikeLine];
    if (payoff === "barrier") {
      // Each path in colour up to its knock-out date (the cloud underneath is grey).
      for (let j = 0; j < n; j++) {
        const hit = crossingIndex(run, j, barrier);
        const last = hit < 0 ? run.steps : hit;
        const pts = Array.from({ length: last + 1 }, (_, k) => ({ x: k * dx, y: run.paths[k * n + j] }));
        out.push({ key: `p${j}`, color: LIVE, strokeWidth: hit < 0 ? 1 : 0.8, points: pts });
      }
    }
    if (payoff === "asian")
      for (let j = 0; j < AVERAGES; j++) out.push({ key: `a${j}`, color: "rgba(245, 158, 11, 0.5)", strokeWidth: 0.9, points: runningAverage(run, j, dx) });
    return out;
  }, [run, payoff, barrier, strike, maturity, dx, n]);

  const minima = useMemo(() => (payoff === "lookback" ? Array.from({ length: n }, (_, j) => minIndex(run, j)) : []), [run, payoff, n]);

  return (
    <div className="chart-wrap" style={{ height }}>
      <PathCloudChart
        values={run.paths} pathCount={n} stepCount={run.steps + 1} dx={dx} xDomain={[0, maturity]} yDomain={yDomain}
        color={payoff === "barrier" ? "var(--muted)" : LIVE} maxOpacity={payoff === "barrier" ? 0.25 : 0.4}
        overlays={overlays} isMobile={isMobile} ariaLabel={t("monteCarloExoticPathsAria", { n })}
        layer={(frame) => (
          <>
            {minima.map((k, j) => (
              <circle key={j} cx={frame.x(k * dx)} cy={frame.y(at(j, k))} r={2} fill="#f59e0b" fillOpacity={0.75} pointerEvents="none" />
            ))}
            {payoff === "barrier" && (
            <DragHandles
              frame={frame}
              handles={[{ id: "B", axis: "y", y: barrier, min: barrierRange[0], max: barrierRange[1], step: 1, color: "#ef4444", label: "B", format: (v) => v.toFixed(0) }]}
              onChange={(_, v) => v.y !== undefined && onBarrier(v.y)}
            />
            )}
          </>
        )}
      />
    </div>
  );
}
