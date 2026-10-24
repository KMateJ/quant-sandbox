import { useMemo } from "react";
import { AttributionBars, DebriefBanner, DebriefObjectives, DebriefPending, PolicyTable } from "../../../components/game";
import { pct } from "../../../components/game/gameFormat";
import { allPassed } from "../../../lib/game/objectives";
import { useI18n, type TranslationKey } from "../../../i18n";
import { attribution, policyRows } from "../debrief.math";
import { objectiveView } from "../objectiveViews";
import { ASSET_KEY } from "../portfolioCopy";
import { ASSET_CODES, FUND_SIZE, navIndex, spct } from "../portfolioFormat";
import type { PortfolioDeskModel } from "../usePortfolioDesk";
import NavChart from "./NavChart";

const millions = (x: number) => `${x >= 0 ? "+" : "−"}${Math.abs((x * FUND_SIZE) / 1e6).toFixed(2)}m`;

/// After settlement: verdict, objectives, return attribution, NAV chart and simple rules on the same path.
export default function PortfolioDebriefScreen({ desk }: { desk: PortfolioDeskModel }) {
  const { t } = useI18n();
  const { mission, state, path, seed, realized } = desk;
  const attr = useMemo(() => attribution(state, path.R, mission), [state, path, mission]);
  const policies = useMemo(() => (state.settled ? policyRows(mission, seed, state) : []), [mission, seed, state]);

  if (!state.settled)
    return (
      <DebriefPending title={t("gkDebriefPendingTitle")} note={t("pmgrDbPendingNote")} runLabel={t("gkDebriefRunToEnd")}
        onRun={() => desk.step(mission.months)} onBack={() => desk.setScreen("desk")} />
    );

  const vs = state.nav - state.bench;
  const row = (label: string, value: number) => ({ label, value, display: millions(value) });
  return (
    <div className="gdesk-debrief">
      <DebriefBanner id="pmgr-debrief-banner" passed={allPassed(desk.objectives)} stats={[
        { label: t("pmgrDbNav"), value: navIndex(state.nav) },
        { label: t("pmgrDbVsBench"), value: spct(vs), tone: vs > 0 ? "up" : vs < 0 ? "down" : undefined },
        { label: t("pmgrDbRealized"), value: pct(realized) },
        { label: t("pmgrDbMaxDd"), value: pct(-state.mdd) },
      ]} />
      <div className="gdesk-debrief-grid">
        <DebriefObjectives items={desk.objectives.map((r) => objectiveView(r, t))} />
        <AttributionBars id="pmgr-debrief-attribution" title={t("pmgrDbAttrTitle")}
          rows={[...ASSET_CODES.map((c, i) => row(t(ASSET_KEY[c]), attr.assets[i])), row(t("pmgrDbAttrCash"), attr.cash), row(t("pmgrDbAttrCosts"), attr.costs)]}
          total={row(t("pmgrDbAttrTotal"), attr.total)} />
      </div>
      <NavChart desk={desk} />
      <PolicyTable id="pmgr-debrief-policies" title={t("pmgrDbPolicyTitle")} note={t("pmgrDbPolicyNote")}
        columns={[t("pmgrDbColPolicy"), t("pmgrDbColNav"), t("pmgrDbColVol"), t("pmgrDbColDd"), t("pmgrDbColCosts")]}
        rows={policies.map((p) => ({
          name: t(`pmgrPolicy_${p.policy}` as TranslationKey),
          cells: [navIndex(p.nav), pct(p.vol), pct(-p.mdd), t("pmgrBp", { v: p.costsBp.toFixed(1) })],
          highlight: p.policy === "you",
        }))} />
      <div className="gdesk-debrief-actions">
        <button type="button" className="gdesk-debrief-btn gdesk-debrief-btn--primary" onClick={desk.restart}>{t("pmgrDbRetry")}</button>
        <button type="button" className="gdesk-debrief-btn" onClick={desk.newPath}>{t("pmgrDbNewPath")}</button>
        <button type="button" className="gdesk-debrief-btn" onClick={() => desk.setScreen("missions")}>{t("pmgrDbMissions")}</button>
      </div>
    </div>
  );
}
