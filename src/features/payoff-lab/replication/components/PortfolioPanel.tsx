import SectionCard from "../../../../components/SectionCard";
import { Tabs } from "../../../../components/ui";
import { IntuitionTrigger } from "../../../../components/intuition";
import { useI18n } from "../../../../i18n";
import type { PositionGroup, StrategyLeg } from "../../payoff.types";
import { toBuilderPositions } from "../replication.math";
import { METHOD_LABEL_KEYS } from "../replication.labels";
import type { ReplicationMethod } from "../replication.types";
import { LARGE_POSITION, REPLICATION_METHODS, type ReplicationModel } from "../useReplication";
import PortfolioTable from "./PortfolioTable";
import PriceComparison from "./PriceComparison";

type Props = {
  model: ReplicationModel;
  onOpenInBuilder: (next: { legs: StrategyLeg[]; groups: PositionGroup[] }, showComponents: boolean) => void;
};

/// The replicating portfolios side by side: pick one to inspect, compare all prices below.
export default function PortfolioPanel({ model, onOpenInBuilder }: Props) {
  const { t } = useI18n();
  const { method, setMethod, selected, portfolios, market, sizing } = model;
  const open = (list: typeof portfolios) =>
    onOpenInBuilder(toBuilderPositions(list, market, (p) => t(METHOD_LABEL_KEYS[p.method])), list.length > 1);

  return (
    <SectionCard
      title={t("replPortfoliosTitle")}
      subtitle={t("replPortfoliosSubtitle")}
      headerRight={<IntuitionTrigger sectionId="carr-madan" />}
    >
      <Tabs<ReplicationMethod>
        items={REPLICATION_METHODS.map((id) => ({ id, label: t(METHOD_LABEL_KEYS[id]) }))}
        value={method}
        onChange={setMethod}
        ariaLabel={t("replPortfoliosTitle")}
      />
      <PortfolioTable portfolio={selected} />
      {sizing.max > LARGE_POSITION && (
        <p className="repl-warning" role="note">
          {t("replWarnLarge", { q: sizing.max.toFixed(1), g: sizing.gross.toFixed(1) })}
        </p>
      )}
      <div className="repl-table-actions">
        <button
          type="button"
          className="metric-button"
          disabled={!selected.legs.length}
          onClick={() => open([selected])}
        >
          {t("replOpenInBuilder")} →
        </button>
        <button type="button" className="metric-button" onClick={() => open(portfolios)}>
          {t("replOpenAllInBuilder")} →
        </button>
      </div>
      <PriceComparison model={model} />
    </SectionCard>
  );
}
