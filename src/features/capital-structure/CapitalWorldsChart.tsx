import { DragHandles, LineChart } from "../../components/charts";
import type { ChartReferenceLine, ChartSeries } from "../../components/charts";
import { useMediaQuery } from "../../components/useMediaQuery";
import { useI18n } from "../../i18n";
import { optimalTradeoffRatio, type CapitalWorld } from "./capitalStructure.math";
import { MAX_DE, type CapitalStructureLab } from "./useCapitalStructureLab";

const pct = (v: number) => `${(v * 100).toFixed(2)}%`;
const WORLDS: { key: CapitalWorld; label: "capStructWorldNoTax" | "capStructWorldTax" | "capStructWorldTradeoff"; color: string }[] = [
  { key: "noTax", label: "capStructWorldNoTax", color: "var(--chart-1)" },
  { key: "tax", label: "capStructWorldTax", color: "#22c55e" },
  { key: "tradeoff", label: "capStructWorldTradeoff", color: "var(--chart-4)" },
];

/// WACC of the three worlds against D/E: the selected world solid, the other two as faded dashed ghosts;
/// the dashed D/E line is draggable.
export default function CapitalWorldsChart({ lab }: { lab: CapitalStructureLab }) {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const series: ChartSeries[] = WORLDS.map((w) =>
    w.key === lab.world
      ? { key: w.key, label: t(w.label), color: w.color, strokeWidth: 2.75 }
      : { key: w.key, label: t(w.label), color: "var(--muted)", strokeWidth: 1.25, dash: "5 4" }
  );
  const ys = lab.worldsData.flatMap((p) => [p.noTax, p.tax, p.tradeoff]);
  const optimum = optimalTradeoffRatio(lab.taxRate);
  const referenceLines: ChartReferenceLine[] =
    lab.world === "tradeoff" && optimum > 0 ? [{ axis: "x", value: optimum / (1 - optimum), color: "var(--chart-4)", dash: "2 3" }] : [];

  return (
    <>
      <div className="chart-wrap" role="img" aria-label={t("capStructWorldsAria")}>
        <LineChart
          data={lab.worldsData}
          xKey="debtEquity"
          series={series}
          xDomain={[0, MAX_DE]}
          yDomain={[Math.min(...ys) * 0.95, Math.max(...ys) * 1.03]}
          referenceLines={referenceLines}
          isMobile={isMobile}
          tooltipLabel={(x) => `D/E = ${x.toFixed(2)}`}
          valueFormat={pct}
          legend={false}
          layer={(frame) => (
            <DragHandles
              frame={frame}
              handles={[{ id: "de", axis: "x", x: lab.debtEquity, min: 0, max: MAX_DE, step: 0.05, label: "D/E", color: "#38bdf8", format: (v) => v.toFixed(2) }]}
              onChange={(_, v) => v.x !== undefined && lab.setDebtEquity(v.x)}
            />
          )}
        />
      </div>
      {/* Own legend: the chart's built-in one wraps over the axis on phones with three long labels. */}
      <ul className="csb-legend">
        {WORLDS.map((w) => (
          <li key={w.key}>
            <svg width="22" height="10" aria-hidden="true">
              <line x1="1" x2="21" y1="5" y2="5" stroke={w.key === lab.world ? w.color : "var(--muted)"} strokeWidth={w.key === lab.world ? 3 : 1.5} strokeDasharray={w.key === lab.world ? undefined : "5 4"} />
            </svg>
            {t(w.label)}
          </li>
        ))}
      </ul>
    </>
  );
}
