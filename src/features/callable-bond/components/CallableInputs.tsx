import BondInputs from "../../../components/BondInputs";
import NumberInput from "../../../components/NumberInput";
import { Panel } from "../../../components/layout";
import { useI18n } from "../../../i18n";
import type { BondSpec } from "../../../lib/finance/bond";
import type { CallableModel } from "../useCallable";

/// Terms of the bond: the shared coupon / maturity / frequency block plus the call price and protection.
export default function CallableInputs({ lab }: { lab: CallableModel }) {
  const { t } = useI18n();
  const { url, setUrl } = lab;
  const bond: BondSpec = { face: 100, couponRate: url.c, ytm: url.y, years: url.m, freq: Number(url.freq) };
  const onBond = (patch: Partial<BondSpec>) =>
    setUrl({
      ...(patch.couponRate !== undefined && { c: patch.couponRate }),
      ...(patch.years !== undefined && { m: patch.years }),
      ...(patch.freq !== undefined && { freq: String(patch.freq) as typeof url.freq }),
    });
  return (
    <Panel title={t("cbInputs")}>
      <BondInputs value={bond} onChange={onBond} showFace={false} />
      <div className="num-grid cb-call-grid">
        <NumberInput label={t("cbCallPrice")} value={url.call} onChange={(call) => setUrl({ call })} min={90} max={120} step={1} />
        <NumberInput label={t("cbProtection")} value={lab.spec.protection} onChange={(prot) => setUrl({ prot })} min={1} max={url.m} step={1} suffix={t("biYears")} />
      </div>
      <p className="cb-hint">{t(lab.callable ? "cbInputsHint" : "cbNotCallable")}</p>
    </Panel>
  );
}
