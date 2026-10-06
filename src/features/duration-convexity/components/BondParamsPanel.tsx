import { useI18n } from "../../../i18n";
import NumberInput from "../../../components/NumberInput";
import { ControlGroup, Tabs } from "../../../components/ui";
import { IntuitionTrigger } from "../../../components/intuition";
import type { DcModel } from "../useDurationConvexity";

type Props = { model: DcModel };

/// Compact base-bond definition (numeric inputs + frequency select) and its
/// current risk measures as an aligned label/value list — no per-metric cards.
export default function BondParamsPanel({ model }: Props) {
  const { t } = useI18n();
  const m = model.measures;
  const num = (v: number, d = 2) => v.toFixed(d);

  const freqItems = [
    { id: "1", label: t("dcFreqAnnual") },
    { id: "2", label: t("dcFreqSemi") },
    { id: "4", label: t("dcFreqQuarterly") },
  ];

  return (
    <>
      <div className="num-grid dc-param-grid">
        <NumberInput label={t("dcFaceLabel")} value={model.face} onChange={model.setFace} min={1} step={10} />
        <NumberInput sectionId="coupon-rate" label={t("dcCouponLabel")} value={model.couponRate} onChange={model.setCouponRate} percent min={0} max={0.2} step={0.25} />
        <NumberInput label={t("dcMaturityLabel")} value={model.years} onChange={model.setYears} min={1} max={30} step={1} suffix={t("dcYearsSuffix")} />
        <NumberInput sectionId="ytm" label={t("dcYtmLabel")} value={model.ytm} onChange={model.setYtm} percent min={0.001} max={0.2} step={0.25} />
      </div>

      <ControlGroup label={t("dcFrequencyLabel")}>
        <Tabs
          segmented
          items={freqItems}
          value={String(model.freq)}
          onChange={(id) => model.setFreq(Number(id))}
          ariaLabel={t("dcFrequencyLabel")}
        />
      </ControlGroup>

      <ControlGroup label={t("dcMeasuresLabel")}>
        <dl className="measure-list">
          <div className="measure-row">
            <dt>{t("dcPrice")}<IntuitionTrigger sectionId="price" /></dt>
            <dd>{num(m.price)}</dd>
          </div>
          <div className="measure-row">
            <dt>{t("dcMacaulay")}<IntuitionTrigger sectionId="macaulay-duration" /></dt>
            <dd>{num(m.macaulay)}</dd>
          </div>
          <div className="measure-row">
            <dt>
              {t("dcModified")}
              <IntuitionTrigger sectionId="modified-duration" />
            </dt>
            <dd>{num(m.modified)}</dd>
          </div>
          <div className="measure-row">
            <dt>
              {t("dcConvexity")}
              <IntuitionTrigger sectionId="convexity" />
            </dt>
            <dd>{num(m.convexity, 1)}</dd>
          </div>
          <div className="measure-row">
            <dt>
              {t("dcDv01")}
              <IntuitionTrigger sectionId="dv01" />
            </dt>
            <dd>{num(m.dv01, 4)}</dd>
          </div>
        </dl>
      </ControlGroup>
    </>
  );
}
