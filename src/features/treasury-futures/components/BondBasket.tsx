import NumberInput from "../../../components/NumberInput";
import { sliderFill } from "../../../components/sliderFill";
import { useI18n } from "../../../i18n";
import { amortizedPayments } from "../basket.math";
import type { DeliverableBond } from "../treasuryFutures.math";
import type { TreasuryFuturesModel } from "../useTreasuryFutures";

const F_MIN = 50;
const F_MAX = 200;

/// Futures price as one labelled number field with a range slider over the same 50–200 span.
function FuturesControl({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const { t } = useI18n();
  return <div className="tf-futures">
    <NumberInput label={t("tfFuturesPrice")} value={value} onChange={onChange} min={F_MIN} max={F_MAX} step={0.01} sectionId="net-basis" />
    <input type="range" className="slider-input" data-layout-allow="range input: the 22px coarse-pointer thumb is the tap target" min={F_MIN} max={F_MAX} step={0.25} value={value} aria-label={t("tfFuturesPrice")}
      style={sliderFill(value, F_MIN, F_MAX)} onChange={(e) => onChange(Number(e.target.value))} />
  </div>;
}

/// Scenario settings and one fieldset per deliverable bond, with add/remove.
export default function BondBasket({ lab }: { lab: TreasuryFuturesModel }) {
  const { t } = useI18n();
  const { data, updateBond: onBond, updateSetting: onSetting } = lab;
  const scenario = data.id;
  const schedule = (i: number, bond: DeliverableBond, count: number) => onBond(i, { principalPayments: amortizedPayments(bond.maturity, count) });
  return <div className="tf-controls">
    {scenario !== "bund" && <FuturesControl value={lab.futures} onChange={lab.setFutures} />}
    <NumberInput label={t("tfNotionalCoupon")} value={data.notionalCoupon} onChange={(v) => onSetting({ notionalCoupon: v })} min={0} max={0.2} step={0.25} percent sectionId="conversion-factor" />
    {scenario === "bund" ? <label className="tf-frequency">{t("tfDeliveryDate")}
      <input type="date" value={data.deliveryDate ?? ""} onChange={(e) => onSetting({ deliveryDate: e.target.value })} />
    </label> : <NumberInput label={t("tfDelivery")} value={data.delivery} onChange={(v) => onSetting({ delivery: v })} min={0} max={40} step={0.25} />}
    {scenario === "amortizing" && <NumberInput label={t("tfMarketYield")} value={data.marketYield} onChange={(v) => onSetting({ marketYield: v })} min={-0.05} max={0.3} step={0.25} percent />}
    {data.bonds.map((bond, i) => <fieldset className="tf-bond" key={bond.id}>
      <legend>{t("tfBondId", { id: bond.id })}</legend>
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
            <select value={bond.principalPayments.length === 1 ? "bullet" : "amortizing"}
              onChange={(e) => schedule(i, bond, e.target.value === "bullet" ? 1 : 4)}>
              <option value="bullet">{t("tfBullet")}</option><option value="amortizing">{t("tfAmortizing")}</option>
            </select>
          </label>}
          {scenario === "amortizing" && bond.principalPayments.length > 1 && <NumberInput label={t("tfInstallments")} value={bond.principalPayments.length}
            onChange={(count) => schedule(i, bond, Math.max(2, Math.round(count)))} min={2} max={12} step={1} />}
        </>}
      </div>
      {data.bonds.length > 1 && <button type="button" className="tf-remove" onClick={() => lab.removeBond(i)}>{t("tfRemove")}</button>}
    </fieldset>)}
    <button type="button" className="tf-add" onClick={lab.addBond}>{t("tfAddBond")}</button>
  </div>;
}
