import { ScatterChart, type ScatterSeries } from "../../../components/charts";
import { useI18n } from "../../../i18n";
import { fmtPrice } from "../spreadEstimation.math";
import type { Print } from "../spreadEstimation.types";

type Props = {
  prints: Print[];
  /// Show the efficient price and colour prints by their true side.
  revealed: boolean;
  /// Index of the print being classified (ringed), if any.
  current?: number;
  /// Prints classified wrongly (ringed after a game).
  wrong?: Set<number>;
  /// Prints the axes fit to (defaults to `prints`), so a growing tape keeps a fixed frame.
  frame?: Print[];
  isMobile: boolean;
};

const sideColor = (q: 1 | -1) => (q === 1 ? "var(--positive)" : "var(--negative)");

/// Trade tape: prints over time, the bid–ask bounce, and (once revealed) the hidden efficient price.
export default function TapeChart({ prints, revealed, current, wrong, frame = prints, isMobile }: Props) {
  const { t } = useI18n();
  const all = frame.flatMap((x) => [x.p, x.m]);
  const lo = Math.min(...all);
  const hi = Math.max(...all);
  const pad = Math.max(2, (hi - lo) * 0.08);
  const label = (x: Print) => (revealed ? t(x.q === 1 ? "speBuy" : "speSell") : undefined);

  const series: ScatterSeries[] = [
    { key: "path", label: t("speTapeLine"), color: "var(--muted)", line: true, strokeWidth: 1, points: prints.map((x) => ({ x: x.t, y: x.p })), legend: false },
    {
      key: "prints",
      label: t("speTapePrints"),
      color: "var(--text-dim)",
      radius: 3.5,
      points: prints.map((x) => ({ x: x.t, y: x.p, label: label(x), color: revealed ? sideColor(x.q) : undefined })),
    },
  ];
  if (revealed) {
    series.push({ key: "m", label: t("speEfficient"), color: "var(--primary)", line: true, dash: "5 4", strokeWidth: 1.5, points: prints.map((x) => ({ x: x.t, y: x.m })) });
  }
  const rings = [...(wrong ?? [])].filter((i) => i < prints.length);
  if (current !== undefined && current < prints.length) rings.push(current);
  if (rings.length) {
    series.push({ key: "ring", label: t(wrong?.size ? "speWrongPrints" : "speCurrentPrint"), color: "var(--primary)", hollow: true, radius: 8, points: rings.map((i) => ({ x: prints[i].t, y: prints[i].p })) });
  }

  return (
    <ScatterChart
      series={series}
      xDomain={[-0.5, Math.max(frame.length, 10) - 0.5]}
      yDomain={[lo - pad, hi + pad]}
      isMobile={isMobile}
      xFormat={(v) => v.toFixed(0)}
      yFormat={fmtPrice}
      xLabel={t("speTradeAxis")}
      yLabel={t("spePriceAxis")}
    />
  );
}
