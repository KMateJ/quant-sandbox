import { DeskGrid, DeskPair, EventLog, MissionPanel } from "../../../components/game";
import { useI18n } from "../../../i18n";
import { eventText } from "../eventText";
import { objectiveView } from "../objectiveViews";
import { missionKeys } from "../portfolioCopy";
import type { PortfolioDeskModel } from "../usePortfolioDesk";
import CorrelationGrid from "./CorrelationGrid";
import FrontierChart from "./FrontierChart";
import NavChart from "./NavChart";
import PortfolioRiskPanel from "./PortfolioRiskPanel";
import PositionsTable from "./PositionsTable";
import RebalanceTicket from "./RebalanceTicket";
import ReturnHeat from "./ReturnHeat";

/// The desk screen: mission, risk and events on the left, charts and positions in the centre, ticket and heat strip on the right.
export default function PortfolioDeskScreen({ desk }: { desk: PortfolioDeskModel }) {
  const { t } = useI18n();
  const { mission, state } = desk;
  const left = (
    <>
      <MissionPanel
        id="pmgr-mission"
        title={t("pmgrMissionTitle")}
        heading={t(missionKeys(mission.id).title)}
        brief={t(missionKeys(mission.id).brief)}
        clockLabel={t("pmgrClock", { m: state.month, months: mission.months, left: mission.months - state.month })}
        progress={state.month / mission.months}
        objectives={desk.objectives.map((r) => objectiveView(r, t))}
      />
      <PortfolioRiskPanel desk={desk} />
      <EventLog id="pmgr-events" title={t("pmgrEventsTitle")} rows={[...state.events].reverse().map((e) => eventText(e, t))} />
    </>
  );
  const centre = (
    <>
      <NavChart desk={desk} />
      <DeskPair>
        <FrontierChart desk={desk} />
        <CorrelationGrid desk={desk} />
      </DeskPair>
      <PositionsTable desk={desk} />
    </>
  );
  const right = (
    <>
      <RebalanceTicket desk={desk} />
      <ReturnHeat desk={desk} />
    </>
  );
  return <DeskGrid left={left} centre={centre} right={right} />;
}
