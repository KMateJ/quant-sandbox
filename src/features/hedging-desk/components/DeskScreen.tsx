import { DeskGrid, DeskPair, EventLog, MissionPanel } from "../../../components/game";
import { useI18n } from "../../../i18n";
import { blotterRows } from "../blotterText";
import { missionBriefKey, missionTitleKey, objectiveViews } from "../missionCopy";
import type { HedgingDeskModel } from "../useHedgingDesk";
import RiskPanel from "./RiskPanel";
import PriceSharesChart from "./PriceSharesChart";
import NetDeltaChart from "./NetDeltaChart";
import BookPnlChart from "./BookPnlChart";
import ScenarioPanel from "./ScenarioPanel";
import RiskProfileChart from "./RiskProfileChart";
import PositionsTable from "./PositionsTable";
import OrderTicket from "./OrderTicket";
import OptionChain from "./OptionChain";

/// The desk screen: mission and risk on the left, charts in the centre, ticket and chain on the right.
export default function DeskScreen({ desk }: { desk: HedgingDeskModel }) {
  const { t } = useI18n();
  const { mission, market, day, objectives } = desk;
  return (
    <DeskGrid
      left={
        <>
          <MissionPanel
            id="hd-mission"
            title={t("hdMissionPanelTitle")}
            heading={t(missionTitleKey(mission.id))}
            brief={t(missionBriefKey(mission.id))}
            clockLabel={t("hdSideClock", { day, days: market.days })}
            progress={day / market.days}
            objectives={objectiveViews(t, objectives, mission.band)}
          />
          <RiskPanel desk={desk} />
          <EventLog id="hd-blotter" title={t("hdBlotterTitle")} rows={blotterRows(t, desk.state.events, mission)} />
        </>
      }
      centre={
        <>
          <PriceSharesChart desk={desk} />
          <DeskPair>
            <NetDeltaChart desk={desk} />
            <BookPnlChart desk={desk} />
          </DeskPair>
          <DeskPair>
            <ScenarioPanel desk={desk} />
            <RiskProfileChart desk={desk} />
          </DeskPair>
          <PositionsTable desk={desk} />
        </>
      }
      right={
        <>
          <OrderTicket desk={desk} />
          <OptionChain desk={desk} />
        </>
      }
    />
  );
}
