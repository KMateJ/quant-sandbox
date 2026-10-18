import { StatCard } from "../../../../components/ui";
import { useI18n } from "../../../../i18n";
import { METHOD_LABEL_KEYS } from "../replication.labels";
import type { ReplicationModel } from "../useReplication";

/// The static portfolios agree with each other; on a strike grid they drift from the density price.
export default function PriceComparison({ model }: { model: ReplicationModel }) {
  const { t } = useI18n();
  const { portfolios, bl, market } = model;
  const totals = portfolios.map((p) => p.total);
  const gap = Math.max(...totals) - Math.min(...totals);
  const error = totals[0] - bl.price;

  return (
    <div className="stats-grid repl-prices">
      {portfolios.map((p) => (
        <StatCard key={p.method} label={t(METHOD_LABEL_KEYS[p.method])} value={p.total.toFixed(4)} />
      ))}
      <StatCard label={t("replPriceBL")} value={bl.price.toFixed(4)} />
      <StatCard label={t("replMaxDiff")} value={gap.toExponential(1)} />
      <StatCard
        label={market.strikeStep > 0 ? t("replGridError") : t("replQuadError")}
        value={`${error >= 0 ? "+" : "−"}${Math.abs(error).toFixed(4)}`}
      />
    </div>
  );
}
