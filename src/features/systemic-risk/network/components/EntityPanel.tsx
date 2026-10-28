import { Link } from "react-router-dom";
import { Panel } from "../../../../components/layout";
import { StatCard } from "../../../../components/ui";
import { useI18n } from "../../../../i18n";
import { counterparties } from "../networkView.math";
import type { NetworkPageModel } from "../useNetworkPage";
import BalanceSheetBars from "./BalanceSheetBars";
import CounterpartyTable from "./CounterpartyTable";

const x = (v: number) => (Number.isFinite(v) ? `${v.toFixed(1)}×` : "–");
const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

/// Balance sheet, ratios, DebtRank and counterparties of the selected institution.
export default function EntityPanel({ m }: { m: NetworkPageModel }) {
  const { t } = useI18n();
  const { selected, metrics, s } = m;
  if (!selected || !metrics) {
    return <Panel title={t("syrEntityTitle")}><p className="control-hint">{t("syrEntityEmpty")}</p></Panel>;
  }
  const debt = m.debtRank.get(selected.id) ?? 0;
  const query = new URLSearchParams({ net: s.net, seed: String(s.seed), ...(s.edits ? { edits: s.edits } : {}), fail: selected.id });
  return (
    <Panel title={m.labelOf(selected.id)}>
      <p className="syr-entity-kind">
        {t(`syrKind_${selected.kind}`)} · {selected.id.toUpperCase()}
        {m.rank <= 3 && <strong className="syr-important"> · {t("syrImportant")}</strong>}
      </p>
      <div className="syr-stat-cells">
        <StatCard label={t("syrStatAssets")} value={`$${metrics.assets.toFixed(0)}bn`} />
        <StatCard label={t("syrStatLeverage")} value={x(metrics.leverage)} />
        <StatCard label={t("syrStatCapital")} value={pct(metrics.capitalRatio)} />
        <StatCard label={t("syrStatLiquidity")} value={Number.isFinite(metrics.liquidityRatio) ? pct(metrics.liquidityRatio) : "–"} />
        <StatCard label={t("syrStatDebtRank")} value={debt.toFixed(3)} />
        <StatCard label={t("syrStatRank")} value={`${m.rank} / ${m.net.institutions.length}`} />
      </div>
      <BalanceSheetBars inst={selected} net={m.net} />
      <CounterpartyTable rows={counterparties(m.net, selected.id)} m={m} />
      <Link className="preset-btn syr-fail" to={`/systemic-risk/shocks?${query.toString()}`}>{t("syrSimulateFailure")}</Link>
    </Panel>
  );
}
