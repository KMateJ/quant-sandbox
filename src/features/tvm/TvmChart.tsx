import { useState } from "react";
import { DragHandles, LineChart, type ChartSeries } from "../../components/charts";
import { ChartContainer } from "../../components/layout";
import { useI18n } from "../../i18n";
import { balanceSplit } from "./tvm.math";
import type { TvmLab } from "./useTvmLab";

const money = (v: number) => v.toFixed(0);

/// Balance chart with a draggable year cursor; the split at that year is drawn on the chart and read out below.
export default function TvmChart({ lab, isMobile }: { lab: TvmLab; isMobile: boolean }) {
  const { t } = useI18n();
  const [picked, setPicked] = useState<number | null>(null);
  const year = Math.min(lab.horizon, picked ?? Math.round(lab.horizon / 2));
  const { principal, payment, rate } = lab.eff;
  const split = balanceSplit(principal, payment, rate, year);
  const top = Math.max(...lab.data.map((d) => d.balance));

  const series: ChartSeries[] = [
    { key: "balance", label: t("tvmBalanceLabel"), color: "#22c55e", strokeWidth: 2.5, area: true },
    { key: "contributions", label: t("tvmContributionsLabel"), color: "#64748b", strokeWidth: 2, dash: "5 4" },
  ];

  return (
    <ChartContainer title={t("tvmChartTitle")}>
      <div className="chart-wrap">
        <LineChart
          data={lab.data}
          xKey="year"
          series={series}
          xDomain={[0, lab.horizon]}
          yDomain={[0, top * 1.05]}
          isMobile={isMobile}
          tooltipLabel={(x) => `${t("tvmYearsLabel")}: ${x.toFixed(0)}`}
          valueFormat={money}
          layer={(frame) => (
            <>
              <line className="tvm-split-paid" x1={frame.x(year)} x2={frame.x(year)} y1={frame.y(0)} y2={frame.y(split.paidIn)} />
              <line className="tvm-split-interest" x1={frame.x(year)} x2={frame.x(year)} y1={frame.y(split.paidIn)} y2={frame.y(split.balance)} />
              <DragHandles
                frame={frame}
                handles={[{ id: "year", axis: "x", x: year, min: 0, max: lab.horizon, step: 1, label: t("tvmCursorLabel"), format: (v) => `${t("tvmCursorLabel")} ${v.toFixed(0)}` }]}
                onChange={(_, v) => v.x !== undefined && setPicked(Math.round(v.x))}
              />
            </>
          )}
        />
      </div>
      <div className="tvm-split" aria-live="polite">
        <div className="tvm-split-head">
          <strong>{t("tvmCursorTitle")}: {t("tvmCursorLabel")} {year}</strong>
          <span className="tvm-split-hint">{t("tvmCursorHint")}</span>
        </div>
        <div className="tvm-split-bar" aria-hidden="true">
          <span className="tvm-split-bar-paid" style={{ flexGrow: Math.max(0, split.paidIn) }} />
          <span className="tvm-split-bar-interest" style={{ flexGrow: Math.max(0, split.interest) }} />
        </div>
        <dl className="tvm-split-values">
          <div><dt>{t("tvmBalanceLabel")}</dt><dd>{money(split.balance)}</dd></div>
          <div><dt>{t("tvmCursorPaidIn")}</dt><dd>{money(split.paidIn)}</dd></div>
          <div><dt>{t("tvmCursorInterest")}</dt><dd>{money(split.interest)}</dd></div>
          <div><dt>{t("tvmCursorShare")}</dt><dd>{split.balance > 0 ? `${((split.interest / split.balance) * 100).toFixed(1)}%` : "–"}</dd></div>
        </dl>
      </div>
    </ChartContainer>
  );
}
