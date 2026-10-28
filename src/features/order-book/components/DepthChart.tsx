import { DragHandles, LineChart, type ChartDatum } from "../../../components/charts";
import { useI18n } from "../../../i18n";
import { depthCurve, fmtShares, fmtTicks } from "../orderBook.math";
import type { OrderBookLab } from "../useOrderBookLab";

/// Cumulative depth by price (current solid, before your last order dashed); the handle sets the same preview as the ladder.
export default function DepthChart({ lab, isMobile }: { lab: OrderBookLab; isMobile: boolean }) {
  const { t } = useI18n();
  const now = depthCurve(lab.sim.book);
  const before = lab.last ? depthCurve(lab.last.before) : [];
  const byPrice = new Map<number, ChartDatum>();
  for (const d of now) byPrice.set(d.price, { price: d.price, bid: d.bid, ask: d.ask });
  for (const d of before) byPrice.set(d.price, { ...(byPrice.get(d.price) ?? { price: d.price }), bid0: d.bid, ask0: d.ask });
  const data = [...byPrice.values()].sort((a, b) => Number(a.price) - Number(b.price));
  const prices = data.map((d) => Number(d.price));
  const lo = Math.min(...prices);
  const hi = Math.max(...prices);
  const handleX = lab.rowPrice ?? lab.previewFill.rows.at(-1)?.price ?? lab.sim.centre;
  const frozen = lab.url.mode === "predict";

  return (
    <LineChart
      data={data}
      xKey="price"
      curve="linear"
      xDomain={[lo, hi]}
      series={[
        { key: "bid", label: t("obkBids"), color: "var(--positive)", strokeWidth: 2 },
        { key: "ask", label: t("obkAsks"), color: "var(--negative)", strokeWidth: 2 },
        { key: "bid0", label: t("obkBefore"), color: "var(--positive)", dash: "4 4", strokeWidth: 1, legend: Boolean(lab.last) },
        { key: "ask0", label: t("obkBefore"), color: "var(--negative)", dash: "4 4", strokeWidth: 1, legend: false },
      ]}
      isMobile={isMobile}
      xFormat={(v) => (Math.round(v) % 4 === 0 ? fmtTicks(v) : "")}
      yFormat={fmtShares}
      tooltipLabel={(v) => fmtTicks(v)}
      valueFormat={(v) => v.toLocaleString("en-US")}
      layer={frozen ? undefined : (frame) => (
        <DragHandles
          frame={frame}
          handles={[{ id: "row", axis: "x", x: handleX, min: lo, max: hi, step: 1, label: t("obkTakeTo"), format: (v) => fmtTicks(v) }]}
          onChange={(_, v) => v.x !== undefined && lab.setRowPrice(Math.round(v.x))}
        />
      )}
    />
  );
}
