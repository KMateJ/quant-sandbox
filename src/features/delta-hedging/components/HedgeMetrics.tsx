import { StatCard } from "../../../components/ui";
import { IntuitionTrigger } from "../../../components/intuition";
import { useI18n } from "../../../i18n";
import type { DeltaHedgingModel } from "../useDeltaHedging";

const signed = (v: number) => `${v < 0 ? "−" : "+"}${Math.abs(v).toFixed(3)}`;

/// What the hedger ends up with on this path, in money and as a share of the premium.
export default function HedgeMetrics({ model }: { model: DeltaHedgingModel }) {
  const { t } = useI18n();
  const { result } = model;
  const share = result.premium > 0 ? (result.hedgeError / result.premium) * 100 : 0;

  return (
    <div className="metric-strip dh-metrics">
      <StatCard label={<span className="intuition-reveal">{t("deltaHedgingPremium")} <IntuitionTrigger sectionId="replication" /></span>} value={result.premium.toFixed(3)} />
      <StatCard label={t("deltaHedgingPayoff")} value={result.payoff.toFixed(3)} />
      <StatCard label={t("deltaHedgingTerminalValue")} value={result.terminalValue.toFixed(3)} />
      <StatCard
        label={<span className="intuition-reveal">{t("deltaHedgingHedgeError")} <IntuitionTrigger sectionId="hedge-error" /></span>}
        value={<span className={result.hedgeError < 0 ? "dh-neg" : "dh-pos"}>{signed(result.hedgeError)}</span>}
      />
      <StatCard label={t("deltaHedgingErrorShare")} value={`${signed(share)}%`} />
      <StatCard label={t("deltaHedgingMaxError")} value={result.maxAbsError.toFixed(3)} />
    </div>
  );
}
