import { DeskGrid, DeskPair } from "../../../components/game";
import type { AlmDeskModel } from "../useAlmDesk";
import AlmAttribution from "./AlmAttribution";
import AlmEvents from "./AlmEvents";
import AlmMissionCard from "./AlmMissionCard";
import AlmRiskPanel from "./AlmRiskPanel";
import AlmScenarioGrid from "./AlmScenarioGrid";
import CurveChart from "./CurveChart";
import HoldingsTable from "./HoldingsTable";
import RebalanceTicket from "./RebalanceTicket";
import SurplusChart from "./SurplusChart";

/// The desk screen: mission, risk and events left; curve, surplus and holdings centre; ticket and grid right.
export default function AlmDeskScreen({ desk }: { desk: AlmDeskModel }) {
  return (
    <DeskGrid
      left={
        <>
          <AlmMissionCard desk={desk} />
          <AlmRiskPanel desk={desk} />
          <AlmEvents desk={desk} />
        </>
      }
      centre={
        <>
          <CurveChart desk={desk} />
          <DeskPair>
            <SurplusChart desk={desk} />
            <AlmAttribution desk={desk} />
          </DeskPair>
          <HoldingsTable desk={desk} />
        </>
      }
      right={
        <>
          <RebalanceTicket desk={desk} />
          <AlmScenarioGrid desk={desk} />
        </>
      }
    />
  );
}
