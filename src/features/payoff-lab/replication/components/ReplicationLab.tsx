import type { StrategyLeg } from "../../payoff.types";
import type { ReplicationModel } from "../useReplication";
import ShapeControls from "./ShapeControls";
import MarketControls from "./MarketControls";
import ReplicationChart from "./ReplicationChart";
import PortfolioPanel from "./PortfolioPanel";
import DensityChart from "./DensityChart";

type Props = {
  model: ReplicationModel;
  onOpenInBuilder: (legs: StrategyLeg[]) => void;
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
        <DensityChart model={model} />
      </div>
    </div>
  );
}
