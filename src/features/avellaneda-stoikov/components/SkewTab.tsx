import type { AvsLab } from "../useAvellanedaStoikovLab";
import AsFormula from "./AsFormula";
import DayClock from "./DayClock";
import InventoryTrack from "./InventoryTrack";
import QuoteColumn from "./QuoteColumn";

/// Skew explorer: the inventory puck and day clock drive the price column and the live formula.
export default function SkewTab({ lab }: { lab: AvsLab }) {
  return (
    <div className="avs-skew">
      <div className="avs-skew-controls">
        <InventoryTrack q={lab.q} onChange={lab.setQ} />
        <DayClock lab={lab} />
        <AsFormula params={lab.params} q={lab.q} t={lab.t} />
      </div>
      <QuoteColumn params={lab.params} q={lab.q} t={lab.t} />
    </div>
  );
}
