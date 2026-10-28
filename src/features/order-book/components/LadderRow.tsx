import { memo } from "react";
import type { LadderEntry } from "../../../lib/market/ladder";
import { useI18n } from "../../../i18n";
import { fmtTicks } from "../orderBook.math";
import DepthBar from "./DepthBar";

type Props = {
  row: LadderEntry;
  maxSize: number;
  /// The price was just hit by your market order (walk animation).
  hit: boolean;
  /// The size changed since the last tick (brief tint).
  changed: boolean;
  /// Shares ahead of your first order at this price, if you rest one here.
  myAhead?: number;
  onPoint: (price: number) => void;
  onSend: (price: number) => void;
};

const n = (v: number) => v.toLocaleString("en-US");

/// One ladder price: bid size, price, ask size, with depth bars, your queued shares and the previewed take.
function LadderRow({ row, maxSize, hit, changed, myAhead, onPoint, onSend }: Props) {
  const { t } = useI18n();
  const mineBid = row.mine.bid > 0 && myAhead !== undefined ? { ahead: myAhead, size: row.mine.bid } : undefined;
  const mineAsk = row.mine.ask > 0 && myAhead !== undefined ? { ahead: myAhead, size: row.mine.ask } : undefined;
  const yours = row.mine.bid + row.mine.ask;
  const cls = ["obk-row", row.take > 0 ? "is-take" : "", hit ? "is-hit" : "", changed ? "is-changed" : "", yours ? "is-mine" : "", row.isBestBid ? "is-best-bid" : "", row.isBestAsk ? "is-best-ask" : ""];
  return (
    <tr className={cls.filter(Boolean).join(" ")} onPointerEnter={() => onPoint(row.price)} onClick={() => onSend(row.price)}>
      <td className="obk-cell obk-cell--bid">
        <DepthBar side="buy" size={row.bidSize} maxSize={maxSize} mine={mineBid} />
        <span className="obk-size">{row.bidSize > 0 ? n(row.bidSize) : ""}</span>
      </td>
      <td className="obk-cell obk-cell--price">
        {fmtTicks(row.price)}
        {row.take > 0 && <span className="obk-take">{t("obkTake", { n: n(row.take) })}</span>}
        {yours > 0 && <span className="obk-take">{t("obkYouAhead", { n: n(yours), ahead: n(myAhead ?? 0) })}</span>}
      </td>
      <td className="obk-cell obk-cell--ask">
        <DepthBar side="sell" size={row.askSize} maxSize={maxSize} mine={mineAsk} />
        <span className="obk-size">{row.askSize > 0 ? n(row.askSize) : ""}</span>
      </td>
    </tr>
  );
}

export default memo(LadderRow);
