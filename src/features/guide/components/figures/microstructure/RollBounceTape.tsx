import { ScatterChart, SERIES_PALETTE, type ScatterSeries } from "../../../../../components/charts";
import { useMediaQuery } from "../../../../../components/useMediaQuery";
import type { Print } from "../../../../spread-estimation/spreadEstimation.types";

type Props = { prints: Print[]; reveal: boolean; labels: { trades: string; efficient: string; x: string; y: string } };

const side = (q: 1 | -1) => (q === 1 ? "var(--positive)" : "var(--negative)");

/// Trade prices over time; the efficient price and the trade sides appear once revealed.
export default function RollBounceTape({ prints, reveal, labels }: Props) {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const all = prints.flatMap((x) => [x.p, x.m]);
  const pad = 2;
  const series: ScatterSeries[] = [
    { key: "path", label: labels.trades, color: "var(--muted)", line: true, strokeWidth: 1, legend: false, points: prints.map((x) => ({ x: x.t, y: x.p })) },
    { key: "trades", label: labels.trades, color: SERIES_PALETTE[0], radius: 3, points: prints.map((x) => ({ x: x.t, y: x.p, color: reveal ? side(x.q) : undefined })) },
  ];
  if (reveal) series.push({ key: "m", label: labels.efficient, color: "var(--primary)", line: true, dash: "5 4", strokeWidth: 1.5, points: prints.map((x) => ({ x: x.t, y: x.m })) });
  return (
    <ScatterChart
      series={series}
      xDomain={[0, prints.length]}
      yDomain={[Math.min(...all) - pad, Math.max(...all) + pad]}
      isMobile={isMobile}
      xFormat={(v) => v.toFixed(0)}
      yFormat={(v) => (v / 100).toFixed(2)}
      xLabel={labels.x}
      yLabel={labels.y}
    />
  );
}
