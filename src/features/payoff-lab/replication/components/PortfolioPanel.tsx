import SectionCard from "../../../../components/SectionCard";
import { Tabs } from "../../../../components/ui";
import { IntuitionTrigger } from "../../../../components/intuition";
import { useI18n } from "../../../../i18n";
import type { StrategyLeg } from "../../payoff.types";
import { toStrategyLegs } from "../replication.math";
import { METHOD_LABEL_KEYS } from "../replication.labels";
import type { ReplicationMethod } from "../replication.types";
import { REPLICATION_METHODS, type ReplicationModel } from "../useReplication";
import PortfolioTable from "./PortfolioTable";
import PriceComparison from "./PriceComparison";

type Props = {
  model: ReplicationModel;
  onOpenInBuilder: (legs: StrategyLeg[]) => void;
};

/// The replicating portfolios side by side: pick one to inspect, compare all prices below.
export default function PortfolioPanel({ model, onOpenInBuilder }: Props) {
  const { t } = useI18n();
  const { method, setMethod, selected, market } = model;

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
      <div className="repl-table-actions">
        <button
          type="button"
          className="metric-button"
          disabled={!selected.legs.length}
          onClick={() => onOpenInBuilder(toStrategyLegs(selected, market))}
        >
          {t("replOpenInBuilder")} →
        </button>
      </div>
      <PriceComparison model={model} />
    </SectionCard>
  );
}
