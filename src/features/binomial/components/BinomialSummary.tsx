import SectionCard from "../../../components/SectionCard";
import type { BinomialTreeResult } from "../binomial.types";
import { useI18n } from "../../../i18n";

type BinomialSummaryProps = {
  tree: BinomialTreeResult;
};

export default function BinomialSummary({ tree }: BinomialSummaryProps) {
  const { t } = useI18n();

  return (
    <SectionCard
      title={t("binomialSummaryTitle")}
      subtitle={t("binomialSummarySubtitle")}
    >
      {!tree.isValid && tree.validationKey ? (
        <div className="warning-card">
          <div className="warning-title">{t("binomialWarningTitle")}</div>
          <div className="warning-text">{t(tree.validationKey as any)}</div>
        </div>
      ) : null}

      <div className="stats-grid binomial-summary-grid">
        {/* Price */}
        <div className="stat-card binomial-summary-card">
          <div className="stat-title">{t("binomialPrice")}</div>
          <div className="stat-value">{tree.price.toFixed(4)}</div>
        </div>

        {/* q */}
        <div className="stat-card binomial-summary-card">
          <div className="stat-title">q</div>
          <div className="stat-value">{tree.q.toFixed(4)}</div>
        </div>

        {/* Replicating portfolio (2 rows high) */}
        {tree.replicatingPortfolio ? (
          <div className="stat-card binomial-summary-card binomial-summary-card--replication replication-tall">
            <div className="stat-title">
              {t("binomialReplicatingPortfolio")}
            </div>

            <div className="replication-stack">
              <div className="replication-item">
                <div className="replication-label">
                  {t("binomialStockPosition")}
                </div>
                <div
                  className={
                    tree.replicatingPortfolio.delta >= 0
                      ? "replication-value replication-positive"
                      : "replication-value replication-negative"
                  }
                >
                  {tree.replicatingPortfolio.delta >= 0 ? "+" : ""}
                  {tree.replicatingPortfolio.delta.toFixed(4)} · S₀
                </div>
              </div>

              <div className="replication-item">
                <div className="replication-label">
                  {t("binomialCashPosition")}
                </div>
                <div
                  className={
                    tree.replicatingPortfolio.bond >= 0
                      ? "replication-value replication-positive"
                      : "replication-value replication-negative"
                  }
                >
                  {tree.replicatingPortfolio.bond >= 0 ? "+" : ""}
                  {tree.replicatingPortfolio.bond.toFixed(4)}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Discount */}
        <div className="stat-card binomial-summary-card">
          <div className="stat-title">
            {t("binomialDiscountFactor")}
          </div>
          <div className="stat-value">{tree.discount.toFixed(4)}</div>
        </div>

        {/* Steps */}
        {tree.replicatingPortfolio ? (
        <div className="stat-card binomial-summary-card">
          <div className="stat-title">{t("binomialSteps")}</div>
          <div className="stat-value">{tree.steps}</div>
        </div>
        ): null}
      </div>
    </SectionCard>
  );
}