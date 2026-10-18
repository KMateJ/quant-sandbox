import { useI18n } from "../../../i18n";
import type { CashFlowRow } from "../bondPricing.types";

type Props = { row: CashFlowRow; left: number; top: number };

/// Hover / focus readout of one payment's discounting: time, cash flow, discount factor and present value.
export default function TimelineTip({ row, left, top }: Props) {
  const { t } = useI18n();
  const num = (v: number) => v.toFixed(2);
  return (
    <div className="bond-timeline-tip" style={{ left, top }}>
      <div className="tip-row"><span>{t("bondHoverTime")}</span><b>{row.time.toFixed(2)} {t("bondHoverYears")}</b></div>
      <div className="tip-row"><span>{t("bondHoverCashflow")}</span><b>{num(row.cashflow)}</b></div>
      <div className="tip-row"><span>{t("bondHoverDf")}</span><b>{row.discountFactor.toFixed(4)}</b></div>
      <div className="tip-row"><span>{t("bondHoverPv")}</span><b>{num(row.presentValue)}</b></div>
    </div>
  );
}
