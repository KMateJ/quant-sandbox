import { useState } from "react";
import NumberStepper from "../../../../components/NumberStepper";
import { SegmentedControl } from "../../../../components/ui";
import { useI18n } from "../../../../i18n";
import type { ExposureType } from "../../engine/systemic.types";
import { TYPE_ORDER } from "../network.types";
import type { NetworkPageModel } from "../useNetworkPage";

/// Add a new exposure (type and amount) or change / delete an existing one (amount only; the type is fixed).
export default function ExposureForm({ m }: { m: NetworkPageModel }) {
  const { t } = useI18n();
  const target = m.form;
  const existing = target?.kind === "edit" ? m.net.exposures.find((e) => e.id === target.id) : undefined;
  const [type, setType] = useState<ExposureType>("interbank");
  const [amount, setAmount] = useState(existing?.amount ?? 10);
  if (!target || (target.kind === "edit" && !existing)) return null;

  const lender = existing?.lender ?? (target.kind === "new" ? target.lender : "");
  const borrower = existing?.borrower ?? (target.kind === "new" ? target.borrower : "");
  const shown = existing?.type ?? type;
  const close = () => m.setForm(null);
  const save = () => {
    if (existing) m.setAmount(existing.id, amount);
    else m.addExposure(lender, borrower, type, amount);
    close();
  };

  return (
    <form className="syr-form" onSubmit={(e) => { e.preventDefault(); save(); }} aria-label={t(existing ? "syrFormChange" : "syrFormNew")}>
      <p className="syr-form-title">
        <strong>{t(existing ? "syrFormChange" : "syrFormNew")}</strong>{" "}
        {t("syrFormPair", { lender: m.labelOf(lender), borrower: m.labelOf(borrower) })}
      </p>
      {existing ? (
        <p>{t(`syrType_${shown}`)}</p>
      ) : (
        <SegmentedControl<ExposureType> ariaLabel={t("syrFormType")} value={type} onChange={setType} options={TYPE_ORDER.map((v) => ({ value: v, label: t(`syrType_${v}`) }))} />
      )}
      <NumberStepper label={t("syrFormAmount")} value={amount} min={1} max={200} onChange={setAmount} formatValue={(v) => `$${v}bn`} />
      {shown !== "interbank" && <p className="control-hint">{t(`syrFormCollateral_${shown}`)}</p>}
      <div className="syr-form-actions">
        <button type="submit" className="preset-btn preset-btn--active">{t("syrFormSave")}</button>
        {existing && <button type="button" className="preset-btn" onClick={() => { m.deleteExposure(existing.id); close(); }}>{t("syrFormDelete")}</button>}
        <button type="button" className="preset-btn" onClick={close}>{t("syrFormCancel")}</button>
      </div>
    </form>
  );
}
