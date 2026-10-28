import { DeskGrid, EventLog, MissionPanel } from "../../../components/game";
import { useI18n } from "../../../i18n";
import { clockParts } from "../deskModel.math";
import { eventText } from "../eventText";
import { missionKeys } from "../mmCopy";
import { objectiveView } from "../objectiveViews";
import type { MmDeskModel } from "../useMarketMakingDesk";
import MmBookLadder from "./MmBookLadder";
import MmPriceChart from "./MmPriceChart";
import MmRiskPanel from "./MmRiskPanel";
import MmTape from "./MmTape";
import PnlAttribution from "./PnlAttribution";
import QuoteTicket from "./QuoteTicket";

/// The desk screen: mission, ticket and risk on the left; book, chart and tape in the centre; P&L attribution and events on the right.
export default function MmDeskScreen({ desk }: { desk: MmDeskModel }) {
  const { t } = useI18n();
  const { mission, state } = desk;
  const objectives = desk.objectives.map((r) => objectiveView(r, t));
  const left = (
    <>
      <MissionPanel id="mmd-mission" title={t("mmdMissionTitle")} heading={t(missionKeys(mission.id).title)}
        brief={t(missionKeys(mission.id).brief)} clockLabel={t("mmdClock", clockParts(state.t, mission.seconds))}
        progress={state.t / mission.seconds} objectives={objectives} />
      <QuoteTicket desk={desk} />
      <MmRiskPanel desk={desk} />
    </>
  );
  const centre = (
    <>
      <MmBookLadder desk={desk} />
      <MmPriceChart desk={desk} />
      <MmTape desk={desk} />
    </>
  );
  const right = (
    <>
      <PnlAttribution desk={desk} />
      <EventLog id="mmd-events" title={t("mmdEventsTitle")} rows={[...state.events].reverse().map((e) => eventText(e, t))} />
    </>
  );
  return <DeskGrid left={left} centre={centre} right={right} />;
}
