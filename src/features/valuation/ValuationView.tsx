import { useMemo, useState } from "react";
import SliderField from "../../components/SliderField";
import { useMediaQuery } from "../../components/useMediaQuery";
import { LineChart } from "../../components/charts";
import type { ChartReferenceLine, ChartSeries } from "../../components/charts";
import { PageHeader, Workspace, Panel, ChartContainer } from "../../components/layout";
import { Tabs, type TabItem } from "../../components/ui";
import { useI18n } from "../../i18n";
import ValuationResults from "./components/ValuationResults";
import { dcfSchedule, enterpriseValue, horizonTerminalValue } from "./valuation.math";

type ValuationTab = "projection" | "buildup";

export default function ValuationView() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const [fcf1, setFcf1] = useState(100);
  const [growth, setGrowth] = useState(0.08);
  const [years, setYears] = useState(5);
  const [terminalGrowth, setTerminalGrowth] = useState(0.02);
  const [wacc, setWacc] = useState(0.1);
  const [tab, setTab] = useState<ValuationTab>("projection");

  const ev = enterpriseValue(fcf1, growth, years, wacc, terminalGrowth);
  const tv = horizonTerminalValue(fcf1, growth, years, wacc, terminalGrowth);
  const pvTerminal = tv / Math.pow(1 + wacc, years);
  const terminalShare = ev === 0 ? 0 : pvTerminal / ev;

  const data = useMemo(() => dcfSchedule(fcf1, growth, years, wacc), [fcf1, growth, years, wacc]);

  const money = (v: number) => v.toFixed(0);
  const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

  const tabs: TabItem<ValuationTab>[] = [
    { id: "projection", label: t("valuationTabProjection") },
    { id: "buildup", label: t("valuationTabBuildup") },
  ];

  const xDomain: [number, number] = [1, years];
  const projectionSeries: ChartSeries[] = [
    { key: "fcf", label: t("valuationFcfLabel"), color: "#22c55e", strokeWidth: 2.5 },
    { key: "pv", label: t("valuationPvLabel"), color: "#38bdf8", strokeWidth: 2.5, dash: "5 4" },
  ];
  const projectionYMax = Math.max(...data.map((p) => p.fcf)) * 1.05;

  const buildupSeries: ChartSeries[] = [
    { key: "cumulativePv", label: t("valuationBuildupLabel"), color: "#38bdf8", strokeWidth: 2.5, area: true },
  ];
  const buildupRefs: ChartReferenceLine[] = [{ axis: "y", value: ev, color: "#f97316", dash: "4 4" }];
  const buildupYMax = Math.max(ev, data[data.length - 1]?.cumulativePv ?? 0) * 1.05;

  return (
    <>
      <PageHeader title={t("valuationTitle")} description={t("valuationDesc")} />

      <Workspace columns="sidebar">
        <Panel title={t("valuationControlsTitle")}>
          <div className="controls-grid">
            <SliderField label={t("valuationFcf1Label")} min={10} max={500} step={5} value={fcf1} onChange={setFcf1} formatValue={money} />
            <SliderField label={t("valuationGrowthLabel")} min={0} max={0.2} step={0.005} value={growth} onChange={setGrowth} formatValue={pct} />
            <SliderField label={t("valuationYearsLabel")} min={1} max={15} step={1} value={years} onChange={setYears} formatValue={(v) => v.toFixed(0)} />
            <SliderField label={t("valuationTerminalGrowthLabel")} min={0} max={0.04} step={0.0025} value={terminalGrowth} onChange={setTerminalGrowth} formatValue={pct} />
            <SliderField label={t("valuationWaccLabel")} min={0.05} max={0.2} step={0.0025} value={wacc} onChange={setWacc} formatValue={pct} />
          </div>
        </Panel>

        <div className="module-main">
          <ChartContainer
            title={t("valuationChartTitle")}
            actions={<Tabs<ValuationTab> segmented items={tabs} value={tab} onChange={(id) => setTab(id as ValuationTab)} ariaLabel={t("valuationChartTitle")} />}
          >
            <div className="chart-wrap">
              {tab === "projection" ? (
                <LineChart
                  data={data}
                  xKey="year"
                  series={projectionSeries}
                  xDomain={xDomain}
                  yDomain={[0, projectionYMax]}
                  isMobile={isMobile}
                  tooltipLabel={(x) => `${t("valuationColYear")} ${x.toFixed(0)}`}
                  valueFormat={money}
                />
              ) : (
                <LineChart
                  data={data}
                  xKey="year"
                  series={buildupSeries}
                  xDomain={xDomain}
                  yDomain={[0, buildupYMax]}
                  referenceLines={buildupRefs}
                  isMobile={isMobile}
                  tooltipLabel={(x) => `${t("valuationColYear")} ${x.toFixed(0)}`}
                  valueFormat={money}
                />
              )}
            </div>
          </ChartContainer>

          <ValuationResults
            enterpriseValue={ev}
            terminalValue={tv}
            pvTerminal={pvTerminal}
            terminalShare={terminalShare}
            rows={data}
          />
        </div>
      </Workspace>
    </>
  );
}
