import SectionCard from "../../../components/SectionCard";
import type { StrategyLeg, ViewMode } from "../payoff.types";
import { detectSyntheticMatches } from "../payoff.math";
import { useI18n } from "../../../i18n";

type PayoffSummaryProps = {
  /// Effective legs (positions already applied).
  legs: StrategyLeg[];
  positionCount: number;
  mode: ViewMode;
};

export default function PayoffSummary({ legs, positionCount, mode }: PayoffSummaryProps) {
  const { t } = useI18n();
  const syntheticMatches = detectSyntheticMatches(legs);
  const primaryMatch = syntheticMatches[0] ?? null;


  return (
    <SectionCard
      title={t("payoffSummaryTitle")}
      subtitle={t("payoffSummarySubtitle")}
    >
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-title">{t("payoffSummaryMode")}</div>
          <div className="stat-value">
            {mode === "payoff"
              ? t("payoffBuilderShowPayoff")
              : t("payoffBuilderShowProfit")}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-title">{t("payoffSummaryLegCount")}</div>
          <div className="stat-value">
            {legs.length}
            {positionCount > 0 && ` · ${t("payoffPositionCount", { n: positionCount })}`}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-title">{t("payoffSummarySyntheticDetection")}</div>
          <div className="stat-value">
            {primaryMatch ? primaryMatch.label : t("payoffSummaryNone")}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-title">{t("payoffSummaryEquivalentCount")}</div>
          <div className="stat-value">{syntheticMatches.length}</div>
        </div>
      </div>

      {syntheticMatches.length > 0 && (
        <div className="success-card payoff-summary-equivalents">
          <div className="success-title">{t("payoffSummaryEquivalentsTitle")}</div>
          <div className="success-text">{t("payoffSummaryNote")}</div>

          <div className="payoff-equivalents">
            {syntheticMatches.map((match) => (
              <div key={`${match.key}-${match.formula}`} className="payoff-equivalent">
                <div className="payoff-equivalent-title">{match.label}</div>
                <code>{match.formula}</code>
              </div>
            ))}
          </div>
        </div>
      )}
    </SectionCard>
  );
}
