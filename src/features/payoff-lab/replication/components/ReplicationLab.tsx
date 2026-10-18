import type { PositionGroup, StrategyLeg } from "../../payoff.types";
import type { ReplicationModel } from "../useReplication";
import ShapeControls from "./ShapeControls";
import MarketControls from "./MarketControls";
import ReplicationChart from "./ReplicationChart";
import PortfolioPanel from "./PortfolioPanel";
import DensityChart from "./DensityChart";
import PortfolioCompare from "./PortfolioCompare";
import GridConvergence from "./GridConvergence";

type Props = {
  model: ReplicationModel;
  onOpenInBuilder: (next: { legs: StrategyLeg[]; groups: PositionGroup[] }, showComponents: boolean) => void;
};

/// Draw a terminal payoff, then see several static portfolios that replicate it at one price.
export default function ReplicationLab({ model, onOpenInBuilder }: Props) {
  return (
    <div className="view-layout">
      <div className="view-controls repl-controls">
        <ShapeControls model={model} />
        <MarketControls model={model} />
      </div>
      <div className="view-main">
        <ReplicationChart model={model} />
        <PortfolioPanel model={model} onOpenInBuilder={onOpenInBuilder} />
        <PortfolioCompare model={model} />
        <GridConvergence model={model} />
        <DensityChart model={model} />
      </div>
    </div>
  );
}
