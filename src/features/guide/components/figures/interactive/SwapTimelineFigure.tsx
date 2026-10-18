import { useMemo, useState } from "react";
import SegmentedControl from "../../../../../components/ui/SegmentedControl";
import { useI18n } from "../../../../../i18n";
import { swapTimeline } from "../../../guide.interactive.swapTimeline.math";
import GuideFigure from "../../GuideFigure";
import FigureReadout from "../FigureReadout";
import SwapTimelineChart, { type SwapSelection } from "./SwapTimelineChart";
import SwapTimelineDetails from "./SwapTimelineDetails";

type Curve = "today" | "shifted";
const SHIFT: Record<Curve, number> = { today: 0, shifted: 0.005 };

/// Cash flows of the lesson's 3-year payer swap; each payment shows how it is discounted,
/// and a +50 bp shift of the curve grows only the floating leg.
export default function SwapTimelineFigure() {
  const { t, language } = useI18n();
  const [curve, setCurve] = useState<Curve>("today");
  const [selected, setSelected] = useState<SwapSelection>(null);
  const swap = useMemo(() => swapTimeline(SHIFT[curve]), [curve]);
  const maxAmount = useMemo(() => {
    const all = [swapTimeline(SHIFT.today), swapTimeline(SHIFT.shifted)].flatMap((s) => s.payments);
    return Math.max(...all.flatMap((p) => [p.fixed, p.floating])) * 1.05;
  }, []);
  const number = useMemo(() => new Intl.NumberFormat(language === "hu" ? "hu-HU" : "en-US", { maximumFractionDigits: 0 }), [language]);
  const format = (v: number) => number.format(Math.round(v) === 0 ? 0 : v);
  const payment = selected ? swap.payments.find((p) => p.t === selected.t) : undefined;

  return (
    <GuideFigure title={t("ixSwTitle")} labId="yield-curve">
      <div className="gf-toolbar">
        <div className="ix-sw-control">
          <span className="ix-sw-control-label">{t("ixSwCurve")}</span>
          <SegmentedControl<Curve>
            ariaLabel={t("ixSwCurve")}
            options={[
              { value: "today", label: t("ixSwToday") },
              { value: "shifted", label: t("ixSwShifted") },
            ]}
            value={curve}
            onChange={setCurve}
          />
        </div>
        <ul className="ix-sw-legend">
          <li className="ix-sw-legend--floating">{t("ixSwFloating")}</li>
          <li className="ix-sw-legend--fixed">{t("ixSwFixed")}</li>
          <li className="ix-sw-legend--pv">{t("ixSwPvLegend")}</li>
        </ul>
      </div>
      <SwapTimelineChart payments={swap.payments} maxAmount={maxAmount} selected={selected} onSelect={setSelected} format={format} />
      <SwapTimelineDetails selection={selected} payment={payment} fixedRate={swap.rate} format={format} />
      <FigureReadout
        items={[
          { label: t("ixSwPvFixed"), value: format(swap.pvFixed) },
          { label: t("ixSwPvFloating"), value: format(swap.pvFloating) },
          { label: t("ixSwValue"), value: format(swap.value), tone: "strong" },
          { label: t("ixSwDv01"), value: format(swap.dv01), tone: "accent" },
        ]}
      />
    </GuideFigure>
  );
}
