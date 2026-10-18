import { useMemo } from "react";
import { LineChart, markerLine } from "../../components/charts";
import { ChartContainer } from "../../components/layout";
import { SegmentedControl } from "../../components/ui";
import { useI18n, type TranslationKey } from "../../i18n";
import McExoticPaths from "./McExoticPaths";
import { barrierCurve, barrierGrid, estimate, upAndOut, upAndOutClosedForm, type ExoticPayoff } from "./monteCarloExotic.math";
import type { McLabParams } from "./monteCarlo.types";
import { useExoticRun } from "./useExoticRun";

type Props = {
  params: McLabParams;
  analytic: number;
  payoff: ExoticPayoff;
  onPayoff: (p: ExoticPayoff) => void;
  barrier: number;
  onBarrier: (b: number) => void;
  isMobile: boolean;
};

const LABEL: Record<ExoticPayoff, TranslationKey> = {
  european: "monteCarloExoticEuropean", asian: "monteCarloExoticAsian", barrier: "monteCarloExoticBarrier", lookback: "monteCarloExoticLookback",
};
const HINT: Record<ExoticPayoff, TranslationKey> = {
  european: "monteCarloExoticHintEuropean", asian: "monteCarloExoticHintAsian", barrier: "monteCarloExoticHintBarrier", lookback: "monteCarloExoticHintLookback",
};

/// Path-dependent payoffs priced on one shared set of paths, with a draggable knock-out barrier.
export default function McExotic({ params, analytic, payoff, onPayoff, barrier, onBarrier, isMobile }: Props) {
  const { t } = useI18n();
  const { run, pending } = useExoticRun(params);
  const { s0, strike, maturity, rate, vol } = params;
  const grid = useMemo(() => barrierGrid(s0, strike), [s0, strike]);
  const range: [number, number] = [Math.round(Math.max(s0, strike) * 1.01), Math.round(grid[grid.length - 1])];
  const curve = useMemo(() => barrierCurve(run, grid), [run, grid]);
  const priced = useMemo(() => {
    if (payoff === "barrier") return upAndOut(run, barrier);
    return { ...estimate(run[payoff]), knockedOut: 0 };
  }, [run, payoff, barrier]);
  const closed = upAndOutClosedForm(s0, strike, barrier, maturity, rate, vol);
  const num = (v: number) => v.toFixed(3);
  const height = isMobile ? 230 : 300;

  return (
    <ChartContainer
      title={t("monteCarloExoticTitle")}
      actions={
        <SegmentedControl<ExoticPayoff>
          ariaLabel={t("monteCarloExoticPayoff")}
          value={payoff}
          onChange={onPayoff}
          options={(Object.keys(LABEL) as ExoticPayoff[]).map((p) => ({ value: p, label: t(LABEL[p]) }))}
        />
      }
    >
      <p className="control-hint">{t("monteCarloExoticIntro")}</p>
      <McExoticPaths run={run} payoff={payoff} strike={strike} maturity={maturity} barrier={barrier} onBarrier={onBarrier} barrierRange={range} height={height} isMobile={isMobile} />
      <p className="control-hint">{t(HINT[payoff])}</p>
      <div className="stats-grid" aria-busy={pending} aria-live="polite">
        <div className="stat-card"><div className="stat-title">{t(LABEL[payoff])} · {t("monteCarloExoticPrice")}</div><div className="stat-value">{num(priced.mean)} ± {num(priced.half)}</div></div>
        <div className="stat-card"><div className="stat-title">{t("monteCarloExoticEuroRef")}</div><div className="stat-value">{num(analytic)}</div></div>
        {payoff === "barrier" && (
          <>
            <div className="stat-card"><div className="stat-title">{t("monteCarloExoticKnockedOut")}</div><div className="stat-value">{(priced.knockedOut * 100).toFixed(1)}%</div></div>
            <div className="stat-card"><div className="stat-title">{t("monteCarloExoticClosedForm")}</div><div className="stat-value">{num(closed)}</div></div>
          </>
        )}
      </div>
      {payoff === "barrier" && (
        <>
          <div className="stat-title">{t("monteCarloExoticCurveTitle")}</div>
          <div className="chart-wrap" style={{ height: isMobile ? 180 : 210 }}>
            <LineChart
              data={curve.map((c) => ({ B: c.barrier, price: c.price, euro: analytic }))}
              xKey="B"
              series={[
                { key: "price", label: t("monteCarloExoticBarrier"), color: "#ef4444", strokeWidth: 2.25 },
                { key: "euro", label: t("monteCarloExoticEuroRef"), color: "var(--muted)", dash: "6 4", strokeWidth: 1.5 },
              ]}
              referenceLines={[markerLine(barrier)]}
              xFormat={(v) => v.toFixed(0)}
              valueFormat={(v) => v.toFixed(2)}
              tooltipLabel={(x) => `B = ${x.toFixed(0)}`}
            />
          </div>
          <p className="control-hint">{t("monteCarloExoticCurveCaption")}</p>
        </>
      )}
    </ChartContainer>
  );
}
