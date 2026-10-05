import NumberInput from "../../../components/NumberInput";
import SliderField from "../../../components/SliderField";
import { ControlGroup, InfoTooltip } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import { alphaColor } from "../capm.colors";
import CapmResults from "./CapmResults";

type Props = {
  riskFree: number;
  marketReturn: number;
  beta: number;
  actualReturn: number;
  required: number;
  premium: number;
  jensenAlpha: number;
  maxBeta: number;
  onRiskFree: (v: number) => void;
  onMarketReturn: (v: number) => void;
  onBeta: (v: number) => void;
  onActualReturn: (v: number) => void;
};

const pct = (v: number) => `${(v * 100).toFixed(1)}%`;
const signed = (v: number) => `${v >= 0 ? "+" : ""}${(v * 100).toFixed(1)}%`;

/// Market and selected-asset controls with inline, non-editable derived values.
export default function CapmControls({
  riskFree,
  marketReturn,
  beta,
  actualReturn,
  required,
  premium,
  jensenAlpha,
  maxBeta,
  onRiskFree,
  onMarketReturn,
  onBeta,
  onActualReturn,
}: Props) {
  const { t } = useI18n();

  return (
    <>
      <ControlGroup label={t("capmMarketSection")}>
        <div className="num-grid capm-market-grid">
          <NumberInput label={t("capmRiskFreeLabel")} value={riskFree} onChange={onRiskFree} min={0} max={0.1} step={0.1} percent />
          <NumberInput label={t("capmMarketLabel")} value={marketReturn} onChange={onMarketReturn} min={0} max={0.25} step={0.1} percent />
        </div>
        <CapmResults rows={[{ label: t("capmPremium"), value: pct(premium) }]} />
      </ControlGroup>

      <ControlGroup label={t("capmAssetSection")}>
        <div className="controls-grid">
          <SliderField label={t("capmBetaLabel")} min={0} max={maxBeta} step={0.05} value={beta} onChange={onBeta} formatValue={(v) => v.toFixed(2)} />
          <SliderField label={t("capmActualLabel")} min={0} max={0.25} step={0.005} value={actualReturn} onChange={onActualReturn} formatValue={pct} />
        </div>
        <CapmResults
          rows={[
            { label: t("capmExpectedReturn"), value: pct(required) },
            { label: t("capmActualReturnFull"), value: pct(actualReturn) },
            {
              label: (
                <>
                  {t("capmAlpha")}
                  <InfoTooltip content={t("capmAlphaHelp")} />
                </>
              ),
              value: signed(jensenAlpha),
              accent: alphaColor(jensenAlpha),
            },
          ]}
        />
      </ControlGroup>
    </>
  );
}
