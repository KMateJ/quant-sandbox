import { ScatterChart, type ScatterSeries } from "../../../components/charts";
import { useI18n } from "../../../i18n";
import type { KyleLab } from "../useKyleLab";
import { fmtIndex, fmtPrice } from "./kyleFormat";

/// Price path p₀ → pₙ chasing the value (dashed line, insider view only); the optimal insider's path as a ghost.
export default function AuctionChart({ lab }: { lab: KyleLab }) {
  const { t } = useI18n();
  const { params, shown, optimal, draw } = lab;
  const insider = lab.url.view === "insider";
  const path = (prices: number[]) => [params.p0, ...prices].map((y, x) => ({ x, y }));
  const series: ScatterSeries[] = [
    { key: "you", label: t("kylYourPath"), color: "var(--primary)", line: true, strokeWidth: 2.6, legend: true, points: path(shown.map((r) => r.pAfter)) },
  ];
  if (insider)
    series.push({ key: "opt", label: t("kylOptPath"), color: "var(--muted)", line: true, dash: "4 4", strokeWidth: 1.6, legend: true, points: path(optimal.slice(0, shown.length).map((r) => r.pAfter)) });
  const ys = [params.p0, draw.v, ...shown.map((r) => r.pAfter), ...optimal.map((r) => r.pAfter)];
  const lo = Math.min(...ys);
  const hi = Math.max(...ys);
  const pad = Math.max(0.5, (hi - lo) * 0.1);
  return (
    <div className="chart-wrap kyl-path-chart">
      <ScatterChart
        series={series}
        xDomain={[0, params.n]}
        yDomain={[lo - pad, hi + pad]}
        xFormat={fmtIndex}
        yFormat={fmtPrice}
        xLabel={t("kylAuctionAxis")}
        yLabel={t("kylPriceAxis")}
        referenceLines={insider ? [{ axis: "y", value: draw.v, color: "var(--negative)", dash: "6 4" }] : []}
      />
    </div>
  );
}
