import { LineChart } from "../../components/charts";
import type { ChartReferenceLine, ChartSeries } from "../../components/charts";
import { ChartContainer, PageHeader, Workspace } from "../../components/layout";
import { useMediaQuery } from "../../components/useMediaQuery";
import { useI18n } from "../../i18n";
import CapitalStructureControls from "./CapitalStructureControls";
import CapitalWorldsPanel from "./CapitalWorldsPanel";
import { MAX_DE, useCapitalStructureLab } from "./useCapitalStructureLab";

const pct = (v: number) => `${(v * 100).toFixed(2)}%`;

export default function CapitalStructureView() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const lab = useCapitalStructureLab();

  const ys = lab.data.flatMap((p) => [p.costOfEquity, p.wacc]);
  const series: ChartSeries[] = [
    { key: "costOfEquity", label: t("capStructKeLabel"), color: "#f97316", strokeWidth: 2.5 },
    { key: "wacc", label: t("capStructWaccLabel"), color: "#22c55e", strokeWidth: 2.5 },
  ];
  const referenceLines: ChartReferenceLine[] = [{ axis: "x", value: lab.debtEquity, color: "#38bdf8", dash: "4 4" }];

  return (
    <>
      <PageHeader title={t("navCapitalStructure")} description={t("capStructDesc")} />

      <Workspace columns="sidebar">
        <CapitalStructureControls lab={lab} />

        <div style={{ display: "grid", gap: "var(--space-4)", minWidth: 0 }}>
          <ChartContainer title={t("capStructChartTitle")}>
            <div className="chart-wrap">
              <LineChart
                data={lab.data}
                xKey="debtEquity"
                series={series}
                xDomain={[0, MAX_DE]}
                yDomain={[Math.min(...ys) * 0.9, Math.max(...ys) * 1.05]}
                referenceLines={referenceLines}
                isMobile={isMobile}
                tooltipLabel={(x) => `D/E = ${x.toFixed(2)}`}
                valueFormat={pct}
              />
            </div>
          </ChartContainer>
          <CapitalWorldsPanel lab={lab} />
        </div>
      </Workspace>
    </>
  );
}
