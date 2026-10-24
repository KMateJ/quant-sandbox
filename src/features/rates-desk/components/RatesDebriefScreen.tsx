import { AttributionBars, DebriefBanner, DebriefObjectives, DebriefPending, PolicyTable, money, signedMoney } from "../../../components/game";
import { useI18n, type TranslationKey } from "../../../i18n";
import { objectiveViews } from "../ratesCopy";
import { useRatesDebrief } from "../useRatesDebrief";
import type { RatesDeskModel } from "../useRatesDesk";
import RatesPnlChart from "./RatesPnlChart";

const tone = (x: number) => (x > 0 ? "up" : x < 0 ? "down" : undefined);

/// End-of-run review: verdict, objectives, P&L split, P&L path and simple rules on the same curve path.
export default function RatesDebriefScreen({ desk }: { desk: RatesDeskModel }) {
  const { t } = useI18n();
  const { state, mission } = desk;
  const d = useRatesDebrief(desk);
  if (!state.settled) {
    return (
      <div className="gdesk-debrief">
        <DebriefPending
          title={t("gkDebriefPendingTitle")}
          note={t("ratdDbPendingNote", { days: mission.days })}
          runLabel={t("gkDebriefRunToEnd")}
          onRun={() => desk.step(mission.days - state.day)}
          onBack={() => desk.setScreen("desk")}
        />
      </div>
    );
  }
  const row = (key: TranslationKey, value: number) => ({ label: t(key), value, display: signedMoney(value) });
  const p = d.parts;
  const cells = (r: { pnl: number; misses: number; traded: number; costs: number }) => [signedMoney(r.pnl), String(r.misses), String(r.traded), money(r.costs)];

  return (
    <div className="gdesk-debrief">
      <DebriefBanner
        id="ratd-debrief-banner"
        passed={d.passed}
        stats={[
          { label: t("ratdDbHedged"), value: signedMoney(p.total), tone: tone(Math.round(p.total)) },
          { label: t("ratdDbNaked"), value: signedMoney(p.bonds), tone: tone(Math.round(p.bonds)) },
          { label: t("ratdDbCosts"), value: money(state.costs) },
          { label: t("ratdDbMisses"), value: String(state.misses) },
        ]}
      />
      <div className="gdesk-debrief-grid">
        <DebriefObjectives items={objectiveViews(desk, t)} />
        <AttributionBars
          id="ratd-debrief-attribution"
          title={t("ratdDbAttrTitle")}
          rows={[row("ratdDbAttrBonds", p.bonds), row("ratdDbAttrFutures", p.futures), row("ratdDbAttrCosts", p.costs)]}
          total={row("ratdDbAttrTotal", p.total)}
        />
        <div className="gdesk-debrief-chart">
          <RatesPnlChart desk={desk} />
        </div>
        <PolicyTable
          id="ratd-debrief-policies"
          title={t("ratdDbPolicyTitle")}
          columns={[t("ratdDbColRule"), t("ratdDbColPnl"), t("ratdDbColMisses"), t("ratdDbColContracts"), t("ratdDbColCosts")]}
          rows={[
            { name: t("ratdDbPolYou"), cells: cells({ pnl: p.total, misses: state.misses, traded: state.traded, costs: state.costs }), highlight: true },
            ...d.policies.map((r) => ({ name: t(`ratdDbPol_${r.policy}` as TranslationKey), cells: cells(r) })),
          ]}
          note={t("ratdDbPolicyNote")}
        />
      </div>
    </div>
  );
}
