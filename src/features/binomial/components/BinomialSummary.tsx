import SectionCard from "../../../components/SectionCard";
import { IntuitionTrigger } from "../../../components/intuition";
import { useMediaQuery } from "../../../components/useMediaQuery";
import type { BinomialTreeResult } from "../binomial.types";
import { useI18n } from "../../../i18n";
import BinomialReplication from "./BinomialReplication";

type Props = { tree: BinomialTreeResult };

export default function BinomialSummary({ tree }: Props) {
  const { t } = useI18n();
  const mobile = useMediaQuery("(max-width: 640px)");
  const isRates = tree.mode === "rates";
  const priceSection = isRates ? "short-rate-tree" : "spot-strike";
  const priceLabel = t(isRates ? "binomialBondPrice" : "binomialPrice");
  const metrics = [
    { key: "q", label: "q", value: tree.q.toFixed(4), sectionId: isRates ? "rate-probability" : "risk-neutral-probability" },
    { key: "discount", label: t("binomialDiscountFactor"), value: tree.discount.toFixed(4), sectionId: "discounting" },
    { key: "steps", label: t("binomialSteps"), value: String(tree.steps), sectionId: "tree-horizon" },
  ];
  const warning = !tree.isValid && tree.validationKey ? (
    <div className="warning-card">
      <div className="warning-title intuition-reveal">
        {t("binomialWarningTitle")} <IntuitionTrigger sectionId={isRates ? "rate-probability" : "risk-neutral-probability"} />
      </div>
      <div className="warning-text">{t(tree.validationKey)}</div>
    </div>
  ) : null;

  return (
    <SectionCard title={t("binomialSummaryTitle")} subtitle={t("binomialSummarySubtitle")}>
      {warning}
      {mobile ? (
        <div className="binomial-summary-mobile">
          <div className="summary-hero">
            <span className="summary-hero-label intuition-reveal">{priceLabel} <IntuitionTrigger sectionId={priceSection} /></span>
            <span className="summary-hero-value">{tree.price.toFixed(4)}</span>
          </div>
          <div className="summary-tiles">
            {metrics.map((metric) => (
              <div key={metric.key} className="summary-tile">
                <span className="summary-tile-label intuition-reveal">{metric.label} <IntuitionTrigger sectionId={metric.sectionId} /></span>
                <span className="summary-tile-value">{metric.value}</span>
              </div>
            ))}
          </div>
          {tree.replicatingPortfolio && <BinomialReplication portfolio={tree.replicatingPortfolio} mobile />}
        </div>
      ) : (
        <div className="stats-grid binomial-summary-grid">
          <div className="stat-card binomial-summary-card intuition-reveal">
            <div className="stat-title">{priceLabel} <IntuitionTrigger sectionId={priceSection} /></div>
            <div className="stat-value">{tree.price.toFixed(4)}</div>
          </div>
          <div className="stat-card binomial-summary-card intuition-reveal">
            <div className="stat-title">{metrics[0].label} <IntuitionTrigger sectionId={metrics[0].sectionId} /></div>
            <div className="stat-value">{metrics[0].value}</div>
          </div>
          {tree.replicatingPortfolio && <BinomialReplication portfolio={tree.replicatingPortfolio} mobile={false} />}
          {metrics.slice(1).filter((metric) => metric.key !== "steps" || tree.replicatingPortfolio).map((metric) => (
            <div key={metric.key} className="stat-card binomial-summary-card intuition-reveal">
              <div className="stat-title">{metric.label} <IntuitionTrigger sectionId={metric.sectionId} /></div>
              <div className="stat-value">{metric.value}</div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
