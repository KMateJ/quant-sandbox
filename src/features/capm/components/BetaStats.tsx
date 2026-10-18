import SliderField from "../../../components/SliderField";
import SeedControl from "../../../components/SeedControl";
import type { Regression } from "../../../lib/stats/regression";
import { useI18n } from "../../../i18n";
import CapmResults from "./CapmResults";

type Props = {
  regression: Regression;
  correlation: number;
  /// β and the intercept stay hidden until the reader's line is revealed.
  revealed: boolean;
  dispersion: number;
  onDispersion: (v: number) => void;
  seed: number;
  onSeed: (v: number) => void;
};

const pct = (v: number) => `${(v * 100).toFixed(1)}%`;
const HIDDEN = "?";

/// Dispersion and sample controls plus the regression statistics that define beta.
export default function BetaStats({ regression, correlation, revealed, dispersion, onDispersion, seed, onSeed }: Props) {
  const { t } = useI18n();

  return (
    <div className="capm-beta-stats">
      <div className="capm-beta-controls">
        <SliderField
          label={t("capmDispersion")}
          min={0.005}
          max={0.08}
          step={0.005}
          value={dispersion}
          onChange={onDispersion}
          formatValue={pct}
        />
        <SeedControl seed={seed} setSeed={onSeed} compact />
      </div>
      <CapmResults
        rows={[
          { label: t("capmBetaEstimate"), value: revealed ? regression.slope.toFixed(2) : HIDDEN },
          { label: t("capmAlphaIntercept"), value: revealed ? pct(regression.intercept) : HIDDEN },
          { label: t("capmCorrelation"), value: correlation.toFixed(2) },
          { label: t("capmR2"), value: regression.r2.toFixed(2) },
        ]}
      />
    </div>
  );
}
