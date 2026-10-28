import { ChartContainer } from "../../../components/layout";
import { StatCard } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import type { FillRecord, RoundSummary as Summary } from "../marketMaking.types";
import { cents, usd } from "./mkmFormat";
import ReplayStrip from "./ReplayStrip";

/// After a round: the stats, a one-line verdict on informed flow and the replay of every fill.
export default function RoundSummary({ summary, fills }: { summary: Summary; fills: FillRecord[] }) {
  const { t } = useI18n();
  const verdict =
    summary.informedFills > 0
      ? t("mkmVerdictInformed", { n: summary.informedFills, total: summary.fills, cost: usd(-summary.informedCost) })
      : t("mkmVerdictNoise", { total: summary.fills });
  return (
    <ChartContainer title={t("mkmSummaryTitle")}>
      <div className="mkm-summary-stats">
        <StatCard label={t("mkmPnl")} value={usd(summary.pnl)} />
        <StatCard label={t("mkmAvgHalfSpread")} value={cents(summary.avgHalfSpread)} />
        <StatCard label={t("mkmFills")} value={summary.fills} />
        <StatCard label={t("mkmMaxInventory")} value={summary.maxAbsInventory.toLocaleString()} />
      </div>
      <p className="mkm-verdict">{verdict}</p>
      <ReplayStrip fills={fills} />
    </ChartContainer>
  );
}
