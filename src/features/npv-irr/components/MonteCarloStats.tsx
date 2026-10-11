import KpiCard from "./KpiCard";
import { useI18n } from "../../../i18n";
import { money, pct } from "../npvIrr.format";
import type { MonteCarloResult } from "../npvIrr.types";

type MonteCarloStatsProps = { result: MonteCarloResult };

/// Summary statistics for the simulated NPV distribution.
export default function MonteCarloStats({ result }: MonteCarloStatsProps) {
  const { t } = useI18n();
  return (
    <div className="metric-strip">
      <KpiCard
        label={t("npvProbPositive")}
        value={pct(result.probPositive)}
        tone={result.probPositive >= 0.5 ? "good" : "bad"}
        info={t("npvInfoProbPositive")}
        sub={`${result.iterations.toLocaleString("en-US")} ${t("npvIterationsUnit")}`}
      />
      <KpiCard label={t("npvMeanNpv")} value={money(result.mean)} tone={result.mean >= 0 ? "good" : "bad"} />
      <KpiCard label={t("npvMedianNpv")} value={money(result.median)} tone={result.median >= 0 ? "good" : "bad"} />
      <KpiCard label={t("npvStdDev")} value={money(result.std)} tone="neutral" info={t("npvInfoStdDev")} />
      <KpiCard label={t("npvPercentileRange")} value={`${money(result.p5)} … ${money(result.p95)}`} tone="neutral" sub={t("npvConfidence90")} />
    </div>
  );
}
