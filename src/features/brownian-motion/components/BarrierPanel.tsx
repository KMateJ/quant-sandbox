import { useMemo } from "react";
import { DragHandles, Histogram, PathCloudChart } from "../../../components/charts";
import type { PathOverlay } from "../../../components/charts/chart.types";
import { binValues } from "../../../lib/stats";
import { densityCurve, pathPoints } from "../../../lib/stats/ensemble";
import { useI18n } from "../../../i18n";
import { firstPassageLaw, firstPassageTimes, hitProbability, hitSummary } from "../brownianMotion.math";
import BarrierPredict from "./BarrierPredict";

type Props = {
  values: Float64Array;
  pathCount: number;
  steps: number;
  horizon: number;
  drift: number;
  vol: number;
  barrier: number;
  onBarrier: (b: number) => void;
  onZeroDrift: () => void;
  isMobile: boolean;
};

const MAX_LIT = 60;
const pct = (v: number) => (Number.isFinite(v) ? `${(v * 100).toFixed(1)}%` : "–");
const num = (v: number) => v.toFixed(2);

/// First passage of a barrier: drag b on the path cloud, see which paths touch it and when, against the
/// reflection-principle theory for driftless Brownian motion.
export default function BarrierPanel({ values, pathCount, steps, horizon, drift, vol, barrier, onBarrier, onZeroDrift, isMobile }: Props) {
  const { t } = useI18n();
  const dt = horizon / steps;
  const stepCount = steps + 1;
  const driftless = drift === 0;
  const yDomain = useMemo((): [number, number] => {
    let lo = Infinity;
    let hi = -Infinity;
    for (let i = 0; i < values.length; i++) { if (values[i] < lo) lo = values[i]; if (values[i] > hi) hi = values[i]; }
    return [lo, hi];
  }, [values]);
  const times = useMemo(() => firstPassageTimes(values, pathCount, stepCount, dt, barrier), [values, pathCount, stepCount, dt, barrier]);
  const summary = useMemo(() => hitSummary(times), [times]);
  const theory = driftless ? hitProbability(barrier, vol, horizon) : NaN;
  const bins = useMemo(() => binValues(summary.hit, [0, horizon], 40).bins, [summary.hit, horizon]);
  const density = useMemo(() => (driftless ? densityCurve(firstPassageLaw(barrier, vol), [0, horizon]) : undefined), [driftless, barrier, vol, horizon]);

  // Paths that touch b, drawn from their first hitting time on (the whole cloud stays grey behind them).
  const overlays = useMemo(() => {
    const out: PathOverlay[] = [{ key: "barrier", color: "var(--negative)", points: [{ x: 0, y: barrier }, { x: horizon, y: barrier }], dash: "5 4", strokeWidth: 1.5 }];
    for (let p = 0; p < pathCount && out.length <= MAX_LIT; p++) {
      if (!Number.isFinite(times[p])) continue;
      const from = Math.round(times[p] / dt);
      out.push({ key: `hit-${p}`, color: "var(--primary)", strokeWidth: 1.25, points: pathPoints(values, pathCount, stepCount, p, dt).slice(from) });
    }
    return out;
  }, [times, values, pathCount, stepCount, dt, barrier, horizon]);

  return (
    <div className="lp-ensemble">
      <div className="lp-ensemble-charts">
        <div className="lp-ensemble-cloud">
          <PathCloudChart
            values={values} pathCount={pathCount} stepCount={stepCount} dx={dt} xDomain={[0, horizon]} yDomain={yDomain}
            maxOpacity={0.25} overlays={overlays} isMobile={isMobile} ariaLabel={t("bmBarrierCloudAria", { n: pathCount })}
            layer={(frame) => (
              <DragHandles frame={frame} onChange={(_, v) => v.y !== undefined && onBarrier(Number(v.y.toFixed(2)) || 0.01)}
                handles={[{ id: "barrier", axis: "y", y: barrier, min: yDomain[0], max: yDomain[1], label: t("bmBarrierLabel"), format: num }]} />
            )}
          />
        </div>
        <Histogram bins={bins} density={density} height={isMobile ? 200 : 300} xFormat={num}
          yFormat={(v) => String(Number(v.toPrecision(2)))} ariaLabel={t("bmBarrierHistAria")}
          markers={Number.isFinite(summary.median) ? [{ value: summary.median, label: t("bmHitMedian"), color: "var(--primary)" }] : []} />
      </div>
      <dl className="lp-ensemble-readout">
        <div><dt>{t("bmBarrierLabel")}</dt><dd>{num(barrier)}</dd></div>
        <div><dt>{t("bmHitShare")}</dt><dd>{pct(summary.share)}</dd></div>
        <div><dt>{t("bmHitTheory")}</dt><dd>{pct(theory)}</dd></div>
        <div><dt>{t("bmHitMedian")}</dt><dd>{Number.isFinite(summary.median) ? summary.median.toFixed(3) : "–"}</dd></div>
      </dl>
      <p className="lp-ensemble-hint">{t("bmBarrierHint")}</p>
      <p className="lp-ensemble-hint">{t("bmBarrierCaption", { steps })}</p>
      {!driftless && (
        <p className="lp-ensemble-hint">
          {t("bmBarrierDrift")} <button type="button" className="lp-btn" onClick={onZeroDrift}>μ = 0</button>
        </p>
      )}
      <BarrierPredict truth={driftless ? theory : summary.share} explain={driftless} barrier={barrier} horizon={horizon} />
    </div>
  );
}
