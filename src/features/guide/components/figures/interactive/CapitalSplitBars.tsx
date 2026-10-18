import CapitalSplitBar from "../../../../../components/charts/CapitalSplitBar";
import { useI18n } from "../../../../../i18n";
import {
  CAPITAL_SPLIT,
  CAPITAL_SPLIT_SCALE_MAX,
  clampDebtRatio,
  ratioForDebt,
  type CapitalSplit,
} from "../../../guide.interactive.capitalSplit.math";
import { fmt, pct } from "../figureFormat";

type Props = { split: CapitalSplit; tax: number; onChange: (dv: number) => void };

/// Unlevered and levered firm value as bars; the debt/equity boundary on the levered bar is draggable.
export default function CapitalSplitBars({ split, tax, onChange }: Props) {
  const { t } = useI18n();
  const { vU, maxDebtRatio } = CAPITAL_SPLIT;
  const mark = { value: vU };

  return (
    <div className="csb-bars">
      <CapitalSplitBar label={t("ixCsUnlevered")} segments={[{ key: "e", value: vU, tone: "equity" }]} scaleMax={CAPITAL_SPLIT_SCALE_MAX} reference={mark} />
      <CapitalSplitBar
        label={t("ixCsLevered")}
        segments={[
          { key: "d", value: split.debt, tone: "debt" },
          { key: "e", value: vU - split.debt, tone: "equity" },
          { key: "s", value: split.shield, tone: "shield" },
        ]}
        scaleMax={CAPITAL_SPLIT_SCALE_MAX}
        reference={{ value: vU, label: t("ixCsVuMark") }}
        handle={{
          ariaLabel: t("ixCsHandle"),
          valueNow: Math.round(split.dv * 100),
          valueMin: 0,
          valueMax: maxDebtRatio * 100,
          valueText: t("ixCsHandleText", { dv: pct(split.dv, 0), debt: fmt(split.debt, 1) }),
          onPointerValue: (debt) => onChange(clampDebtRatio(ratioForDebt(debt, tax))),
          onKeyStep: (step) => onChange(clampDebtRatio(step === "min" ? 0 : step === "max" ? maxDebtRatio : split.dv + step / 100)),
        }}
      />
    </div>
  );
}
