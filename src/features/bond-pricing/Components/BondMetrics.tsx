import { IntuitionTrigger } from "../../../components/intuition";
import { useI18n } from "../../../i18n";
import { bondState } from "../bondPricing.math";

type BondMetricsProps = {
  cleanPrice: number;
  face: number;
  ytm: number;
  macaulay: number;
  modified: number;
  convexity: number;
};

const STATE_KEY = {
  premium: "bondStatePremium",
  par: "bondStatePar",
  discount: "bondStateDiscount",
} as const;

/// Grouped metrics with hierarchy: a dominant Price (plus premium/discount state),
/// then Yield, a combined Duration group and Convexity.
export default function BondMetrics({
  cleanPrice,
  face,
  ytm,
  macaulay,
  modified,
  convexity,
}: BondMetricsProps) {
  const { t } = useI18n();
  const num = (v: number) => v.toFixed(2);
  const pct = (v: number) => `${(v * 100).toFixed(2)}%`;
  const state = bondState(cleanPrice, face);

  return (
    <div className="bond-metrics-grid">
      <div className="bm-group bm-group--primary">
        <span className="bm-label">{t("bondCleanPrice")}<IntuitionTrigger sectionId="price" /></span>
        <span className="bm-value bm-value--lg">{num(cleanPrice)}</span>
        <span className={`bm-state bm-state--${state}`}>{t(STATE_KEY[state])}</span>
      </div>

      <div className="bm-group">
        <span className="bm-label">{t("bondMetricYield")}<IntuitionTrigger sectionId="ytm" /></span>
        <span className="bm-value">{pct(ytm)}</span>
      </div>

      <div className="bm-group">
        <span className="bm-label">{t("bondDuration")}</span>
        <div className="bm-sub">
          <span className="bm-sub-k">{t("bondMacaulayShort")}<IntuitionTrigger sectionId="macaulay-duration" /></span>
          <span className="bm-sub-v">{num(macaulay)}y</span>
          <span className="bm-sub-k">{t("bondModifiedShort")}<IntuitionTrigger sectionId="modified-duration" /></span>
          <span className="bm-sub-v">{num(modified)}</span>
        </div>
      </div>

      <div className="bm-group">
        <span className="bm-label">
          {t("bondConvexity")}
          <IntuitionTrigger sectionId="convexity" />
        </span>
        <span className="bm-value">{num(convexity)}</span>
      </div>
    </div>
  );
}
