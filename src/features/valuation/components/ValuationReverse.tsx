import { useMemo } from "react";
import { DragHandles, LineChart, type ChartSeries } from "../../../components/charts";
import { useMediaQuery } from "../../../components/useMediaQuery";
import { SegmentedControl, StatCard } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import { enterpriseValue, impliedInput, reverseCurve, type ReverseMode } from "../valuation.math";

type Props = {
  fcf1: number;
  growth: number;
  years: number;
  wacc: number;
  terminalGrowth: number;
  mode: ReverseMode;
  onMode: (mode: ReverseMode) => void;
  /// Market enterprise value the reader drags; 0 = not set, which starts 25% above the model value.
  market: number;
  onMarket: (value: number) => void;
};

const pct = (v: number) => `${(v * 100).toFixed(2)}%`;
const money = (v: number) => v.toFixed(0);
const compact = (v: number) => (Math.abs(v) >= 1000 ? `${+(v / 1000).toFixed(1)}k` : v.toFixed(0));

/// Reverse DCF: drag the market value and read off the terminal growth (or WACC) it implies.
export default function ValuationReverse({ fcf1, growth, years, wacc, terminalGrowth, mode, onMode, market, onMarket }: Props) {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const ev = enterpriseValue(fcf1, growth, years, wacc, terminalGrowth);
  const target = market > 0 ? market : Math.round(ev * 1.25);
  const curve = useMemo(() => reverseCurve(mode, fcf1, growth, years, wacc, terminalGrowth), [mode, fcf1, growth, years, wacc, terminalGrowth]);
  const implied = impliedInput(mode, target, fcf1, growth, years, wacc, terminalGrowth);
  const current = mode === "growth" ? terminalGrowth : wacc;
  const yMax = Math.max(target, ...curve.map((p) => p.value)) * 1.08;
  const series: ChartSeries[] = [{ key: "value", label: t("valuationReverseCurve"), color: "var(--primary)", strokeWidth: 2.5 }];
  const xLabel = t(mode === "growth" ? "valuationTerminalGrowthLabel" : "valuationWaccLabel");

  return (
    <div className="valuation-reverse">
      <SegmentedControl<ReverseMode>
        options={[
          { value: "growth", label: t("valuationReverseSolveGrowth") },
          { value: "wacc", label: t("valuationReverseSolveWacc") },
        ]}
        value={mode}
        onChange={onMode}
        ariaLabel={t("valuationReverseSolveAria")}
      />
      <div className="chart-wrap">
        <LineChart
          data={curve}
          xKey="x"
          series={series}
          xDomain={[curve[0].x, curve[curve.length - 1].x]}
          yDomain={[0, yMax]}
          referenceLines={[{ axis: "x", value: current, color: "var(--muted)", dash: "4 4" }]}
          legend={false}
          isMobile={isMobile}
          xFormat={(v) => `${(v * 100).toFixed(1)}%`}
          yFormat={compact}
          tooltipLabel={(x) => `${xLabel} ${pct(x)}`}
          valueFormat={money}
          layer={(frame) => (
            <>
              {implied !== null && (
                <>
                  <line x1={frame.x(implied)} x2={frame.x(implied)} y1={frame.y(target)} y2={frame.y(0)} stroke="var(--primary)" strokeDasharray="3 3" />
                  <circle cx={frame.x(implied)} cy={frame.y(target)} r={5} fill="var(--primary)" stroke="var(--surface)" strokeWidth={2} />
                </>
              )}
              <DragHandles
                frame={frame}
                handles={[{ id: "market", axis: "y", y: target, min: 1, max: yMax, step: 1, color: "var(--warning-title, #f59e0b)", label: t("valuationReverseMarket"), format: (v) => `${t("valuationReverseMarket")} ${money(v)}` }]}
                onChange={(_, v) => v.y !== undefined && onMarket(Math.round(v.y))}
              />
            </>
          )}
        />
      </div>
      <div className="stats-grid valuation-reverse-stats" aria-live="polite">
        <StatCard label={t("valuationReverseMarket")} value={money(target)} />
        <StatCard label={t("valuationReverseModel")} value={money(ev)} />
        <StatCard label={t(mode === "growth" ? "valuationReverseImpliedGrowth" : "valuationReverseImpliedWacc")} value={implied === null ? "–" : pct(implied)} />
        <StatCard label={t("valuationReverseGap")} value={implied === null ? "–" : `${implied >= current ? "+" : "−"}${(Math.abs(implied - current) * 10000).toFixed(0)} bp`} />
      </div>
      <p className="npv-chart-hint">
        {implied === null ? t(mode === "growth" ? "valuationReverseUnreachableGrowth" : "valuationReverseUnreachableWacc") : t("valuationReverseHint")}
      </p>
    </div>
  );
}
