import { useState } from "react";
import { ParentSize } from "@visx/responsive";
import { useI18n } from "../../../i18n";
import { IntuitionTrigger } from "../../../components/intuition";
import type { CashFlowRow } from "../bondPricing.types";
import { BOND_COLORS } from "../bondColors";
import TimelineChart from "./TimelineChart";

const COUPON = BOND_COLORS.coupon;
const PRINCIPAL = BOND_COLORS.principal;

type Props = {
  rows: CashFlowRow[];
  face: number;
  /// True once the reader has reshaped the flows away from the standard coupon bond.
  custom: boolean;
  onFlow: (index: number, value: number) => void;
  onReset: () => void;
};

/// Legend, scale toggle and the draggable cash-flow timeline, with a way back to the standard bond.
export default function CashFlowTimeline({ rows, face, custom, onFlow, onReset }: Props) {
  const { t } = useI18n();
  const [split, setSplit] = useState(true);
  return (
    <div className="bond-timeline-wrap">
      <div className="bond-legend">
        <span className="bond-legend-item intuition-reveal"><i style={{ background: COUPON }} />{t("bondTimelineCoupon")}<IntuitionTrigger sectionId="coupon-rate" /></span>
        <span className="bond-legend-item intuition-reveal"><i style={{ background: PRINCIPAL }} />{t("bondTimelinePrincipal")}<IntuitionTrigger sectionId="face-value" /></span>
        <span className="bond-legend-item intuition-reveal"><i className="faint" />{t("bondTimelineCashflowLegend")}<IntuitionTrigger sectionId="cash-flows" /></span>
        <span className="bond-legend-item intuition-reveal"><i className="solid" />{t("bondTimelinePvLegend")}<IntuitionTrigger sectionId="price" /></span>
        <span className="intuition-reveal intuition-control-help bond-legend-split">
        <button
          type="button"
          className={`bond-toggle${split ? " active" : ""}`}
          aria-pressed={split}
          onClick={() => setSplit((v) => !v)}
        >
          {t("bondTimelineSplitLabel")}
        </button>
        <IntuitionTrigger sectionId="split-scale" />
        </span>
      </div>
      <div className="bond-custom-bar" role="status">
        <span className={custom ? "bond-custom-state is-custom" : "bond-custom-state"}>
          {t(custom ? "bondCustomActive" : "bondDragHint")}
        </span>
        {custom && <button type="button" className="bond-toggle" onClick={onReset}>{t("bondResetToBond")}</button>}
      </div>
      <div className="bond-timeline-slot">
        <ParentSize>
          {({ width, height }) =>
            width > 0 && height > 0
              ? <TimelineChart rows={rows} width={width} height={height} split={split} maxFlow={2 * face} onFlow={onFlow} />
              : null
          }
        </ParentSize>
      </div>
      <div className="bond-timeline-axis">{t("bondTimelineAxisTime")}</div>
    </div>
  );
}
