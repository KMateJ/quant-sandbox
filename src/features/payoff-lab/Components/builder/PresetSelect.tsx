import type { PresetKey } from "../../payoff.types";
import { useI18n } from "../../../../i18n";

type Props = {
  selectedPreset: PresetKey | null;
  onClear: () => void;
  onApply: (preset: PresetKey) => void;
};

/// Dropdown of example strategies grouped by family; "custom" means hand-built legs.
export default function PresetSelect({ selectedPreset, onClear, onApply }: Props) {
  const { t } = useI18n();
  return (
    <div className="payoff-preset-bar">
      <label className="payoff-field">
        <span className="payoff-label">{t("payoffPresetLabel")}</span>
        <select
          className="payoff-select"
          value={selectedPreset ?? "custom"}
          onChange={(e) => {
            if (e.target.value === "custom") {
              onClear();
              return;
            }

            onApply(e.target.value as PresetKey);
          }}
        >
          <option value="custom">{t("payoffPresetCustom")}</option>

          <optgroup label={t("payoffPresetGroupBasics")}>
            <option value="long-call">Long Call</option>
            <option value="long-put">Long Put</option>
            <option value="long-stock">Long Stock</option>
            <option value="cash">Cash</option>
          </optgroup>

          <optgroup label={t("payoffPresetGroupStrategies")}>
            <option value="covered-call">Covered Call</option>
            <option value="protective-put">Protective Put</option>
            <option value="collar">Collar</option>
            <option value="bull-call-spread">Bull Call Spread</option>
            <option value="bear-put-spread">Bear Put Spread</option>
            <option value="long-straddle">Long Straddle</option>
            <option value="short-straddle">Short Straddle</option>
            <option value="long-strangle">Long Strangle</option>
            <option value="short-strangle">Short Strangle</option>
            <option value="risk-reversal">Risk Reversal</option>
            <option value="long-call-butterfly">Call Butterfly</option>
            <option value="box-spread">Box Spread</option>
          </optgroup>

          <optgroup label={t("payoffPresetGroupSynthetic")}>
            <option value="synthetic-long-forward">
              Synthetic Long Forward
            </option>
            <option value="synthetic-short-forward">
              Synthetic Short Forward
            </option>
          </optgroup>

          <optgroup label={t("payoffGroupExotic")}>
            <option value="digital-call">Digital Call</option>
            <option value="digital-put">Digital Put</option>
            <option value="asset-call">Asset-or-Nothing Call</option>
            <option value="gap-call">Gap Call</option>
            <option value="double-digital">Double Digital</option>
            <option value="supershare">Supershare</option>
          </optgroup>
        </select>
      </label>
    </div>
  );
}
