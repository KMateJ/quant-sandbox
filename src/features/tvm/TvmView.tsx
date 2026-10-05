import { useMemo, useState } from "react";
import SliderField from "../../components/SliderField";
import { useMediaQuery } from "../../components/useMediaQuery";
import { LineChart } from "../../components/charts";
import type { ChartSeries } from "../../components/charts";
import { PageHeader, Workspace, Panel, ChartContainer } from "../../components/layout";
import { ControlGroup } from "../../components/ui";
import { useI18n } from "../../i18n";
import { balanceAt, balanceSchedule, contributionsAt } from "./tvm.math";

export default function TvmView() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const [principal, setPrincipal] = useState(1000);
  const [payment, setPayment] = useState(200);
  const [rate, setRate] = useState(0.06);
  const [years, setYears] = useState(20);

  const finalBalance = balanceAt(principal, payment, rate, years);
  const totalContributions = contributionsAt(principal, payment, years);
  const interest = finalBalance - totalContributions;

  const data = useMemo(
    () => balanceSchedule(principal, payment, rate, years),
    [principal, payment, rate, years]
  );

  const xDomain: [number, number] = [0, years];
  const yDomain: [number, number] = [0, finalBalance * 1.05];

  const money = (v: number) => v.toFixed(0);
  const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

  const series: ChartSeries[] = [
    { key: "balance", label: t("tvmBalanceLabel"), color: "#22c55e", strokeWidth: 2.5, area: true },
    { key: "contributions", label: t("tvmContributionsLabel"), color: "#64748b", strokeWidth: 2, dash: "5 4" },
  ];

  return (
    <>
      <PageHeader title={t("tvmTitle")} description={t("tvmDesc")} />

      <Workspace columns="sidebar">
        <Panel title={t("tvmControlsTitle")}>
          <div className="controls-grid">
            <SliderField label={t("tvmPrincipalLabel")} min={0} max={10000} step={100} value={principal} onChange={setPrincipal} formatValue={money} />
            <SliderField label={t("tvmPaymentLabel")} min={0} max={2000} step={50} value={payment} onChange={setPayment} formatValue={money} />
            <SliderField label={t("tvmRateLabel")} min={0} max={0.15} step={0.0025} value={rate} onChange={setRate} formatValue={pct} />
            <SliderField label={t("tvmYearsLabel")} min={1} max={40} step={1} value={years} onChange={setYears} formatValue={(v) => v.toFixed(0)} />
          </div>

          <ControlGroup label={t("tvmMetricsLabel")}>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-title">{t("tvmFinalBalance")}</div>
                <div className="stat-value">{money(finalBalance)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">{t("tvmContributions")}</div>
                <div className="stat-value">{money(totalContributions)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">{t("tvmInterest")}</div>
                <div className="stat-value">{money(interest)}</div>
              </div>
            </div>
          </ControlGroup>
        </Panel>

        <ChartContainer title={t("tvmChartTitle")}>
          <div className="chart-wrap">
            <LineChart
              data={data}
              xKey="year"
              series={series}
              xDomain={xDomain}
              yDomain={yDomain}
              isMobile={isMobile}
              tooltipLabel={(x) => `${t("tvmYearsLabel")}: ${x.toFixed(0)}`}
              valueFormat={money}
            />
          </div>
        </ChartContainer>
      </Workspace>
    </>
  );
}
