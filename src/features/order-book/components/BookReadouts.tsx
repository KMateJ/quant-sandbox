import { StatCard } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import { fmtTicks, slippageBp, touch } from "../orderBook.math";
import type { OrderBookLab } from "../useOrderBookLab";

const near = (levels: { price: number; orders: { size: number }[] }[], from: number, band: number) =>
  levels.filter((l) => Math.abs(l.price - from) <= band).reduce((s, l) => s + l.orders.reduce((a, o) => a + o.size, 0), 0);

/// Touch, nearby depth and the previewed order's cost.
export default function BookReadouts({ lab }: { lab: OrderBookLab }) {
  const { t } = useI18n();
  const { bid, ask, mid } = touch(lab.sim.book);
  const p = lab.previewFill;
  const bp = p.avgPrice !== null && mid !== null ? slippageBp(lab.preview.side, p.avgPrice, mid) : NaN;
  const cost = Number.isFinite(bp) && mid !== null ? (Math.abs(p.avgPrice! - mid) * p.filled) / 100 : NaN;
  const depth5 = mid === null ? 0 : near(lab.sim.book.bids, mid, 5) + near(lab.sim.book.asks, mid, 5);
  return (
    <div className="obk-readouts">
      <StatCard label={t("obkBestBid")} value={bid === null ? "–" : fmtTicks(bid)} />
      <StatCard label={t("obkBestAsk")} value={ask === null ? "–" : fmtTicks(ask)} />
      <StatCard label={t("obkDepth5")} value={depth5.toLocaleString("en-US")} />
      <StatCard label={t("obkLevelsHit")} value={p.rows.length} />
      <StatCard label={t("obkAvgPrice")} value={p.avgPrice === null ? "–" : fmtTicks(p.avgPrice, 4)} />
      <StatCard label={t("obkSlippage")} value={Number.isFinite(bp) ? t("obkSlipValue", { bp: bp.toFixed(1), usd: cost.toFixed(2) }) : "–"} />
      {p.unfilled > 0 && <p className="obk-warn">{t("obkUnfilled", { n: p.unfilled.toLocaleString("en-US") })}</p>}
    </div>
  );
}
