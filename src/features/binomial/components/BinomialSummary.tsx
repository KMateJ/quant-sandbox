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
      {!tree.isValid && tree.validationKey? (
        <div className="warning-card">
          <div className="warning-title">{t("binomialWarningTitle")}</div>
          <div className="warning-text">{t(tree.validationKey as any)}</div>
        </div>
      ) : null}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-title">{t("binomialPrice")}</div>
          <div className="stat-value">{tree.price.toFixed(4)}</div>
        </div>

        <div className="stat-card">
          <div className="stat-title">q</div>
          <div className="stat-value">{tree.q.toFixed(4)}</div>
        </div>

        {tree.replicatingPortfolio ? (
          <div className="stat-card">
            <div className="stat-title">
              {t("binomialReplicatingPortfolio")}
            </div>

            <div className="stat-value">
              <div className="replication-row">
                <span>{t("binomialStockPosition")}</span>
                <span
                  className={
                    tree.replicatingPortfolio.delta >= 0
                      ? "replication-positive"
                      : "replication-negative"
                  }
                >
                  {tree.replicatingPortfolio.delta >= 0 ? "+" : ""}
                  {tree.replicatingPortfolio.delta.toFixed(4)} · S₀
                </span>
              </div>

              <div className="replication-row">
                <span>{t("binomialCashPosition")}</span>
                <span
                  className={
                    tree.replicatingPortfolio.bond >= 0
                      ? "replication-positive"
                      : "replication-negative"
                  }
                >
                  {tree.replicatingPortfolio.bond >= 0 ? "+" : ""}
                  {tree.replicatingPortfolio.bond.toFixed(4)}
                </span>
              </div>
            </div>
          </div>
        ) : null}

        <div className="stat-card">
          <div className="stat-title">u</div>
          <div className="stat-value">{tree.u.toFixed(4)}</div>
        </div>

        <div className="stat-card">
          <div className="stat-title">d</div>
          <div className="stat-value">{tree.d.toFixed(4)}</div>
        </div>

        <div className="stat-card">
          <div className="stat-title">
            {t("binomialDiscountFactor")}
          </div>
          <div className="stat-value">{tree.discount.toFixed(4)}</div>
        </div>
      </div>
    </SectionCard>
  );
}