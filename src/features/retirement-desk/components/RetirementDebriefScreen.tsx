import { AttributionBars, DebriefBanner, DebriefObjectives, DebriefPending, PolicyTable } from "../../../components/game";
import { useI18n, type TranslationKey } from "../../../i18n";
import { objectiveView } from "../objectiveViews";
import { RULE_KEY } from "../retirementCopy";
import { amount } from "../retirementFormat";
import { useRetirementDebrief, type RunSummary } from "../useRetirementDebrief";
import type { RetirementDeskModel } from "../useRetirementDesk";
import WealthChart from "./WealthChart";

/// End-of-plan review: verdict, objectives, wealth bridge, wealth path and simple rules on the same returns.
export default function RetirementDebriefScreen({ desk }: { desk: RetirementDeskModel }) {
  const { t } = useI18n();
  const k = (key: string, vars?: Record<string, string | number>) => t(key as TranslationKey, vars);
  const { state, mission } = desk;
  const d = useRetirementDebrief(desk);
  if (!state.settled) {
    return (
      <div className="gdesk-debrief">
        <DebriefPending
          title={t("gkDebriefPendingTitle")}
          note={t("retrDbPendingNote", { years: mission.years })}
          runLabel={t("gkDebriefRunToEnd")}
          onRun={() => desk.takeGuard(mission.years - state.year)}
          onBack={() => desk.setScreen("desk")}
        />
      </div>
    );
  }
  const signed = (x: number) => (x < 0 ? `−${amount(-x)}` : `+${amount(x)}`);
  const row = (key: TranslationKey, value: number, sign = true) => ({ label: t(key), value, display: sign ? signed(value) : amount(value) });
  const cells = (r: RunSummary) => [r.lasts ? t("retrDbYes") : t("retrDbNoYear", { y: r.outYear }), amount(r.avg), String(r.cuts), amount(r.left)];
  const b = d.bridge;

  return (
    <div className="gdesk-debrief">
      <DebriefBanner
        id="retr-debrief-banner"
        passed={d.passed}
        stats={[
          { label: t("retrDbTotal"), value: amount(d.you.total) },
          { label: t("retrDbAverage"), value: amount(d.you.avg) },
          { label: t("retrDbLeft"), value: amount(d.you.left), tone: d.you.lasts ? undefined : "down" },
          { label: t("retrDbCuts"), value: String(d.you.cuts) },
        ]}
      />
      <div className="gdesk-debrief-grid">
        <DebriefObjectives items={desk.objectives.map((r) => objectiveView(r, k, mission.years))} />
        <AttributionBars
          id="retr-debrief-attribution"
          title={t("retrDbAttrTitle")}
          rows={[row("retrDbAttrStart", b.start, false), row("retrDbAttrWithdrawn", b.withdrawn), row("retrDbAttrGrowth", b.growth)]}
          total={row("retrDbAttrEnd", b.end, false)}
        />
        <div className="gdesk-debrief-chart">
          <WealthChart desk={desk} />
        </div>
        <PolicyTable
          id="retr-debrief-policies"
          title={t("retrDbPolicyTitle")}
          columns={[t("retrDbColRule"), t("retrDbColLasts"), t("retrDbColAverage"), t("retrDbColCuts"), t("retrDbColLeft")]}
          rows={[
            { name: t("retrDbYou"), cells: cells(d.you), highlight: true },
            ...d.rules.map((r) => ({ name: t(RULE_KEY[r.rule], { amount: amount(mission.target) }), cells: cells(r) })),
          ]}
          note={t("retrDbPolicyNote")}
        />
      </div>
    </div>
  );
}
