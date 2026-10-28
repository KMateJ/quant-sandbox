import { Fragment, type KeyboardEvent } from "react";
import { useI18n } from "../../../i18n";
import { fmtTicks, touch } from "../orderBook.math";
import type { OrderBookLab } from "../useOrderBookLab";
import LadderRow from "./LadderRow";
import { useSizeFlash } from "./useSizeFlash";

/// The price ladder: point at a row to preview a market order that takes everything to it; click or Enter sends.
export default function BookLadder({ lab }: { lab: OrderBookLab }) {
  const { t } = useI18n();
  const { rows, sim, rowPrice, setRowPrice, last, walk } = lab;
  const predicting = lab.url.mode === "predict";
  const changed = useSizeFlash(rows);
  const maxSize = Math.max(1, ...rows.map((r) => Math.max(r.bidSize, r.askSize)));
  const hit = new Set(last?.fills.slice(0, walk).map((f) => f.price));
  const { bid, ask, mid } = touch(sim.book);
  const point = (p: number) => !predicting && setRowPrice(p);
  const send = (p: number) => {
    if (predicting) return;
    if (lab.limitMode) lab.placeAt(p);
    else if (rowPrice === p) lab.send();
  };
  const ahead = new Map<number, number>();
  for (const o of lab.myOrders) if (!ahead.has(o.price)) ahead.set(o.price, o.ahead);
  const split = rows.findIndex((r) => ask !== null && r.price < ask);

  const limitHint = rowPrice !== null && lab.marketable(rowPrice) ? t("obkLimitMarketable") : t("obkLimitHint");

  const onKey = (e: KeyboardEvent) => {
    if (predicting) return;
    const start = rowPrice ?? ask ?? rows[0].price;
    if (e.key === "ArrowUp") setRowPrice(start + 1);
    else if (e.key === "ArrowDown") setRowPrice(start - 1);
    else if (e.key === "Enter") send(start);
    else if (e.key === "Escape") setRowPrice(null);
    else return;
    e.preventDefault();
  };

  return (
    <div className="obk-ladder" tabIndex={0} role="group" aria-label={t("obkLadderAria")} onKeyDown={onKey} onPointerLeave={() => setRowPrice(null)}>
      <table>
        <thead>
          <tr><th>{t("obkBids")}</th><th>{t("obkPrice")}</th><th>{t("obkAsks")}</th></tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <Fragment key={row.price}>
              {i === split && (
                <tr className="obk-spread-row">
                  <td colSpan={3}>
                    {mid !== null && bid !== null && ask !== null
                      ? t("obkSpreadRow", { mid: fmtTicks(mid, 3), ticks: ask - bid, cents: (ask - bid).toFixed(0) })
                      : t("obkOneSided")}
                  </td>
                </tr>
              )}
              <LadderRow row={row} maxSize={maxSize} hit={hit.has(row.price)} changed={changed.has(row.price)} myAhead={ahead.get(row.price)} onPoint={point} onSend={send} />
            </Fragment>
          ))}
        </tbody>
      </table>
      <p className="obk-hint">{predicting ? t("obkLadderFrozen") : lab.limitMode ? limitHint : t("obkLadderHint")}</p>
    </div>
  );
}
