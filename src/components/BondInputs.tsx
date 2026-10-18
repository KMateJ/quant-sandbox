import NumberInput from "./NumberInput";
import { ControlGroup, Tabs } from "./ui";
import { IntuitionTrigger } from "./intuition";
import { useI18n } from "../i18n";
import type { BondSpec } from "../lib/finance/bond";

type Props = {
  value: BondSpec;
  onChange: (patch: Partial<BondSpec>) => void;
  /// Include the yield as a numeric input (labs that drive the yield with a slider or drag handle leave it out).
  showYtm?: boolean;
};

const FREQS = [1, 2, 4] as const;
const FREQ_KEY = { 1: "biAnnual", 2: "biSemiannual", 4: "biQuarterly" } as const;

/// The one bond definition block: face, coupon, maturity, optional yield, and payment frequency.
export default function BondInputs({ value, onChange, showYtm = false }: Props) {
  const { t } = useI18n();
  return (
    <>
      <div className="num-grid">
        <NumberInput sectionId="face-value" label={t("biFace")} value={value.face} onChange={(face) => onChange({ face })} min={1} step={10} />
        <NumberInput sectionId="coupon-rate" label={t("biCoupon")} value={value.couponRate} onChange={(couponRate) => onChange({ couponRate })} percent min={0} max={0.3} step={0.25} />
        <NumberInput sectionId="maturity" label={t("biMaturity")} value={value.years} onChange={(years) => onChange({ years })} min={1} max={30} step={1} suffix={t("biYears")} />
        {showYtm && (
          <NumberInput sectionId="ytm" label={t("biYtm")} value={value.ytm} onChange={(ytm) => onChange({ ytm })} percent min={0.001} max={0.3} step={0.25} />
        )}
      </div>
      <ControlGroup label={<span className="intuition-reveal">{t("biFrequency")}<IntuitionTrigger sectionId="payment-frequency" /></span>}>
        <Tabs
          segmented
          items={FREQS.map((f) => ({ id: String(f), label: t(FREQ_KEY[f]) }))}
          value={String(value.freq)}
          onChange={(id) => onChange({ freq: Number(id) })}
          ariaLabel={t("biFrequency")}
        />
      </ControlGroup>
    </>
  );
}
