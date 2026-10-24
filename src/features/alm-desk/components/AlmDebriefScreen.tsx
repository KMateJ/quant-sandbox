import { AttributionBars, DebriefBanner, DebriefObjectives, DebriefPending, PolicyTable, money, pct, signedMoney } from "../../../components/game";
import { useI18n, type TranslationKey } from "../../../i18n";
import { objectiveViews } from "../missionCopy";
import { useAlmDebrief } from "../useAlmDebrief";
import type { AlmDeskModel } from "../useAlmDesk";
import SurplusChart from "./SurplusChart";

const tone = (x: number) => (x > 0 ? "up" : x < 0 ? "down" : undefined);

/// End-of-run review: verdict, objectives, attribution totals, surplus path and simple rules on the same shocks.
export default function AlmDebriefScreen({ desk }: { desk: AlmDeskModel }) {
  const { t } = useI18n();
  const { state, risk, cfg } = desk;
  const d = useAlmDebrief(desk);
  if (!state.settled) {
    const finish = () => {
      for (let i = state.game.round; i < cfg.years; i++) desk.step();
    };
    return (
      <div className="gdesk-debrief">
        <DebriefPending
          title={t("gkDebriefPendingTitle")}
          note={t("almdDebriefPendingNote", { years: cfg.years })}
          runLabel={t("gkDebriefRunToEnd")}
          onRun={finish}
          onBack={() => desk.setScreen("desk")}
        />
      </div>
    );
  }
  const row = (key: TranslationKey, value: number) => ({ label: t(key), value, display: signedMoney(value) });
  const a = d.totals;
  const cells = (r: { final: number; worst: number; costs: number; trades: number }) => [signedMoney(r.final), signedMoney(r.worst), money(r.costs), String(r.trades)];

  return (
    <div className="gdesk-debrief">
      <DebriefBanner
        id="almd-debrief-banner"
        passed={d.passed}
        stats={[
          { label: t("almdDebriefFinal"), value: signedMoney(d.you.final), tone: tone(Math.round(d.you.final)) },
          { label: t("almdDebriefFunded"), value: pct(risk.funded, 1) },
          { label: t("almdDebriefCosts"), value: money(state.costs) },
          { label: t("almdDebriefTrades"), value: String(state.trades) },
        ]}
      />
      <div className="gdesk-debrief-grid">
        <DebriefObjectives items={objectiveViews(desk.objectives, t)} />
        <AttributionBars
          id="almd-debrief-attribution"
          title={t("almdDebriefAttrTitle")}
          rows={[row("almdAttrCarry", a.carry), row("almdAttrRate", a.rate), row("almdAttrConvexity", a.convexity), row("almdAttrCost", a.cost)]}
          total={row("almdAttrTotal", a.carry + a.rate + a.convexity + a.cost)}
        />
        <div className="gdesk-debrief-chart">
          <SurplusChart desk={desk} />
        </div>
        <PolicyTable
          id="almd-debrief-policies"
          title={t("almdPolicyTitle")}
          columns={[t("almdPolicyColName"), t("almdPolicyColFinal"), t("almdPolicyColWorst"), t("almdPolicyColCosts"), t("almdPolicyColTrades")]}
          rows={[
            { name: t("almdPolicyYou"), cells: cells(d.you), highlight: true },
            ...d.policies.map((p) => ({ name: t(`almdPolicy${p.key}` as TranslationKey), cells: cells(p) })),
          ]}
          note={t("almdPolicyNote")}
        />
      </div>
    </div>
  );
}
