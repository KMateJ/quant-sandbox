import { StatCard } from "../../../../components/ui";
import { useI18n } from "../../../../i18n";
import { METHOD_LABEL_KEYS } from "../replication.labels";
import type { ReplicationModel } from "../useReplication";

/// Every static portfolio and the density integral price the same payoff; the gap shows how close.
export default function PriceComparison({ model }: { model: ReplicationModel }) {
  const { t } = useI18n();
  const { portfolios, bl } = model;
  const prices = [...portfolios.map((p) => p.total), bl.price];
  const gap = Math.max(...prices) - Math.min(...prices);

  return (
    <div className="stats-grid repl-prices">
      {portfolios.map((p) => (
        <StatCard key={p.method} label={t(METHOD_LABEL_KEYS[p.method])} value={p.total.toFixed(4)} />
      ))}
      <StatCard label={t("replPriceBL")} value={bl.price.toFixed(4)} />
      <StatCard label={t("replMaxDiff")} value={gap.toExponential(1)} />
      <StatCard label={t("replDensityMass")} value={bl.mass.toFixed(4)} />
    </div>
  );
}
