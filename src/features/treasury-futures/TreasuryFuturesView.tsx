import { useMemo, useState } from "react";
import { ChartContainer, PageHeader, Panel, Workspace } from "../../components/layout";
import { IntuitionTrigger } from "../../components/intuition";
import { useI18n } from "../../i18n";
import { loadScenario, recalculateDeliveryBond, SCENARIO_LABELS, type ScenarioId } from "./scenarios";
import { accruedInterestOnDates, cheapestBond, deliveryEconomics, eurexConversionFactor, generalizedConversionFactor, type DeliverableBond } from "./treasuryFutures.math";
import BondBasket from "./components/BondBasket";
import DeliveryChart from "./components/DeliveryChart";
import CashFlowPanel from "./components/CashFlowPanel";

export default function TreasuryFuturesView() {
  const { t } = useI18n();
  const [data, setData] = useState(() => loadScenario("bund"));
  const [error, setError] = useState("");
  const results = useMemo(() => deliveryEconomics(data.bonds, data.futures), [data.bonds, data.futures]);
  const ctd = data.id === "bund" ? undefined : cheapestBond(results);
  const ranked = [...results].sort((a, b) => a.netBasis - b.netBasis);

  const updateBond = (index: number, patch: Partial<DeliverableBond>) => {
    try {
      const bonds = data.bonds.map((bond, i) => {
        if (i !== index) return bond;
        const next = { ...bond, ...patch };
        if (data.id === "bund" && ["couponRate", "maturity", "frequency"].some((key) => key in patch)) {
          if ("maturity" in patch) {
            const timestamp = Date.parse(`${data.deliveryDate}T00:00:00Z`) + next.maturity * 365.25 * 86400000;
            next.maturityDate = new Date(timestamp).toISOString().slice(0, 10);
          }
          next.principalPayments = [{ time: next.maturity, amount: 100 }];
          next.accruedInterest = accruedInterestOnDates(next.couponRate, next.frequency, next.maturityDate!, data.deliveryDate!);
          next.conversionFactor = next.frequency === 1
            ? eurexConversionFactor(next.couponRate, next.maturityDate!, data.deliveryDate!, data.notionalCoupon)
            : generalizedConversionFactor(next, 0, data.notionalCoupon, next.accruedInterest);
        }
        if (data.id === "amortizing" &&
          Object.keys(patch).some((key) => ["couponRate", "maturity", "frequency", "principalPayments"].includes(key))) {
          if ("maturity" in patch) {
            const count = bond.principalPayments.length;
            const years = Math.min(2, next.maturity);
            next.principalPayments = Array.from({ length: count }, (_, j) => ({
              time: next.maturity - years + (j + 1) * years / count,
              amount: 100 / count,
            }));
          }
          return recalculateDeliveryBond(next, data.delivery, data.marketYield, data.notionalCoupon);
        }
        return next;
      });
      setData({ ...data, bonds });
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Invalid bond input.");
    }
  };

  const updateSetting = (patch: { notionalCoupon?: number; delivery?: number; deliveryDate?: string; marketYield?: number }) => {
    try {
      const next = { ...data, ...patch };
      if (data.id === "bund") next.bonds = data.bonds.map((bond) => {
        const maturity = (Date.parse(`${bond.maturityDate}T00:00:00Z`) - Date.parse(`${next.deliveryDate}T00:00:00Z`)) / (365.25 * 86400000);
        const accrued = accruedInterestOnDates(bond.couponRate, bond.frequency, bond.maturityDate!, next.deliveryDate!);
        const updated = { ...bond, maturity, accruedInterest: accrued, principalPayments: [{ time: maturity, amount: 100 }] };
        return {
          ...updated,
          conversionFactor: bond.frequency === 1
            ? eurexConversionFactor(bond.couponRate, bond.maturityDate!, next.deliveryDate!, next.notionalCoupon)
            : generalizedConversionFactor(updated, 0, next.notionalCoupon, accrued),
        };
      });
      if (data.id === "amortizing") next.bonds = data.bonds.map((bond) =>
        recalculateDeliveryBond(bond, next.delivery, next.marketYield, next.notionalCoupon));
      setData(next);
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Invalid model input.");
    }
  };

  return <div className="intuition-on-demand treasury-futures">
    <PageHeader title={t("treasuryFuturesTitle")} description={t("treasuryFuturesDesc")} />
    <Workspace columns="sidebar">
      <Panel title={t("tfControls")}>
        <label className="tf-scenario">{t("tfScenario")}
          <select value={data.id} onChange={(e) => { setData(loadScenario(e.target.value as ScenarioId)); setError(""); }}>
            {(Object.keys(SCENARIO_LABELS) as ScenarioId[]).map((id) =>
              <option key={id} value={id}>{t(`tfScenario_${id}`)}</option>)}
          </select>
        </label>
        <BondBasket bonds={data.bonds} scenario={data.id} futures={data.futures}
          onFutures={(futures) => setData((d) => ({ ...d, futures }))}
          onBond={updateBond} onSetting={updateSetting}
          notionalCoupon={data.notionalCoupon} delivery={data.delivery} deliveryDate={data.deliveryDate} marketYield={data.marketYield}
          onAdd={() => setData((d) => ({ ...d, bonds: [...d.bonds, {
            id: String.fromCharCode(65 + d.bonds.length), couponRate: 0.06, maturity: 5, frequency: 2,
            principalPayments: [{ time: 5, amount: 100 }], cleanPrice: 100, conversionFactor: 1,
            accruedInterest: 0, priceSource: "given",
          }] }))}
          onRemove={(i) => setData((d) => ({ ...d, bonds: d.bonds.filter((_, index) => index !== i) }))} />
        {error && <p className="tf-error" role="alert">{error}</p>}
      </Panel>
      <div className="module-main">
        {data.id !== "bund" && <div className="tf-metrics">
          <Metric label={t("tfFuturesPrice")} value={data.futures.toFixed(2)} />
          <Metric label={t("tfCtd")} value={ctd ? `Bond ${ctd.id}` : "—"} accent />
          <Metric label={t("tfBasis")} value={ctd?.netBasis.toFixed(4) ?? "—"} />
          <Metric label={t("tfSpread")} value={ranked.length > 1 ? (ranked[1].netBasis - ranked[0].netBasis).toFixed(4) : t("tfNoSecond")} />
        </div>}
        <div className="tf-factor-strip">
          {ranked.map((bond) => <div className="tf-factor-item" key={bond.id}>
            <strong>{t("tfBond")} {bond.id}</strong>
            <span>{t("tfConversionFactor")} {bond.conversionFactor.toFixed(4)}</span>
            {data.id !== "bund" && <span>{t("tfInvoice")} {bond.invoiceDirty.toFixed(2)}</span>}
          </div>)}
        </div>
        <ChartContainer title={<span>{data.id === "bund" ? t("tfConversionExplorer") : t("tfSwitching")}
          <IntuitionTrigger sectionId={data.id === "bund" ? "conversion-factor" : "net-basis"} /></span>}>
          {data.id !== "bund" && ctd && <DeliveryChart bonds={data.bonds} futures={data.futures} selected={ctd.id} />}
          {data.id !== "bund" && ctd && <p className="tf-explanation"><strong>{t("tfBond")} {ctd.id} · {ctd.netBasis.toFixed(4)}.</strong> {t("tfWhyCtd")}</p>}
          {data.id === "bund" && <p className="tf-explanation">{t("tfNoMarketPrices")}</p>}
        </ChartContainer>
        <Panel title={t("tfResults")} actions={<IntuitionTrigger sectionId="invoice-price" />}>
          <div className="tf-table-scroll"><table className="tf-table">
            <thead><tr><th>{t("tfBond")}</th><th>{t("tfFactor")}</th>{data.id !== "bund" && <th>{t("tfBasis")}</th>}
              <th>{t("tfAccrued")}</th>{data.id !== "bund" && <><th>{t("tfInvoice")}</th><th>{t("tfDirtyDifference")}</th></>}</tr></thead>
            <tbody>{(data.id === "bund" ? results : ranked).map((bond) => <tr key={bond.id} className={bond.id === ctd?.id ? "is-ctd" : ""}>
              <th>{bond.id === ctd?.id ? "★ " : ""}{bond.id}</th><td>{bond.conversionFactor.toFixed(4)}</td>
              {data.id !== "bund" && <td>{bond.netBasis.toFixed(4)}</td>}
              <td>{bond.accruedInterest.toFixed(4)}</td>{data.id !== "bund" && <td>{bond.invoiceDirty.toFixed(4)}</td>}
              {data.id !== "bund" && <td>{bond.dirtyCostDifference.toFixed(4)}</td>}
            </tr>)}</tbody>
          </table></div>
          {data.id !== "bund" && <p className="tf-note">{t("tfCleanDirty")}</p>}
        </Panel>
        {data.id === "bund" ? results.map((bond) => <CashFlowPanel key={bond.id} bond={bond} delivery={data.delivery} marketYield={data.marketYield} />)
          : data.id === "amortizing" && ctd && <CashFlowPanel bond={ctd} delivery={data.delivery} marketYield={data.marketYield} />}
        <Panel title={t("tfAssumption")}><p className="tf-note">{data.note}</p></Panel>
      </div>
    </Workspace>
  </div>;
}

function Metric({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return <div className={`tf-metric${accent ? " accent" : ""}`}><span>{label}</span><strong>{value}</strong></div>;
}
