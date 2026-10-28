import { useMemo } from "react";
import { AttributionBars, DebriefBanner, DebriefObjectives, DebriefPending, PolicyTable } from "../../../components/game";
import { num, signedMoney } from "../../../components/game/gameFormat";
import { allPassed } from "../../../lib/game/objectives";
import { useI18n } from "../../../i18n";
import { policyRows } from "../debrief.math";
import { maxAbsInventory } from "../help/whatIf.math";
import { POLICY_KEY } from "../mmCopy";
import { objectiveView } from "../objectiveViews";
import type { MmDeskModel } from "../useMarketMakingDesk";
import MmInformedReveal from "./MmInformedReveal";

const tone = (x: number) => (x > 0 ? "up" : x < 0 ? "down" : undefined);

/// After settlement: verdict, objectives, P&L attribution, the informed-flow reveal and the robots on the same market.
export default function MmDebriefScreen({ desk }: { desk: MmDeskModel }) {
  const { t } = useI18n();
  const { mission, state, market, seed, parts: p } = desk;
  const policies = useMemo(() => (state.settled ? policyRows(mission, seed, market, state) : []), [mission, seed, market, state]);

  if (!state.settled)
    return (
      <DebriefPending title={t("gkDebriefPendingTitle")} note={t("mmdDbPendingNote")} runLabel={t("gkDebriefRunToEnd")}
        onRun={() => desk.dispatch({ type: "step", ticks: mission.seconds })} onBack={() => desk.setScreen("desk")} />
    );

  const row = (label: string, value: number) => ({ label, value, display: signedMoney(value) });
  return (
    <div className="gdesk-debrief">
      <DebriefBanner id="mmd-debrief-banner" passed={allPassed(desk.objectives)} stats={[
        { label: t("mmdQPnl"), value: signedMoney(p.total), tone: tone(p.total) },
        { label: t("mmdQSpreadCap"), value: signedMoney(p.spread), tone: tone(p.spread) },
        { label: t("mmdQAdverse"), value: signedMoney(p.adverse), tone: tone(p.adverse) },
        { label: t("mmdDbMaxInv"), value: num(maxAbsInventory(state), 0) },
      ]} />
      <div className="gdesk-debrief-grid">
        <DebriefObjectives items={desk.objectives.map((r) => objectiveView(r, t))} />
        <AttributionBars id="mmd-debrief-attribution" title={t("mmdPnlTitle")}
          rows={[row(t("mmdPnlSpread"), p.spread), row(t("mmdPnlAdverse"), p.adverse), row(t("mmdPnlInventory"), p.inventory), row(t("mmdPnlFees"), p.fees)]}
          total={row(t("mmdPnlTotal"), p.total)} />
      </div>
      <MmInformedReveal desk={desk} />
      <PolicyTable id="mmd-debrief-policies" title={t("mmdDbPolicyTitle")} note={t("mmdDbPolicyNote")}
        columns={[t("mmdDbColPolicy"), t("mmdQPnl"), t("mmdDbMaxInv"), t("mmdQAdverse"), t("mmdQFees")]}
        rows={policies.map((r) => ({
          name: r.policy === "you" ? t("mmdDbYourRun") : t(POLICY_KEY[r.policy]),
          cells: [signedMoney(r.pnl), num(r.maxInv, 0), signedMoney(r.adverse), signedMoney(r.fees)],
          highlight: r.policy === "you",
        }))} />
      <div className="gdesk-debrief-actions">
        <button type="button" className="gdesk-debrief-btn gdesk-debrief-btn--primary" onClick={desk.restart}>{t("mmdDbRetry")}</button>
        <button type="button" className="gdesk-debrief-btn" onClick={desk.newSeed}>{t("mmdDbNewSeed")}</button>
        <button type="button" className="gdesk-debrief-btn" onClick={() => desk.setScreen("missions")}>{t("mmdDbMissions")}</button>
      </div>
    </div>
  );
}
