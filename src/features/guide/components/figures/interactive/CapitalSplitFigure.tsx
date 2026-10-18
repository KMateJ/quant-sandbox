import { useState } from "react";
import { SegmentedControl } from "../../../../../components/ui";
import { useI18n } from "../../../../../i18n";
import { CAPITAL_SPLIT, capitalSplit } from "../../../guide.interactive.capitalSplit.math";
import GuideFigure from "../../GuideFigure";
import FigureReadout from "../FigureReadout";
import { fmt, pct } from "../figureFormat";
import CapitalSplitBars from "./CapitalSplitBars";
import CapitalSplitCosts from "./CapitalSplitCosts";

/// Modigliani–Miller with taxes as a split bar: dragging debt into the firm adds the tax shield t·D to its value.
export default function CapitalSplitFigure() {
  const { t } = useI18n();
  const [dv, setDv] = useState(0.4);
  const [tax, setTax] = useState<number>(CAPITAL_SPLIT.tax);
  const split = capitalSplit(dv, tax);

  return (
    <GuideFigure title={t("ixCsTitle")} labId="capital-structure">
      <div className="gf-toolbar">
        <SegmentedControl<number>
          ariaLabel={t("ixCsTaxes")}
          value={tax}
          onChange={setTax}
          options={[
            { value: 0, label: t("ixCsNoTax") },
            { value: CAPITAL_SPLIT.tax, label: pct(CAPITAL_SPLIT.tax, 0) },
          ]}
        />
        <span className="cs-hint">{t("ixCsHint")}</span>
      </div>
      <div role="group" aria-label={t("ixCsAria")}>
        <CapitalSplitBars split={split} tax={tax} onChange={setDv} />
        <ul className="cs-legend">
          <li><span className="cs-swatch cs-debt" />{t("ixCsDebt")}</li>
          <li><span className="cs-swatch cs-equity" />{t("ixCsEquity")}</li>
          <li><span className="cs-swatch cs-shield" />{t("ixCsShield")}</li>
        </ul>
        <CapitalSplitCosts split={split} />
      </div>
      <FigureReadout
        items={[
          { label: t("ixCsDebtRatio"), value: pct(split.dv, 0) },
          { label: t("ixCsLeveredValue"), value: fmt(split.leveredValue, 2) },
          { label: t("ixCsShield"), value: fmt(split.shield, 2), tone: "accent" },
          { label: t("ixCsCostEquity"), value: pct(split.rE, 2) },
          { label: "WACC", value: pct(split.wacc, 2), tone: "strong" },
        ]}
      />
    </GuideFigure>
  );
}
