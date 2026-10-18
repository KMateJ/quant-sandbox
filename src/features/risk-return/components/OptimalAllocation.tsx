import SliderField from "../../../components/SliderField";
import { ControlGroup } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import { RR_RANGES } from "../riskReturn.url";
import type { RiskReturnLab } from "../useRiskReturnLab";

const pct0 = (v: number) => `${(v * 100).toFixed(0)}%`;

/// Risk-aversion slider, the optimal risky weight y* and a shortcut that applies it.
export default function OptimalAllocation({ lab }: { lab: RiskReturnLab }) {
  const { t } = useI18n();
  const { state, set, yStar, yFeasible } = lab;
  const clamped = Math.abs(yStar - yFeasible) > 1e-9;
  const applied = Math.abs(state.w - Math.round(yFeasible * 100) / 100) < 1e-9;

  return (
    <ControlGroup label={t("riskReturnOptimalGroup")}>
      <SliderField
        label={t("riskReturnRiskAversionLabel")}
        min={RR_RANGES.riskAversion[0]}
        max={RR_RANGES.riskAversion[1]}
        step={0.1}
        value={state.A}
        onChange={(A) => set({ A })}
        formatValue={(v) => v.toFixed(1)}
      />
      <p className="control-hint">
        {t("riskReturnOptimalReadout", { value: pct0(yStar) })}
        {clamped && ` ${t("riskReturnOptimalClamped", { value: pct0(yFeasible) })}`}
      </p>
      <button type="button" className="preset-btn" onClick={lab.useOptimal} disabled={applied}>
        {t("riskReturnUseOptimal")}
      </button>
    </ControlGroup>
  );
}
