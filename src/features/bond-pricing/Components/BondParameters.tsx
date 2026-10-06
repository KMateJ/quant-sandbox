import NumberInput from "../../../components/NumberInput";
import SliderField from "../../../components/SliderField";
import { useI18n } from "../../../i18n";

type BondParametersProps = {
  face: number;
  coupon: number;
  years: number;
  freq: number;
  ytm: number;
  maxYtm: number;
  onFace: (v: number) => void;
  onCoupon: (v: number) => void;
  onYears: (v: number) => void;
  onFreq: (v: number) => void;
  onYtm: (v: number) => void;
};

/// Compact precise controls: numeric inputs + a frequency select + a YTM slider.
export default function BondParameters({
  face,
  coupon,
  years,
  freq,
  ytm,
  maxYtm,
  onFace,
  onCoupon,
  onYears,
  onFreq,
  onYtm,
}: BondParametersProps) {
  const { t } = useI18n();
  const pct = (v: number) => `${(v * 100).toFixed(2)}%`;
  const pct0 = (v: number) => `${(v * 100).toFixed(0)}%`;

  const min = 0.001;
  const marks = [
    { value: min, label: pct0(min) },
    ...(coupon > min && coupon < maxYtm
      ? [{ value: coupon, label: `${t("bondYtmParMark")} ${pct0(coupon)}` }]
      : []),
    { value: maxYtm, label: pct0(maxYtm) },
  ];

  return (
    <div className="bond-params">
      <div className="num-grid">
        <NumberInput label={t("bondFaceLabel")} value={face} onChange={onFace} min={1} step={1} />
        <NumberInput sectionId="coupon-rate" label={t("bondCouponLabel")} value={coupon} onChange={onCoupon} min={0} max={0.3} step={0.0025} percent />
        <NumberInput label={t("bondMaturityLabel")} value={years} onChange={onYears} min={1} max={30} step={1} />
        <label className="num-field">
          <span className="num-label">{t("bondFrequencyLabel")}</span>
          <select
            className="bond-select"
            value={freq}
            onChange={(e) => onFreq(Number(e.target.value))}
          >
            <option value={1}>{t("bondFreqAnnual")}</option>
            <option value={2}>{t("bondFreqSemiannual")}</option>
            <option value={4}>{t("bondFreqQuarterly")}</option>
          </select>
        </label>
      </div>

      <div className="bond-ytm-slider">
        <SliderField
          sectionId="ytm"
          label={t("bondYtmLabel")}
          min={min}
          max={maxYtm}
          step={0.0005}
          value={ytm}
          onChange={onYtm}
          formatValue={pct}
          marks={marks}
        />
      </div>
    </div>
  );
}
