import { useMemo, useState } from "react";
import SliderField from "../../../../../components/SliderField";
import { useI18n } from "../../../../../i18n";
import { bondCashflowBalance } from "../../../guide.interactive2.math";
import GuideFigure from "../../GuideFigure";
import FigureReadout from "../FigureReadout";
import { fmt, pct } from "../figureFormat";
import DurationBalanceSvg from "./DurationBalanceSvg";

/// A bond's cash flows on a seesaw: the fulcrum is the Macaulay duration, the point where the present values balance.
export default function DurationBalanceFigure() {
  const { t } = useI18n();
  const [c, setC] = useState(0.05);
  const [T, setT] = useState(10);
  const [y, setY] = useState(0.05);
  const model = useMemo(() => bondCashflowBalance(c, T, y), [c, T, y]);
  const durationLabel = t("gi2DurationAt", { d: fmt(model.duration) });

  return (
    <GuideFigure title={t("gi2BalanceTitle")} labId="duration-convexity">
      <div className="gf-sliders">
        <SliderField label={t("gfFieldCoupon")} min={0} max={0.1} step={0.0025} value={c} onChange={setC} formatValue={(v) => pct(v, 2)} />
        <SliderField label={t("gfFieldBondMaturity")} min={1} max={30} step={1} value={T} onChange={setT} formatValue={(v) => v.toFixed(0)} />
        <SliderField label={t("gfFieldYield")} min={0} max={0.15} step={0.0025} value={y} onChange={setY} formatValue={(v) => pct(v, 2)} />
      </div>
      <DurationBalanceSvg flows={model.flows} duration={model.duration} years={T} label={t("gi2BalanceAria", { d: fmt(model.duration) })} durationLabel={durationLabel} />
      <div className="gi2-legend">
        <span className="gi2-swatch gi2-swatch--cf" />{t("gi2CashFlow")}
        <span className="gi2-swatch gi2-swatch--pv" />{t("gi2PresentValue")}
      </div>
      <FigureReadout
        items={[
          { label: t("gfBondPrice"), value: fmt(model.price) },
          { label: t("gfMacaulay"), value: fmt(model.duration), tone: "strong" },
          { label: t("gi2LastWeight"), value: pct(model.flows[model.flows.length - 1].weight, 1), tone: "accent" },
        ]}
      />
    </GuideFigure>
  );
}
