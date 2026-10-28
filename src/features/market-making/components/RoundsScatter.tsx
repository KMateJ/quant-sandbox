import { ScatterChart, SERIES_PALETTE, SERIES_ROLE, type ChartReferenceLine, type ScatterSeries } from "../../../components/charts";
import { useMediaQuery } from "../../../components/useMediaQuery";
import { useI18n } from "../../../i18n";
import { mean, stdDev } from "../../../lib/stats/moments";
import { theoryBreakEven, theoryCurve } from "../theory.math";
import type { MarketMakingLab } from "../useMarketMakingLab";
import { cents, usd } from "./mkmFormat";

/// "Your rounds": avg half-spread vs P&L per minute, with the bot cloud, the theory curve once unlocked,
/// and (in Predict) a click on the plot to place the guess.
export default function RoundsScatter({ lab }: { lab: MarketMakingLab }) {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const { rounds, params, bots, theoryOn, best, predict, url } = lab;
  const xMax = Math.max(6 / params.k, ...rounds.map((r) => r.avgHalfSpread + 0.5), (bots?.delta ?? 0) + 1);
  const groups = [...new Set(rounds.map((r) => r.informed))];
  const series: ScatterSeries[] = groups.map((pi, i) => ({
    key: `you-${pi}`,
    label: t("mkmYourRounds", { pi: Math.round(pi * 100) }),
    color: SERIES_PALETTE[i % SERIES_PALETTE.length],
    hollow: i % 2 === 1,
    points: rounds.filter((r) => r.informed === pi).map((r) => ({ x: r.avgHalfSpread, y: r.pnlPerMin })),
  }));
  if (bots) {
    const ys = bots.runs.map((b) => b.pnlPerMin);
    const m = mean(ys);
    const sd = stdDev(ys);
    series.push(
      { key: "bots", label: t("mkmBotCloud"), color: SERIES_ROLE.cloud, opacity: 0.35, outline: false, radius: 2.5, points: bots.runs.map((b) => ({ x: b.avgHalfSpread, y: b.pnlPerMin })) },
      { key: "bot-band", label: t("mkmBotBand"), color: SERIES_ROLE.estimate, line: true, strokeWidth: 3, points: [{ x: bots.delta, y: m - sd }, { x: bots.delta, y: m + sd }] },
    );
  }
  const refs: ChartReferenceLine[] = [{ axis: "y", value: 0, color: "var(--border)" }];
  if (theoryOn) {
    series.push({ key: "theory", label: t("mkmTheoryCurve"), color: SERIES_ROLE.reference, line: true, strokeWidth: 2, points: theoryCurve(params, xMax) });
    refs.push({ axis: "x", value: best, color: SERIES_ROLE.reference, dash: "4 3" });
    const be = theoryBreakEven(params);
    if (be > 0) refs.push({ axis: "x", value: be, color: "var(--negative)", dash: "2 3" });
  }
  const placing = url.mode === "predict" && !predict.revealed;
  if (url.mode === "predict" && predict.guess !== null) refs.push({ axis: "x", value: predict.guess, color: SERIES_ROLE.candidate, width: 2 });

  return (
    <ScatterChart
      series={series}
      xDomain={[0, xMax]}
      referenceLines={refs}
      isMobile={isMobile}
      legend
      xLabel={t("mkmAxisHalfSpread")}
      yLabel={t("mkmAxisPnl")}
      xFormat={cents}
      yFormat={usd}
      onPlotClick={placing ? (x) => predict.setGuess(Math.max(0, Math.round(x * 10) / 10)) : undefined}
    />
  );
}
