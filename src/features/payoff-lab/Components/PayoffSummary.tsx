import SectionCard from "../../../components/SectionCard";
import type { StrategyLeg, ViewMode } from "../payoff.types";
import { detectSyntheticMatches } from "../payoff.math";
import { useI18n } from "../../../i18n";

type PayoffSummaryProps = {
  legs: StrategyLeg[];
  mode: ViewMode;
};

export default function PayoffSummary({ legs, mode }: PayoffSummaryProps) {
  const { language, t } = useI18n();
  const syntheticMatches = detectSyntheticMatches(legs);
  const primaryMatch = syntheticMatches[0] ?? null;

  const payoffNote =
    language === "hu"
      ? "A felismerés payoff-egyenértékűség alapján történik. Overlay görbe csak payoff módban jelenik meg, hogy profit nézetben ne legyen félrevezető."
      : "Detection is based on payoff equivalence. The overlay is shown only in payoff mode so profit mode stays honest.";

  const listTitle = language === "hu" ? "Felismerhető ekvivalensek" : "Detected equivalents";
  const countTitle = language === "hu" ? "Ekvivalens alakok" : "Equivalent forms";

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
            {primaryMatch ? primaryMatch.label : t("payoffSummaryNone")}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-title">{countTitle}</div>
          <div className="stat-value">{syntheticMatches.length}</div>
        </div>
      </div>

      {syntheticMatches.length > 0 && (
        <div className="success-card" style={{ marginTop: 16 }}>
          <div className="success-title">{listTitle}</div>
          <div className="success-text" style={{ marginBottom: 12 }}>
            {payoffNote}
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            {syntheticMatches.map((match) => (
              <div
                key={`${match.key}-${match.formula}`}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: "10px 12px",
                  background: "var(--surface)",
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{match.label}</div>
                <code
                  style={{
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    color: "var(--code-text)",
                  }}
                >
                  {match.formula}
                </code>
              </div>
            ))}
          </div>
        </div>
      )}
    </SectionCard>
  );
}
