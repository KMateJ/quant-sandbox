import { useState } from "react";
import { ParentSize } from "@visx/responsive";
import { SegmentedControl } from "../../../../../components/ui";
import { useI18n } from "../../../../../i18n";
import {
  RISK_AVERSIONS,
  clampWeight,
  completePortfolio,
  optimalWeight,
  snapWeight,
  utility,
} from "../../../guide.interactive.utilityIndifference.math";
import GuideFigure from "../../GuideFigure";
import FigureReadout from "../FigureReadout";
import { fmt, pct } from "../figureFormat";
import UtilityIndifferenceChart from "./UtilityIndifferenceChart";

/// Drag a complete portfolio along the capital allocation line and compare its indifference curve with the optimum's.
export default function UtilityIndifferenceFigure() {
  const { t } = useI18n();
  const [A, setA] = useState<number>(4);
  const [y, setY] = useState(1);
  const yStar = optimalWeight(A);
  const p = completePortfolio(y);
  const U = utility(p.mu, p.sigma, A);

  return (
    <GuideFigure title={t("ixUiTitle")} labId="efficient-frontier">
      <div className="gf-toolbar">
        <SegmentedControl<number>
          ariaLabel={t("ixUiRiskAversion")}
          value={A}
          onChange={setA}
          options={RISK_AVERSIONS.map((a) => ({ value: a, label: `A = ${a}` }))}
        />
        <span className="ui-hint">{t("ixUiHint")}</span>
      </div>
      <div className="gf-chart ui-chart" role="group" aria-label={t("ixUiAria")}>
        <ParentSize>
          {({ width, height }) =>
            width > 0 && height > 0 ? (
              <UtilityIndifferenceChart width={width} height={height} A={A} y={y} yStar={yStar} onChange={(v, snap) => setY(snap ? snapWeight(v, yStar) : clampWeight(v))} />
            ) : null
          }
        </ParentSize>
      </div>
      <ul className="ui-legend" aria-hidden="true">
        <li><span className="ui-key ui-key--cal" />{t("ixUiLegendCal")}</li>
        <li><span className="ui-key ui-key--cur" />{t("ixUiLegendCurrent")}</li>
        <li><span className="ui-key ui-key--opt" />{t("ixUiLegendOptimal")}</li>
      </ul>
      <FigureReadout
        items={[
          { label: t("ixUiWeight"), value: fmt(y, 2) },
          { label: t("ixUiMu"), value: pct(p.mu, 2) },
          { label: t("ixUiSigma"), value: pct(p.sigma, 1) },
          { label: t("ixUiUtility"), value: pct(U, 2), tone: "strong" },
          { label: t("ixUiCe"), value: pct(U, 2) },
          { label: t("ixUiOptimal"), value: fmt(yStar, 2), tone: "accent" },
        ]}
      />
    </GuideFigure>
  );
}
