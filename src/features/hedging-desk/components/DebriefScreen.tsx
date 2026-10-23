import { useDebrief } from "../useDebrief";
import type { HedgingDeskModel } from "../useHedgingDesk";
import DebriefBanner from "./debrief/DebriefBanner";
import DebriefObjectives from "./debrief/DebriefObjectives";
import DebriefPending from "./debrief/DebriefPending";
import PnlAttribution from "./debrief/PnlAttribution";
import PnlHistoryChart from "./debrief/PnlHistoryChart";
import PolicyCompare from "./debrief/PolicyCompare";
import ThetaGammaPanel from "./debrief/ThetaGammaPanel";

/// After expiry: why the run made or lost money and how auto-hedge policies did on the same path.
export default function DebriefScreen({ desk }: { desk: HedgingDeskModel }) {
  const debrief = useDebrief(desk);
  if (!desk.state.settled) {
    return (
      <div className="hdesk-debrief">
        <DebriefPending desk={desk} />
        <PolicyCompare desk={desk} debrief={debrief} />
      </div>
    );
  }
  return (
    <div className="hdesk-debrief">
      <DebriefBanner desk={desk} debrief={debrief} />
      <div className="hdesk-debrief-grid">
        <DebriefObjectives desk={desk} />
        <PnlAttribution debrief={debrief} />
        <PnlHistoryChart desk={desk} debrief={debrief} />
        <ThetaGammaPanel desk={desk} debrief={debrief} />
        <PolicyCompare desk={desk} debrief={debrief} />
      </div>
    </div>
  );
}
