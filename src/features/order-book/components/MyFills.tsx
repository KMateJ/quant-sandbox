import { PredictExplain } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import { fmtTicks } from "../orderBook.math";
import { markout } from "../queue.math";
import type { OrderBookLab } from "../useOrderBookLab";

const MARKOUT_S = 10;
const signed = (v: number) => `${v >= 0 ? "+" : "−"}${Math.abs(v).toFixed(1)}¢`;

/// Your executions with their 10-second markout (positive = the price then moved your way).
export default function MyFills({ lab }: { lab: OrderBookLab }) {
  const { t } = useI18n();
  const { myFills, mids } = lab.sim;
  const ready = (ft: number) => ft + MARKOUT_S < mids.length;
  const outs = myFills.map((f) => (ready(f.t) ? markout(f, (s) => mids[s], MARKOUT_S) : null));
  const done = outs.filter((o): o is number => o !== null);
  const sizeDone = myFills.reduce((s, f, i) => s + (outs[i] === null ? 0 : f.size), 0);
  const avg = sizeDone ? myFills.reduce((s, f, i) => s + (outs[i] ?? 0) * f.size, 0) / sizeDone : NaN;
  return (
    <div className="obk-myfills">
      <PredictExplain
        question={t("obkExplain2Q")}
        options={(["A", "B", "C"] as const).map((k) => ({ text: t(`obkExplain2${k}`), feedback: t(`obkExplain2${k}Fb`), correct: k === "B" }))}
      />
      {myFills.length === 0 ? <p className="obk-hint">{t("obkNoMyFills")}</p> : (
        <div className="obk-scroll obk-scroll--fills">
          <table className="obk-fill-table">
            <thead><tr><th>{t("obkTime")}</th><th>{t("obkSide")}</th><th>{t("obkPrice")}</th><th>{t("obkFilled")}</th><th>{t("obkMarkout", { s: MARKOUT_S })}</th></tr></thead>
            <tbody>
              {myFills.map((f, i) => (
                <tr key={i}>
                  <td>{f.t}s</td>
                  <td>{t(f.side === "buy" ? "obkBuy" : "obkSell")}{f.passive ? ` · ${t("obkPassive")}` : ""}</td>
                  <td>{fmtTicks(f.price)}</td>
                  <td>{f.size.toLocaleString("en-US")}</td>
                  <td>{outs[i] === null ? "…" : signed(outs[i]!)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {done.length > 0 && <p className="obk-fills-head">{t("obkAvgMarkout", { v: signed(avg) })}</p>}
    </div>
  );
}
