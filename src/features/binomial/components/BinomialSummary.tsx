import SectionCard from "../../../components/SectionCard";
import { useMediaQuery } from "../../../components/useMediaQuery";
import type { BinomialTreeResult } from "../binomial.types";
import { useI18n } from "../../../i18n";

type BinomialSummaryProps = {
  tree: BinomialTreeResult;
};

export default function BinomialSummary({ tree }: BinomialSummaryProps) {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const warning =
    !tree.isValid && tree.validationKey ? (
      <div className="warning-card">
        <div className="warning-title">{t("binomialWarningTitle")}</div>
        <div className="warning-text">{t(tree.validationKey as any)}</div>
      </div>
    ) : null;

  if (isMobile) {
    const portfolio = tree.replicatingPortfolio;
    return (
      <SectionCard title={t("binomialSummaryTitle")} subtitle={t("binomialSummarySubtitle")}>
        {warning}

        <div className="binomial-summary-mobile">
          <div className="summary-hero">
            <span className="summary-hero-label">{t("binomialPrice")}</span>
            <span className="summary-hero-value">{tree.price.toFixed(4)}</span>
          </div>

          <div className="summary-tiles">
            <div className="summary-tile">
              <span className="summary-tile-label">q</span>
              <span className="summary-tile-value">{tree.q.toFixed(4)}</span>
            </div>
            <div className="summary-tile">
              <span className="summary-tile-label">{t("binomialDiscountFactor")}</span>
              <span className="summary-tile-value">{tree.discount.toFixed(4)}</span>
            </div>
            <div className="summary-tile">
              <span className="summary-tile-label">{t("binomialSteps")}</span>
              <span className="summary-tile-value">{tree.steps}</span>
            </div>
          </div>

          {portfolio ? (
            <div className="summary-replication">
              <div className="summary-replication-title">{t("binomialReplicatingPortfolio")}</div>
              <div className="summary-replication-row">
                <div className="repl-cell">
                  <span className="repl-cell-label">{t("binomialStockPosition")}</span>
                  <span
                    className={
                      portfolio.delta >= 0
                        ? "repl-cell-value repl-positive"
                        : "repl-cell-value repl-negative"
                    }
                  >
                    {portfolio.delta >= 0 ? "+" : ""}
                    {portfolio.delta.toFixed(4)} · S₀
                  </span>
                </div>
                <div className="repl-cell">
                  <span className="repl-cell-label">{t("binomialCashPosition")}</span>
                  <span
                    className={
                      portfolio.bond >= 0
                        ? "repl-cell-value repl-positive"
                        : "repl-cell-value repl-negative"
                    }
                  >
                    {portfolio.bond >= 0 ? "+" : ""}
                    {portfolio.bond.toFixed(4)}
                  </span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title={t("binomialSummaryTitle")}
      subtitle={t("binomialSummarySubtitle")}
    >
      {warning}

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