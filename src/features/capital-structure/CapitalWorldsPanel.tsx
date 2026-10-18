import { CapitalSplitBar, WaterfallChart, type WaterfallStep } from "../../components/charts";
import { ChartContainer } from "../../components/layout";
import { SegmentedControl } from "../../components/ui";
import { useI18n } from "../../i18n";
import CapitalWorldsChart from "./CapitalWorldsChart";
import { UNLEVERED_VALUE, debtRatioForDebt, optimalTradeoffRatio, worldValue, type CapitalWorld } from "./capitalStructure.math";
import { MAX_DE, type CapitalStructureLab } from "./useCapitalStructureLab";

const num = (v: number) => v.toFixed(1);
const pct = (v: number) => `${(v * 100).toFixed(0)}%`;
const MAX_RATIO = MAX_DE / (1 + MAX_DE);

/// MM without taxes, MM with taxes and the trade-off world side by side: the selected world's firm value split
/// (debt / equity, draggable), its value bridge from V_U to V_L, and the WACC of all three worlds.
export default function CapitalWorldsPanel({ lab }: { lab: CapitalStructureLab }) {
  const { t } = useI18n();
  const { world, value, taxRate } = lab;
  // Fixed scale: the largest levered value any world reaches on the range, so the bar length is comparable.
  const scaleMax = worldValue("tax", MAX_RATIO, taxRate).leveredValue * 1.02;
  const setRatio = (L: number) => lab.setDebtEquity(Math.min(MAX_RATIO, Math.max(0, L)) / (1 - Math.min(MAX_RATIO, Math.max(0, L))));
  const steps: WaterfallStep[] = [
    { key: "vu", label: "VU", value: UNLEVERED_VALUE, kind: "total" },
    ...(world !== "noTax" ? [{ key: "shield", label: t("capStructShield"), value: value.shield }] : []),
    ...(world === "tradeoff" ? [{ key: "distress", label: t("capStructDistress"), value: -value.distress }] : []),
    { key: "vl", label: "VL", value: value.leveredValue, kind: "total" as const },
  ];

  return (
    <ChartContainer title={t("capStructCompareTitle")}>
      <SegmentedControl<CapitalWorld>
        ariaLabel={t("capStructWorld")}
        value={world}
        onChange={lab.setWorld}
        options={[
          { value: "noTax", label: t("capStructWorldNoTax") },
          { value: "tax", label: t("capStructWorldTax") },
          { value: "tradeoff", label: t("capStructWorldTradeoff") },
        ]}
      />
      <p className="control-hint">{t("capStructWorldsNote")}</p>
      <div className="csb-bars">
        <CapitalSplitBar label={t("capStructUnlevered")} segments={[{ key: "e", value: UNLEVERED_VALUE, tone: "equity" }]} scaleMax={scaleMax} reference={{ value: UNLEVERED_VALUE }} />
        <CapitalSplitBar
          label={t("capStructLevered")}
          segments={[{ key: "d", value: value.debt, tone: "debt" }, { key: "e", value: value.equity, tone: "equity" }]}
          scaleMax={scaleMax}
          reference={{ value: UNLEVERED_VALUE, label: t("capStructVuMark") }}
          handle={{
            ariaLabel: t("capStructHandle"),
            valueNow: Math.round(lab.debtRatio * 100),
            valueMin: 0,
            valueMax: Math.round(MAX_RATIO * 100),
            valueText: t("capStructHandleText", { de: lab.debtEquity.toFixed(2), d: num(value.debt) }),
            onPointerValue: (debt) => setRatio(debtRatioForDebt(world, debt, taxRate, MAX_RATIO)),
            onKeyStep: (s) => setRatio(s === "min" ? 0 : s === "max" ? MAX_RATIO : lab.debtRatio + s / 100),
          }}
        />
      </div>
      <ul className="csb-legend">
        <li><span className="csb-swatch csb-debt" />{t("capStructDebt")} {num(value.debt)}</li>
        <li><span className="csb-swatch csb-equity" />{t("capStructEquity")} {num(value.equity)}</li>
        <li>{t("capStructLeveredValue")} {num(value.leveredValue)}</li>
        {world === "tradeoff" && taxRate > 0 && <li>{t("capStructOptimum")} {pct(optimalTradeoffRatio(taxRate))}</li>}
      </ul>
      <p className="control-hint">{t("capStructDragHint")}</p>
      <WaterfallChart steps={steps} ariaLabel={t("capStructBridgeAria")} valueFormat={num} height={200} />
      <CapitalWorldsChart lab={lab} />
    </ChartContainer>
  );
}
