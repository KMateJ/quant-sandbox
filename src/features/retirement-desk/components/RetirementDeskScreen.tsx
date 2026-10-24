import { DeskGrid, DeskPair, EventLog, MissionPanel } from "../../../components/game";
import { useI18n } from "../../../i18n";
import { eventText } from "../eventText";
import { objectiveView } from "../objectiveViews";
import { missionKeys } from "../retirementCopy";
import type { RetirementDeskModel } from "../useRetirementDesk";
import DecisionTicket from "./DecisionTicket";
import OddsChart from "./OddsChart";
import RetirementRiskPanel from "./RetirementRiskPanel";
import ReturnStrip from "./ReturnStrip";
import RuleCompare from "./RuleCompare";
import WealthChart from "./WealthChart";
import YearTable from "./YearTable";

const EVENT_ROWS = 16;

/// The desk screen: mission, risk and events on the left, charts and the year table in the centre, decision and rules on the right.
export default function RetirementDeskScreen({ desk }: { desk: RetirementDeskModel }) {
  const { t } = useI18n();
  const { mission, state } = desk;
  const left = (
    <>
      <MissionPanel
        id="retr-mission"
        title={t("retrMissionTitle")}
        heading={t(missionKeys(mission.id).title)}
        brief={t(missionKeys(mission.id).brief)}
        clockLabel={t("retrClock", { y: state.year, years: mission.years, left: mission.years - state.year })}
        progress={state.year / mission.years}
        objectives={desk.objectives.map((r) => objectiveView(r, t, mission.years))}
      />
      <RetirementRiskPanel desk={desk} />
      <EventLog id="retr-events" title={t("retrEventsTitle")} rows={[...state.events].reverse().slice(0, EVENT_ROWS).map((e) => eventText(e, t))} />
    </>
  );
  const centre = (
    <>
      <WealthChart desk={desk} />
      <DeskPair>
        <ReturnStrip desk={desk} />
        <OddsChart desk={desk} />
      </DeskPair>
      <YearTable desk={desk} />
    </>
  );
  const right = (
    <>
      <DecisionTicket desk={desk} />
      <RuleCompare desk={desk} />
    </>
  );
  return <DeskGrid left={left} centre={centre} right={right} />;
}
