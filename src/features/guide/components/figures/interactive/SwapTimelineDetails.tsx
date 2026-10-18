import { useI18n } from "../../../../../i18n";
import { SWAP_TIMELINE, type SwapPayment } from "../../../guide.interactive.swapTimeline.math";
import { pct } from "../figureFormat";
import type { SwapSelection } from "./SwapTimelineChart";

type Props = {
  selection: SwapSelection;
  payment?: SwapPayment;
  fixedRate: number;
  format: (value: number) => string;
};

/// How the selected payment is computed and discounted, with the numbers filled in.
export default function SwapTimelineDetails({ selection, payment, fixedRate, format }: Props) {
  const { t } = useI18n();
  if (!selection || !payment) return <p className="ix-sw-details ix-sw-details--hint">{t("ixSwHint")}</p>;

  const fixed = selection.leg === "fixed";
  const amount = fixed ? payment.fixed : payment.floating;
  const pv = fixed ? payment.pvFixed : payment.pvFloating;
  const amountFormula = t(fixed ? "ixSwFixedFormula" : "ixSwFloatingFormula", {
    notional: format(SWAP_TIMELINE.notional),
    rate: pct(fixed ? fixedRate : payment.forward, 2),
    amount: format(amount),
  });

  return (
    <div className={`ix-sw-details ix-sw-details--${selection.leg}`} aria-live="polite">
      <div className="ix-sw-details-head">
        <strong>{t("ixSwYear", { t: payment.t })}</strong>
        <span>{t(fixed ? "ixSwFixed" : "ixSwFloating")}</span>
      </div>
      <dl className="ix-sw-details-grid">
        <div><dt>{t("ixSwAmount")}</dt><dd>{format(amount)}</dd></div>
        <div><dt>{t("ixSwDf")}</dt><dd>{payment.df.toFixed(4)}</dd></div>
        <div><dt>{t("ixSwPv")}</dt><dd>{format(pv)}</dd></div>
      </dl>
      <p className="ix-sw-formula">{amountFormula}</p>
      <p className="ix-sw-formula">{t("ixSwPvFormula", { amount: format(amount), df: payment.df.toFixed(4), pv: format(pv) })}</p>
    </div>
  );
}
