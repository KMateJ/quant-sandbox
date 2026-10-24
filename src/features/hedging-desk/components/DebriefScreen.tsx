import {
  AttributionBars, DebriefBanner, DebriefObjectives, DebriefPending, PolicyTable,
} from "../../../components/game";
import { useI18n } from "../../../i18n";
import { objectiveViews } from "../missionCopy";
import { useDebrief } from "../useDebrief";
import type { HedgingDeskModel } from "../useHedgingDesk";
import { attributionRows, bannerStats, policyColumns, policyRows } from "./debrief/debriefViews";
import PnlHistoryChart from "./debrief/PnlHistoryChart";
import ThetaGammaPanel from "./debrief/ThetaGammaPanel";

/// After expiry: why the run made or lost money and how auto-hedge policies did on the same path.
export default function DebriefScreen({ desk }: { desk: HedgingDeskModel }) {
  const { t } = useI18n();
  const debrief = useDebrief(desk);
  const policies = (
    <PolicyTable
      id="hd-debrief-policies"
      title={t("hdDebriefPoliciesTitle")}
      columns={policyColumns(t)}
      rows={policyRows(t, desk, debrief)}
    />
  );
  if (!desk.state.settled) {
    const { day, market, step, setScreen } = desk;
    return (
      <div className="gdesk-debrief">
        <DebriefPending
          title={t("hdDebriefPendingTitle")}
          note={t("hdDebriefPendingNote", { day, days: market.days })}
          runLabel={t("hdDebriefRunToExpiry")}
          onRun={() => step(market.days - day)}
          onBack={() => setScreen("desk")}
        />
        {policies}
      </div>
    );
  }
  return (
    <div className="gdesk-debrief">
      <DebriefBanner id="hd-debrief-banner" passed={debrief.passed} stats={bannerStats(t, desk, debrief)} />
      <div className="gdesk-debrief-grid">
        <DebriefObjectives items={objectiveViews(t, desk.objectives, desk.mission.band)} />
        <AttributionBars id="hd-debrief-attribution" title={t("hdDebriefAttributionTitle")} {...attributionRows(t, debrief)} />
        <PnlHistoryChart desk={desk} debrief={debrief} />
        <ThetaGammaPanel desk={desk} debrief={debrief} />
        {policies}
      </div>
    </div>
  );
}
