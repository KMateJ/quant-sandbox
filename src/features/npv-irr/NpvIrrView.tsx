import { useMemo, useState } from "react";
import SliderField from "../../components/SliderField";
import { useMediaQuery } from "../../components/useMediaQuery";
import { LineChart } from "../../components/charts";
import type { ChartReferenceLine, ChartSeries } from "../../components/charts";
import { PageHeader, Workspace, Panel, ChartContainer } from "../../components/layout";
import { Tabs, type TabItem } from "../../components/ui";
import { useI18n } from "../../i18n";
import NpvResults from "./components/NpvResults";
import {
  cashflowSchedule,
  discountedPayback,
  internalRateOfReturn,
  netPresentValue,
  npvProfile,
  profitabilityIndex,
} from "./npvIrr.math";

const RATE_MAX = 0.5;
const STEPS = 80;

type NpvTab = "profile" | "buildup";

export default function NpvIrrView() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const [outlay, setOutlay] = useState(1000);
  const [annual, setAnnual] = useState(250);
  const [years, setYears] = useState(6);
  const [rate, setRate] = useState(0.08);
  const [tab, setTab] = useState<NpvTab>("profile");

  const npvValue = netPresentValue(rate, outlay, annual, years);
  const irrValue = internalRateOfReturn(outlay, annual, years);
  const pi = profitabilityIndex(rate, outlay, annual, years);

  const profile = useMemo(
    () => npvProfile(outlay, annual, years, 0, RATE_MAX, STEPS),
    [outlay, annual, years]
  );
  const schedule = useMemo(
    () => cashflowSchedule(outlay, annual, years, rate),
    [outlay, annual, years, rate]
  );
  const payback = discountedPayback(schedule);

  const pct = (v: number) => `${(v * 100).toFixed(1)}%`;
  const money = (v: number) => v.toFixed(0);

  const tabs: TabItem<NpvTab>[] = [
    { id: "profile", label: t("npvTabProfile") },
    { id: "buildup", label: t("npvTabBuildup") },
  ];

  const npvs = profile.map((p) => p.npv);
  const profileSeries: ChartSeries[] = [
    { key: "npv", label: t("npvLabel"), color: "#22c55e", strokeWidth: 2.5, area: true },
  ];
  const profileRefs: ChartReferenceLine[] = [
    { axis: "y", value: 0, color: "#64748b" },
    { axis: "x", value: rate, color: "#38bdf8", dash: "4 4" },
  ];
  if (Number.isFinite(irrValue) && irrValue >= 0 && irrValue <= RATE_MAX) {
    profileRefs.push({ axis: "x", value: irrValue, color: "#f97316", dash: "2 4" });
  }

  const cum = schedule.map((r) => r.cumulativePv);
  const buildupSeries: ChartSeries[] = [
    { key: "cumulativePv", label: t("npvBuildupLabel"), color: "#38bdf8", strokeWidth: 2.5, area: true },
  ];
  const buildupRefs: ChartReferenceLine[] = [{ axis: "y", value: 0, color: "#64748b" }];
  if (payback !== null) buildupRefs.push({ axis: "x", value: payback, color: "#f97316", dash: "2 4" });

  return (
    <>
      <PageHeader title={t("npvTitle")} description={t("npvDesc")} />

      <Workspace columns="sidebar">
        <Panel title={t("npvControlsTitle")}>
          <div className="controls-grid">
            <SliderField label={t("npvOutlayLabel")} min={100} max={5000} step={50} value={outlay} onChange={setOutlay} formatValue={money} />
            <SliderField label={t("npvAnnualLabel")} min={10} max={1500} step={10} value={annual} onChange={setAnnual} formatValue={money} />
            <SliderField label={t("npvYearsLabel")} min={1} max={20} step={1} value={years} onChange={setYears} formatValue={(v) => v.toFixed(0)} />
            <SliderField label={t("npvRateLabel")} min={0} max={RATE_MAX} step={0.0025} value={rate} onChange={setRate} formatValue={pct} />
          </div>
        </Panel>

        <div className="module-main">
          <ChartContainer
            title={t("npvChartTitle")}
            actions={<Tabs segmented items={tabs} value={tab} onChange={(id) => setTab(id as NpvTab)} ariaLabel={t("npvChartTitle")} />}
          >
            <div className="chart-wrap">
              {tab === "profile" ? (
                <LineChart
                  data={profile}
                  xKey="rate"
                  series={profileSeries}
                  xDomain={[0, RATE_MAX]}
                  yDomain={[Math.min(...npvs, 0) * 1.05, Math.max(...npvs, 0) * 1.05]}
                  referenceLines={profileRefs}
                  isMobile={isMobile}
                  tooltipLabel={(x) => `${t("npvRateLabel")} = ${pct(x)}`}
                  valueFormat={money}
                />
              ) : (
                <LineChart
                  data={schedule}
                  xKey="year"
                  series={buildupSeries}
                  xDomain={[0, years]}
                  yDomain={[Math.min(...cum, 0) * 1.05, Math.max(...cum, 0) * 1.05]}
                  referenceLines={buildupRefs}
                  isMobile={isMobile}
                  tooltipLabel={(x) => `${t("npvColYear")} ${x.toFixed(0)}`}
                  valueFormat={money}
                />
              )}
            </div>
          </ChartContainer>

          <NpvResults npv={npvValue} irr={irrValue} pi={pi} payback={payback} rows={schedule} />
        </div>
      </Workspace>
    </>
  );
}
