import type { HedgingDeskModel } from "../useHedgingDesk";
import MissionPanel from "./MissionPanel";
import RiskPanel from "./RiskPanel";
import Blotter from "./Blotter";
import PriceSharesChart from "./PriceSharesChart";
import NetDeltaChart from "./NetDeltaChart";
import BookPnlChart from "./BookPnlChart";
import ScenarioMatrix from "./ScenarioMatrix";
import RiskProfileChart from "./RiskProfileChart";
import PositionsTable from "./PositionsTable";
import OrderTicket from "./OrderTicket";
import OptionChain from "./OptionChain";

/// The desk screen: mission and risk on the left, charts in the centre, ticket and chain on the right.
export default function DeskScreen({ desk }: { desk: HedgingDeskModel }) {
  return (
    <div className="hdesk-grid">
      <div className="hdesk-col hdesk-col--left">
        <MissionPanel desk={desk} />
        <RiskPanel desk={desk} />
        <Blotter desk={desk} />
      </div>
      <div className="hdesk-col hdesk-col--centre">
        <PriceSharesChart desk={desk} />
        <div className="hdesk-pair">
          <NetDeltaChart desk={desk} />
          <BookPnlChart desk={desk} />
        </div>
        <div className="hdesk-pair">
          <ScenarioMatrix desk={desk} />
          <RiskProfileChart desk={desk} />
        </div>
        <PositionsTable desk={desk} />
      </div>
      <div className="hdesk-col hdesk-col--right">
        <OrderTicket desk={desk} />
        <OptionChain desk={desk} />
      </div>
    </div>
  );
}
