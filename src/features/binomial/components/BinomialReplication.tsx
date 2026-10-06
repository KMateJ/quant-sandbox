import { IntuitionTrigger } from "../../../components/intuition";
import { useI18n } from "../../../i18n";
import type { BinomialTreeResult } from "../binomial.types";

type Props = {
  portfolio: NonNullable<BinomialTreeResult["replicatingPortfolio"]>;
  mobile: boolean;
};

export default function BinomialReplication({ portfolio, mobile }: Props) {
  const { t } = useI18n();
  const items = [
    { key: "stock", label: t("binomialStockPosition"), value: portfolio.delta, suffix: " · S₀" },
    { key: "cash", label: t("binomialCashPosition"), value: portfolio.bond, suffix: "" },
  ];
  return (
    <div className={mobile ? "summary-replication" : "stat-card binomial-summary-card binomial-summary-card--replication replication-tall"}>
      <div className={`${mobile ? "summary-replication-title" : "stat-title"} intuition-reveal`}>
        {t("binomialReplicatingPortfolio")} <IntuitionTrigger sectionId="replication" />
      </div>
      <div className={mobile ? "summary-replication-row" : "replication-stack"}>
        {items.map((item) => (
          <div key={item.key} className={mobile ? "repl-cell" : "replication-item"}>
            <div className={`${mobile ? "repl-cell-label" : "replication-label"} intuition-reveal`}>
              {item.label} <IntuitionTrigger sectionId="replication" />
            </div>
            <div className={mobile
              ? `repl-cell-value ${item.value >= 0 ? "repl-positive" : "repl-negative"}`
              : `replication-value ${item.value >= 0 ? "replication-positive" : "replication-negative"}`}>
              {item.value >= 0 ? "+" : ""}{item.value.toFixed(4)}{item.suffix}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
