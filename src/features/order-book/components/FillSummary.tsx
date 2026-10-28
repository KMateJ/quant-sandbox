import { useI18n } from "../../../i18n";
import { fmtTicks } from "../orderBook.math";
import type { OrderBookLab } from "../useOrderBookLab";

/// Fills of your last market order, revealed level by level as it walks the book.
export default function FillSummary({ lab }: { lab: OrderBookLab }) {
  const { t } = useI18n();
  const { last, walk } = lab;
  if (!last) return <p className="obk-hint">{t("obkNoFills")}</p>;
  const shown = last.fills.slice(0, walk);
  const rows = shown.map((f, i) => ({ i, price: f.price, size: f.size, cum: shown.slice(0, i + 1).reduce((s, x) => s + x.size, 0) }));
  return (
    <div className="obk-fills">
      <p className="obk-fills-head">
        {t(last.side === "buy" ? "obkFilledBuy" : "obkFilledSell", { n: last.size.toLocaleString("en-US") })}
        {last.avgPrice !== null && ` · ${t("obkAvgAt", { p: fmtTicks(last.avgPrice, 4), bp: last.slipBp.toFixed(1) })}`}
      </p>
      <div className="obk-scroll obk-scroll--fills">
      <table className="obk-fill-table">
        <thead><tr><th>{t("obkPrice")}</th><th>{t("obkFilled")}</th><th>{t("obkCumulative")}</th></tr></thead>
        <tbody>
          {rows.map((r) => <tr key={r.i}><td>{fmtTicks(r.price)}</td><td>{r.size.toLocaleString("en-US")}</td><td>{r.cum.toLocaleString("en-US")}</td></tr>)}
        </tbody>
      </table>
      </div>
    </div>
  );
}
