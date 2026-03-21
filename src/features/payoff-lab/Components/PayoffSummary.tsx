import SectionCard from "../../../components/SectionCard";
import type { StrategyLeg, ViewMode } from "../payoff.types";
import {
  detectSyntheticLongForward,
  detectSyntheticShortForward,
} from "../payoff.math";
import { useI18n } from "../../../i18n";

type PayoffSummaryProps = {
  legs: StrategyLeg[];
  mode: ViewMode;
};

export default function PayoffSummary({ legs, mode }: PayoffSummaryProps) {
  const { t } = useI18n();

  const longForward = detectSyntheticLongForward(legs);
  const shortForward = detectSyntheticShortForward(legs);

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
          <div className="stat-value">{legs.length}</div>
        </div>

        <div className="stat-card">
          <div className="stat-title">{t("payoffSummarySyntheticDetection")}</div>
          <div className="stat-value">
            {longForward.detected
              ? "Synthetic Long Forward"
              : shortForward.detected
              ? "Synthetic Short Forward"
              : t("payoffSummaryNone")}
          </div>
        </div>
      </div>

      {(longForward.detected || shortForward.detected) && (
        <div className="success-card" style={{ marginTop: 16 }}>
          <div className="success-title">{t("payoffSummaryAlgebraTitle")}</div>
          <div className="success-text">
            {longForward.detected
              ? t("payoffSummaryLongForwardText")
              : t("payoffSummaryShortForwardText")}
          </div>
        </div>
      )}
    </SectionCard>
  );
}