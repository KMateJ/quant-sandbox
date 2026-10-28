import { ScatterChart, type ScatterSeries } from "../../../components/charts";
import { useI18n } from "../../../i18n";
import { curveSizes, fmtShares, slippageBp, slippageCurve, touch } from "../orderBook.math";
import type { OrderBookLab } from "../useOrderBookLab";

/// Slippage vs order size for the current book, your previewed order, and every order you sent.
export default function SlippageChart({ lab, isMobile }: { lab: OrderBookLab; isMobile: boolean }) {
  const { t } = useI18n();
  const { side } = lab.preview;
  const book = lab.sim.book;
  const curve = slippageCurve(book, side, curveSizes(book, side)).filter((c) => Number.isFinite(c.bp));
  const mid = touch(book).mid;
  const p = lab.previewFill;
  const here = p.avgPrice !== null && mid !== null && p.unfilled === 0 ? [{ x: lab.preview.size, y: slippageBp(side, p.avgPrice, mid) }] : [];
  const sent = lab.sim.sent.filter((s) => Number.isFinite(s.slipBp)).map((s) => ({ x: s.size, y: s.slipBp }));
  const series: ScatterSeries[] = [
    { key: "curve", label: t(side === "buy" ? "obkCurveBuy" : "obkCurveSell"), color: side === "buy" ? "var(--negative)" : "var(--positive)", line: true, strokeWidth: 2, points: curve.map((c) => ({ x: c.size, y: c.bp })) },
    { key: "sent", label: t("obkSentOrders"), color: "var(--text-dim)", radius: 4, points: sent },
    { key: "preview", label: t("obkPreview"), color: "var(--primary)", radius: 6, points: here },
  ];
  const xMax = Math.max(100, ...curve.map((c) => c.size), ...sent.map((s) => s.x), ...here.map((h) => h.x));
  const yMax = Math.max(1, ...curve.map((c) => c.bp), ...sent.map((s) => s.y), ...here.map((h) => h.y));
  return (
    <ScatterChart
      series={series}
      xDomain={[0, xMax * 1.05]}
      yDomain={[0, yMax * 1.1]}
      isMobile={isMobile}
      xFormat={fmtShares}
      yFormat={(v) => v.toFixed(1)}
      xLabel={t("obkSizeAxis")}
      yLabel={t("obkBpAxis")}
    />
  );
}
