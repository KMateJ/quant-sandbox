import NumberInput from "../../../components/NumberInput";
import SliderField from "../../../components/SliderField";
import type { DeliverableBond } from "../treasuryFutures.math";
import type { ScenarioId } from "../scenarios";
import { useI18n } from "../../../i18n";

export default function BondBasket({ bonds, scenario, futures, onFutures, onBond, onAdd, onRemove, notionalCoupon, delivery, deliveryDate, marketYield, onSetting }: {
  bonds: DeliverableBond[];
  scenario: ScenarioId;
  futures: number;
  onFutures: (value: number) => void;
  notionalCoupon: number;
  delivery: number;
  deliveryDate?: string;
  marketYield: number;
  onSetting: (patch: { notionalCoupon?: number; delivery?: number; deliveryDate?: string; marketYield?: number }) => void;
  onBond: (index: number, patch: Partial<DeliverableBond>) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  const { t } = useI18n();
  return <div className="tf-controls">
    {scenario !== "bund" && <>
      <NumberInput label={t("tfFuturesPrice")} value={futures} onChange={onFutures} min={0} max={500} step={0.01} sectionId="net-basis" />
      <SliderField label={t("tfFuturesPrice")} min={50} max={200} step={0.25} value={futures} onChange={onFutures} formatValue={(v) => v.toFixed(2)} sectionId="net-basis" />
    </>}
    <NumberInput label={t("tfNotionalCoupon")} value={notionalCoupon} onChange={(v) => onSetting({ notionalCoupon: v })} min={0} max={0.2} step={0.25} percent sectionId="conversion-factor" />
    {scenario === "bund" ? <label className="tf-frequency">{t("tfDeliveryDate")}
      <input type="date" value={deliveryDate ?? ""} onChange={(e) => onSetting({ deliveryDate: e.target.value })} />
    </label> : <NumberInput label={t("tfDelivery")} value={delivery} onChange={(v) => onSetting({ delivery: v })} min={0} max={40} step={0.25} />}
    {scenario === "amortizing" && <NumberInput label={t("tfMarketYield")} value={marketYield} onChange={(v) => onSetting({ marketYield: v })} min={-0.05} max={0.3} step={0.25} percent />}
    {bonds.map((bond, i) => <fieldset className="tf-bond" key={`${bond.id}-${i}`}>
      <legend>Bond {bond.id}</legend>
      <div className="tf-input-grid">
        {scenario !== "bund" && <NumberInput label={t("tfCleanPrice")} value={bond.cleanPrice} onChange={(v) => onBond(i, { cleanPrice: v, priceSource: "given" })} min={0} max={300} step={0.01} sectionId="net-basis" />}
        <NumberInput label={t("tfFactor")} value={bond.conversionFactor} onChange={(v) => onBond(i, { conversionFactor: v })} min={0.01} max={3} step={0.0001} sectionId="conversion-factor" />
        <NumberInput label={t("tfAccrued")} value={bond.accruedInterest} onChange={(v) => onBond(i, { accruedInterest: v })} min={0} max={20} step={0.01} sectionId="accrued-interest" />
        {(scenario === "bund" || scenario === "amortizing" || bond.priceSource === "calculated") && <>
          <NumberInput label={t("tfCoupon")} value={bond.couponRate} onChange={(v) => onBond(i, { couponRate: v })} min={0} max={0.3} step={0.25} percent sectionId="conversion-factor" />
          <NumberInput label={t("tfMaturity")} value={bond.maturity} onChange={(v) => onBond(i, { maturity: v })} min={0.25} max={40} step={0.25} />
          <label className="tf-frequency">{t("tfFrequency")}
            <select value={bond.frequency} onChange={(e) => onBond(i, { frequency: Number(e.target.value) })}>
              <option value={1}>{t("tfAnnual")}</option><option value={2}>{t("tfSemiannual")}</option><option value={4}>{t("tfQuarterly")}</option>
            </select>
          </label>
          {scenario === "amortizing" && <label className="tf-frequency">{t("tfStructure")}
            <select value={bond.principalPayments.length === 1 ? "bullet" : "amortizing"} onChange={(e) => {
              const count = e.target.value === "bullet" ? 1 : 4;
              const years = Math.min(2, bond.maturity);
              onBond(i, { principalPayments: Array.from({ length: count }, (_, j) => ({
                time: bond.maturity - years + (j + 1) * years / count, amount: 100 / count,
              })) });
            }}>
              <option value="bullet">{t("tfBullet")}</option><option value="amortizing">{t("tfAmortizing")}</option>
            </select>
          </label>}
          {scenario === "amortizing" && bond.principalPayments.length > 1 && <NumberInput label={t("tfInstallments")} value={bond.principalPayments.length} onChange={(count) => {
            const n = Math.max(2, Math.round(count));
            const years = Math.min(2, bond.maturity);
            onBond(i, { principalPayments: Array.from({ length: n }, (_, j) => ({
              time: bond.maturity - years + (j + 1) * years / n, amount: 100 / n,
            })) });
          }} min={2} max={12} step={1} />}
        </>}
      </div>
      {bonds.length > 1 && <button type="button" className="tf-remove" onClick={() => onRemove(i)}>{t("tfRemove")}</button>}
    </fieldset>)}
    <button type="button" className="tf-add" onClick={onAdd}>{t("tfAddBond")}</button>
  </div>;
}
