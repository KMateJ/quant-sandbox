import SliderField from "../../../components/SliderField";
import type { Regression } from "../../../lib/stats/regression";
import { useI18n } from "../../../i18n";
import CapmResults from "./CapmResults";

type Props = {
  regression: Regression;
  correlation: number;
  dispersion: number;
  onDispersion: (v: number) => void;
};

const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

/// Dispersion control plus the regression statistics that define beta.
export default function BetaStats({ regression, correlation, dispersion, onDispersion }: Props) {
  const { t } = useI18n();

  return (
    <div className="capm-beta-stats">
      <SliderField
        label={t("capmDispersion")}
        min={0.005}
        max={0.08}
        step={0.005}
        value={dispersion}
        onChange={onDispersion}
        formatValue={pct}
      />
      <CapmResults
        rows={[
          { label: t("capmBetaEstimate"), value: regression.slope.toFixed(2) },
          { label: t("capmAlphaIntercept"), value: pct(regression.intercept) },
          { label: t("capmCorrelation"), value: correlation.toFixed(2) },
          { label: t("capmR2"), value: regression.r2.toFixed(2) },
        ]}
      />
    </div>
  );
}
