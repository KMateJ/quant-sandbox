import BondInputs from "../../../components/BondInputs";
import SliderField from "../../../components/SliderField";
import { useI18n } from "../../../i18n";
import type { BondSpec } from "../../../lib/finance/bond";

type BondParametersProps = {
  bond: BondSpec;
  maxYtm: number;
  onChange: (patch: Partial<BondSpec>) => void;
};

const MIN_YTM = 0.001;
const pct = (v: number, digits = 2) => `${(v * 100).toFixed(digits)}%`;

/// The shared bond block plus a yield slider with a "par" mark at the coupon rate.
export default function BondParameters({ bond, maxYtm, onChange }: BondParametersProps) {
  const { t } = useI18n();
  const marks = [
    { value: MIN_YTM, label: pct(MIN_YTM, 0) },
    ...(bond.couponRate > MIN_YTM && bond.couponRate < maxYtm
      ? [{ value: bond.couponRate, label: `${t("bondYtmParMark")} ${pct(bond.couponRate, 0)}` }]
      : []),
    { value: maxYtm, label: pct(maxYtm, 0) },
  ];

  return (
    <div className="bond-params">
      <BondInputs value={bond} onChange={onChange} />
      <div className="bond-ytm-slider">
        <SliderField
          sectionId="ytm"
          label={t("bondYtmLabel")}
          min={MIN_YTM}
          max={maxYtm}
          step={0.0005}
          value={bond.ytm}
          onChange={(ytm) => onChange({ ytm })}
          formatValue={(v) => pct(v)}
          marks={marks}
        />
      </div>
    </div>
  );
}
