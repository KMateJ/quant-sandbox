import { useI18n } from "../../../i18n";
import { IntuitionTrigger } from "../../../components/intuition";
import type { OptObjective, OptPoint } from "../portfolioOptimization.types";
import type { ConstraintCost } from "../useOptimization";
import { frontierObjectives } from "../frontier.controls";

type Props = {
  selected: OptPoint;
  objective: OptObjective;
  cost: ConstraintCost;
};

const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

/// Compact result strip for the selected portfolio plus the cost-of-constraints row.
export default function OptimalResult({ selected, objective, cost }: Props) {
  const { t } = useI18n();
  const fmt = (v: number) => (cost.metric === "sharpe" ? v.toFixed(2) : pct(v));
  const costWord =
    cost.metric === "sharpe" ? t("optCostSharpe") : cost.metric === "ret" ? t("optCostReturn") : t("optCostVol");
  const sign = cost.delta >= 0 ? "+" : "−";
  const deltaStr = cost.metric === "sharpe" ? Math.abs(cost.delta).toFixed(2) : pct(Math.abs(cost.delta));

  return (
    <div className="result-strip opt-result">
      <div className="result-strip-title intuition-reveal intuition-control-help">{t("optSelectedTitle")}<IntuitionTrigger sectionId="portfolio-selection" /></div>
      <div className="result-strip-item">
        <span className="result-strip-label intuition-reveal">{t("optExpReturn")}<IntuitionTrigger sectionId="expected-return" /></span>
        <span className="result-strip-value">{pct(selected.ret)}</span>
      </div>
      <div className="result-strip-item">
        <span className="result-strip-label intuition-reveal">{t("optVolatility")}<IntuitionTrigger sectionId="volatility" /></span>
        <span className="result-strip-value">{pct(selected.vol)}</span>
      </div>
      <div className="result-strip-item">
        <span className="result-strip-label intuition-reveal">{t("optSharpe")}<IntuitionTrigger sectionId="sharpe-ratio" /></span>
        <span className="result-strip-value">{selected.sharpe.toFixed(2)}</span>
      </div>
      <div className="result-strip-item">
        <span className="result-strip-label intuition-reveal">{t("optObjectiveField")}<IntuitionTrigger sectionId={frontierObjectives[objective].sectionId} /></span>
        <span className="result-strip-value result-strip-value--text">{t(frontierObjectives[objective].labelKey)}</span>
      </div>
      <div className="result-strip-item result-strip-item--cost">
        <span className="result-strip-label intuition-reveal">{t("optUnconstrained")} → {t("optConstrained")}<IntuitionTrigger sectionId="constraint-cost" /></span>
        <span className="result-strip-value">
          {fmt(cost.unconstrained)} → {fmt(cost.constrained)}
          <span className="opt-cost-delta">{` ${sign}${deltaStr} ${costWord}`}</span>
        </span>
      </div>
    </div>
  );
}
