import { useI18n } from "../../../i18n";
import { fmtTicks } from "../orderBook.math";
import { queueBlocks, sharesInFront } from "../queue.math";
import type { OrderBookLab } from "../useOrderBookLab";
import FillOdds from "./FillOdds";

const n = (v: number) => v.toLocaleString("en-US");

/// The queue at your latest resting order's price, front → back, with cancel / rejoin / move controls.
export default function QueueStrip({ lab }: { lab: OrderBookLab }) {
  const { t } = useI18n();
  const order = lab.myOrders.reduce<(typeof lab.myOrders)[number] | null>((a, o) => (!a || o.id > a.id ? o : a), null);
  if (!order) return <p className="obk-hint">{t("obkNoResting")}</p>;
  const blocks = queueBlocks(lab.sim.book, order.price, order.side);
  const total = blocks.reduce((s, b) => s + b.size, 0);
  const { sim } = lab;
  const replace = (price: number) => {
    sim.cancelMine(order.id);
    sim.placeLimit(order.side, price, order.size);
  };
  const tick = order.side === "buy" ? 1 : -1;

  return (
    <div className="obk-queue">
      <p className="obk-queue-head">
        {t(order.side === "buy" ? "obkQueueBid" : "obkQueueAsk", { p: fmtTicks(order.price), n: n(order.size), ahead: n(order.ahead) })}
      </p>
      <div className="obk-queue-strip" role="img" aria-label={t("obkQueueAria", { ahead: n(order.ahead), total: n(total) })}>
        <span className="obk-queue-front">{t("obkFront")}</span>
        {blocks.map((b) => (
          <span key={b.id} className={b.mine ? "obk-block is-mine" : "obk-block"} style={{ flexGrow: b.size }} title={n(b.size)} />
        ))}
        <span className="obk-queue-back">{t("obkBack")}</span>
      </div>
      <div className="obk-queue-actions">
        <button type="button" className="preset-btn" onClick={() => sim.cancelMine(order.id)}>{t("obkCancel")}</button>
        <button type="button" className="preset-btn" onClick={() => replace(order.price)}>{t("obkRejoin")}</button>
        <button type="button" className="preset-btn" onClick={() => replace(order.price + tick)}>{t("obkImprove")}</button>
        <button type="button" className="preset-btn" onClick={() => replace(order.price - tick)}>{t("obkBackOff")}</button>
      </div>
      <FillOdds ahead={sharesInFront(lab.sim.book, order, order.ahead)} side={order.side} spec={sim.spec} />
    </div>
  );
}
