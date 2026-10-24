import { DeskGrid, DeskPair, EventLog, MissionPanel } from "../../../components/game";
import { useI18n } from "../../../i18n";
import { eventRows } from "../eventText";
import { missionText, objectiveViews } from "../ratesCopy";
import type { RatesDeskModel } from "../useRatesDesk";
import RatesRiskPanel from "./RatesRiskPanel";
import CurveChart from "./CurveChart";
import YieldMovesChart from "./YieldMovesChart";
import RatesPnlChart from "./RatesPnlChart";
import PositionsTable from "./PositionsTable";
import FuturesTicket from "./FuturesTicket";
import CtdMonitor from "./CtdMonitor";
import CurveScenarios from "./CurveScenarios";

/// Desk screen: mission, risk and events left; curve, moves, P&L and positions centre; ticket, CTD and scenarios right.
export default function RatesDeskScreen({ desk }: { desk: RatesDeskModel }) {
  const { t } = useI18n();
  const { mission, day } = desk;
  const text = missionText(mission.id, t);
  return (
    <DeskGrid
      left={
        <>
          <MissionPanel
            id="ratd-mission"
            title={t("ratdMissionTitle")}
            heading={text.heading}
            brief={text.brief}
            clockLabel={t("ratdMissionClock", { day, days: mission.days })}
            progress={day / mission.days}
            objectives={objectiveViews(desk, t)}
          />
          <RatesRiskPanel desk={desk} />
          <EventLog id="ratd-events" title={t("ratdEventsTitle")} rows={eventRows(desk.state.events, mission, t)} />
        </>
      }
      centre={
        <>
          <CurveChart desk={desk} />
          <DeskPair>
            <YieldMovesChart desk={desk} />
            <RatesPnlChart desk={desk} />
          </DeskPair>
          <PositionsTable desk={desk} />
        </>
      }
      right={
        <>
          <FuturesTicket desk={desk} />
          <CtdMonitor desk={desk} />
          <CurveScenarios desk={desk} />
        </>
      }
    />
  );
}
