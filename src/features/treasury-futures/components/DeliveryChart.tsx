import ScatterChart from "../../../components/charts/ScatterChart";
import type { ScatterSeries } from "../../../components/charts";
import { switchingPoints, type DeliverableBond } from "../treasuryFutures.math";
import { useI18n } from "../../../i18n";

const COLORS = ["#38bdf8", "#a78bfa", "#34d399", "#fb923c", "#f472b6", "#facc15", "#60a5fa"];

export default function DeliveryChart({ bonds, futures, selected }: {
  bonds: DeliverableBond[];
  futures: number;
  selected: string;
}) {
  const { t } = useI18n();
  const bondLabel = (id: string) => `${t("tfBond")} ${id}`;
  const lo = Math.max(1, futures - Math.max(12, futures * 0.16));
  const hi = futures + Math.max(12, futures * 0.16);
  const series: ScatterSeries[] = bonds.map((bond, index) => ({
    key: bond.id, label: bondLabel(bond.id), color: COLORS[index % COLORS.length],
    line: true, strokeWidth: bond.id === selected ? 3 : 1.8,
    points: Array.from({ length: 41 }, (_, i) => {
      const x = lo + (hi - lo) * i / 40;
      return { x, y: bond.cleanPrice - x * bond.conversionFactor };
    }),
  }));
  series.push({
    key: "current", label: t("tfFuturesPrice"), color: "#e2e8f0", line: false,
    radius: 5, legend: false,
    points: bonds.map((bond) => ({ x: futures, y: bond.cleanPrice - futures * bond.conversionFactor, label: bond.id })),
  });
  const switches = switchingPoints(bonds).filter((p) => p.price > lo && p.price < hi);
  if (switches.length) series.push({
    key: "switches", label: t("tfSwitching"), color: "#fbbf24", line: false, radius: 4, legend: false,
    points: switches.map((p) => {
      const bond = bonds.find((item) => item.id === p.from)!;
      return { x: p.price, y: bond.cleanPrice - p.price * bond.conversionFactor, label: `${p.from} → ${p.to} @ ${p.price.toFixed(2)}` };
    }),
  });
  return <div className="tf-chart-wrap">
    <ScatterChart series={series} xDomain={[lo, hi]} referenceLines={[{ axis: "x", value: futures, color: "#e2e8f0", dash: "4 4" }]}
      annotations={switches.map((p) => {
        const bond = bonds.find((item) => item.id === p.from)!;
        return { x: p.price, y: bond.cleanPrice - p.price * bond.conversionFactor, text: `${p.from}↔${p.to}`, color: "#fbbf24", fontSize: 10, dy: -10 };
      })}
      xLabel={t("tfFuturesPrice")}
      yLabel={t("tfBasis")} xFormat={(x) => x.toFixed(2)} yFormat={(y) => y.toFixed(2)}
      xTickValues={[lo, futures, hi]} yNumTicks={5} />
  </div>;
}
