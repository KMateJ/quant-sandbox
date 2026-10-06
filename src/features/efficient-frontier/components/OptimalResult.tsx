import { useI18n } from "../../../i18n";
import { IntuitionTrigger } from "../../../components/intuition";
import type { OptObjective, OptPoint } from "../portfolioOptimization.types";
import type { ConstraintCost } from "../useOptimization";

type Props = {
  selected: OptPoint;
  objective: OptObjective;
  cost: ConstraintCost;
};

const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

const OBJ_KEY: Record<OptObjective, "optObjMinVar" | "optObjMaxSharpe" | "optObjTargetReturn" | "optObjTargetVol"> = {
  minVariance: "optObjMinVar",
  maxSharpe: "optObjMaxSharpe",
  targetReturn: "optObjTargetReturn",
  targetVolatility: "optObjTargetVol",
};

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
      <div className="result-strip-title">{t("optSelectedTitle")}</div>
      <div className="result-strip-item">
        <span className="result-strip-label">{t("optExpReturn")}<IntuitionTrigger sectionId="expected-return" /></span>
        <span className="result-strip-value">{pct(selected.ret)}</span>
      </div>
      <div className="result-strip-item">
        <span className="result-strip-label">{t("optVolatility")}<IntuitionTrigger sectionId="volatility" /></span>
        <span className="result-strip-value">{pct(selected.vol)}</span>
      </div>
      <div className="result-strip-item">
        <span className="result-strip-label">{t("optSharpe")}<IntuitionTrigger sectionId="sharpe-ratio" /></span>
        <span className="result-strip-value">{selected.sharpe.toFixed(2)}</span>
      </div>
      <div className="result-strip-item">
        <span className="result-strip-label">{t("optObjectiveField")}<IntuitionTrigger sectionId="constraints" /></span>
        <span className="result-strip-value result-strip-value--text">{t(OBJ_KEY[objective])}</span>
      </div>
      <div className="result-strip-item result-strip-item--cost">
        <span className="result-strip-label">{t("optUnconstrained")} → {t("optConstrained")}<IntuitionTrigger sectionId="constraints" /></span>
        <span className="result-strip-value">
          {fmt(cost.unconstrained)} → {fmt(cost.constrained)}
          <span className="opt-cost-delta">{` ${sign}${deltaStr} ${costWord}`}</span>
        </span>
      </div>
    </div>
  );
}
